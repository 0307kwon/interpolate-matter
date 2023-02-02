import { quantize } from 'd3-interpolate'
import { interpolateCardinal } from 'd3-interpolate-curve'

interface Point {
  x: number
  y: number
}

/**
 * Destination point
 */
interface Dest {
  value: Point
  calculated: boolean
}

const clone = <T extends Object>(array: T[]): T[] => {
  return array.map((d) => ({ ...d }))
}

const similarValue = (valueA: number, valueB: number) => {
  return Math.abs(valueA - valueB) < 0.5
}

const getUncalculatedDestIdx = (dests: Dest[]) => {
  return dests.findIndex((dest) => !dest.calculated)
}

const getStartPointIdx = (dests: Dest[]) => {
  const uncalculatedDestIdx = getUncalculatedDestIdx(dests)

  if (uncalculatedDestIdx === 0) {
    return 0
  }

  // 계산되지 않은 idx의 이전 idx가 시작 지점이므로.
  return uncalculatedDestIdx - 1
}

export const section = <T>(
  array: T[],
  criterionIdx: number,
  counts: [number, number]
) => {
  const [leftCount, rightCount] = counts
  let result = [...array]

  result = result.slice(0, criterionIdx + rightCount + 1)
  result = result.slice(criterionIdx - leftCount)

  return result
}

export default class GameInterpolation {
  private minDestCount: number
  private maxFrameCountToNextDest: number
  private dests: Dest[] = []
  private points: Point[] = []
  private isInitialCalculation = true
  private hasSameDestsFlag = false

  /**
   * @param param.minDestCount 보간 연산에 사용할 최소점 갯수
   * @param param.maxFrameCountToNextDest 다음 점까지 걸리는 최대 프레임 수
   */
  constructor(param: {
    minDestCount: number
    maxFrameCountToNextDest: number
  }) {
    this.minDestCount = param.minDestCount
    this.maxFrameCountToNextDest = param.maxFrameCountToNextDest
  }

  isMinDestCountSatisfied() {
    if (getStartPointIdx(this.dests) === 0) {
      return this.getUncalculatedDestCount(this.dests) >= this.minDestCount
    }

    return this.getUncalculatedDestCount(this.dests) + 1 >= this.minDestCount
  }

  private addNewDests(...dests: Point[]) {
    const pushNewDests = () => {
      this.dests.push(
        ...dests.map((value) => ({
          calculated: false,
          value: {
            x: +value.x.toFixed(2),
            y: +value.y.toFixed(2)
          }
        }))
      )
    }

    if (!this.isMinDestCountSatisfied()) {
      pushNewDests()
      return true
    }

    if (
      this.dests[dests.length - 1] &&
      similarValue(dests[0].x, this.dests[this.dests.length - 1].value.x) &&
      similarValue(dests[0].y, this.dests[this.dests.length - 1].value.y)
    ) {
      return false
    }

    if (this.hasSameDestsFlag) {
      this.hasSameDestsFlag = false
      // 이전 점, 현재 점으로 2개의 점이 필요
      this.dests = this.dests.slice(-2)
      this.dests[0].calculated = true
      this.dests[1].calculated = true
    }

    pushNewDests()

    return true
  }

  private calcPoints(
    destinationPoints: Point[],
    samplingCount: number
  ): Point[] {
    // Cardinal Interpolation 보간법. 반드시 모든 제어점을 지난다.
    const xPoints = quantize(
      interpolateCardinal(destinationPoints.map((v) => v.x)),
      samplingCount
    )
    const yPoints = quantize(
      interpolateCardinal(destinationPoints.map((v) => v.y)),
      samplingCount
    )

    const points = [...Array(samplingCount)].map((_, idx) => ({
      x: +xPoints[idx].toFixed(2),
      y: +yPoints[idx].toFixed(2)
    }))

    return points
  }

  // 최초 연산
  private calcNewPointsInitially({
    dests,
    minDestCount,
    maxFrameCountToNextDest
  }: {
    dests: Dest[]
    minDestCount: number
    maxFrameCountToNextDest: number
  }): Point[] {
    const points = this.calcPoints(
      section(dests, 0, [0, minDestCount - 1]).map((dest) => {
        return dest.value
      }),
      maxFrameCountToNextDest * (minDestCount - 1) + 1
    ).slice(1)

    return points
  }

  // 최초 연산 x
  private calcNewPoints({
    startPointIdx,
    dests,
    minDestCount,
    maxFrameCountToNextDest,
    hasSameDestsFlag
  }: {
    startPointIdx: number
    dests: Dest[]
    minDestCount: number
    maxFrameCountToNextDest: number
    hasSameDestsFlag?: boolean
  }): {
    result: 'isAllDestPointsSimilar' | 'success'
    points: Point[]
  } {
    const destPointsForCalc = section(
      dests,
      startPointIdx,
      // 이전의 점을 1개 포함하여, 이전 이동 맥락을 파악
      [1, minDestCount - 1]
    ).map((v) => v.value)

    // 연산에 필요한 점들이 모두 비슷한 점이면 연산하지 않음.
    const isAllDestPointsSimilar = [
      ...Array(destPointsForCalc.length - 1)
    ].every((_, idx) => {
      if (idx === 0) return true

      return (
        similarValue(destPointsForCalc[idx].x, destPointsForCalc[1 + idx].x) &&
        similarValue(destPointsForCalc[idx].y, destPointsForCalc[1 + idx].y)
      )
    })

    if (hasSameDestsFlag || isAllDestPointsSimilar) {
      return {
        result: 'isAllDestPointsSimilar',
        points: []
      }
    }

    const points = this.calcPoints(
      destPointsForCalc,
      // 이전의 점을 1개 포함했기 대문에 minPoint보다 1개 더 추가
      maxFrameCountToNextDest * (minDestCount - 1 + 1) + 1
    )
      .reduce<Point[]>((prev, cur) => {
        const newPoints = [...prev]

        if (newPoints.length > 0) {
          newPoints.push(cur)

          return newPoints
        }

        if (
          similarValue(cur.x, dests[startPointIdx].value.x) &&
          similarValue(cur.y, dests[startPointIdx].value.y)
        ) {
          newPoints.push(cur)
        }

        return newPoints
      }, [])
      // 시작점 제외
      .slice(1)

    return {
      result: 'success',
      points
    }
  }

  private getNewPointsByDests(): Point[] {
    if (!this.isMinDestCountSatisfied()) {
      return []
    }

    if (this.isInitialCalculation) {
      const points = this.calcNewPointsInitially({
        dests: this.dests,
        maxFrameCountToNextDest: this.maxFrameCountToNextDest,
        minDestCount: this.minDestCount
      })

      // TODO: 액션
      ;[...Array(this.minDestCount)].forEach((_, idx) => {
        this.dests[idx].calculated = true
      })

      // TODO: 액션
      this.isInitialCalculation = false

      return points
    }

    const startPointIdx = getStartPointIdx(this.dests)

    if (startPointIdx < 0) {
      return []
    }

    const { result, points } = this.calcNewPoints({
      startPointIdx,
      dests: this.dests,
      maxFrameCountToNextDest: this.maxFrameCountToNextDest,
      minDestCount: this.minDestCount,
      hasSameDestsFlag: this.hasSameDestsFlag
    })

    if (result === 'isAllDestPointsSimilar') {
      // 계산할 종착점이 모두 비슷하니 종착점 더이상 넣지마라. 라고 명령.
      this.hasSameDestsFlag = true
      return []
    }

    // TODO: 액션
    // 계산 완료 상태로 변경
    for (let i = 0; i < this.minDestCount - 1; i++) {
      this.dests[startPointIdx + 1 + i].calculated = true
    }

    // TODO: 액션
    // 다음 연산부터 필요한 dest만 남기고 모두 제거.
    this.dests = this.dests.slice(startPointIdx - 1)

    return points
  }

  addDestination(...dests: Point[]): Dest[] {
    this.addNewDests(...dests)
    const points = this.getNewPointsByDests()

    this.points.push(...points)

    return clone(this.dests)
  }

  // 계산되지 않은 종착점 갯수
  private getUncalculatedDestCount = (dests: Dest[]) => {
    const uncalculatedDestIdx = getUncalculatedDestIdx(dests)

    if (uncalculatedDestIdx < 0) {
      return 0
    }

    return this.dests.length - uncalculatedDestIdx
  }

  popPoint(): Point | undefined {
    if (this.points.length > 0) {
      return this.points.shift()
    }

    return
  }
}
