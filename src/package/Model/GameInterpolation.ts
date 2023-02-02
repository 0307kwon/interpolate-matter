import { quantize } from 'd3-interpolate'
import { interpolateCardinal } from 'd3-interpolate-curve'

interface Point {
  x: number
  y: number
}

interface Destination {
  value: Point
  calculated: boolean
}

const similarValue = (valueA: number, valueB: number) => {
  return Math.abs(valueA - valueB) < 0.5
}

const getUncalculatedDestIdx = (dests: Destination[]) => {
  return dests.findIndex((dest) => !dest.calculated)
}

const getStartPointIdx = (dests: Destination[]) => {
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
  private minPoint: number
  private maxFrameCountToNextPoint: number
  private destinations: Destination[] = []
  private points: Point[] = []
  private isInitialCalculation = true
  private hasSameDestsFlag = false

  /**
   * @param param.minPoint 보간 연산에 사용할 최소점 갯수
   * @param param.maxFrameCountToNextPoint 다음 점까지 걸리는 최대 프레임 수
   */
  constructor(param: { minPoint: number; maxFrameCountToNextPoint: number }) {
    this.minPoint = param.minPoint
    this.maxFrameCountToNextPoint = param.maxFrameCountToNextPoint
  }

  isMinPointCountSatisfied() {
    if (getStartPointIdx(this.destinations) === 0) {
      return this.getUncalculatedDestCount(this.destinations) >= this.minPoint
    }

    return this.getUncalculatedDestCount(this.destinations) + 1 >= this.minPoint
  }

  addDestination(...dests: Point[]) {
    // TODO: minPoint 채울 때까지 같은 포인트라도 추가하기
    const pushNewDests = () => {
      this.destinations.push(
        ...dests.map((value) => ({
          calculated: false,
          value: {
            x: +value.x.toFixed(2),
            y: +value.y.toFixed(2)
          }
        }))
      )

      console.log(this.destinations.map((dest) => ({ ...dest })))
    }

    if (!this.isMinPointCountSatisfied()) {
      pushNewDests()
      return true
    }

    if (
      this.destinations[dests.length - 1] &&
      similarValue(
        dests[0].x,
        this.destinations[this.destinations.length - 1].value.x
      ) &&
      similarValue(
        dests[0].y,
        this.destinations[this.destinations.length - 1].value.y
      )
    ) {
      return false
    }

    if (this.hasSameDestsFlag) {
      this.hasSameDestsFlag = false
      // 이전 점, 현재 점으로 2개의 점이 필요
      this.destinations = this.destinations.slice(-2)
      this.destinations[0].calculated = true
      this.destinations[1].calculated = true
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

  // 계산되지 않은 종착점 갯수
  private getUncalculatedDestCount = (dests: Destination[]) => {
    const uncalculatedDestIdx = getUncalculatedDestIdx(dests)

    if (uncalculatedDestIdx < 0) {
      return 0
    }

    return this.destinations.length - uncalculatedDestIdx
  }

  popPoint(): Point | undefined {
    const returnValue: Point | undefined = (() => {
      if (this.points.length > 0) {
        return this.points.shift()
      }

      if (!this.isMinPointCountSatisfied()) {
        return
      }

      // points가 더 이상 없으면 연산을 통해 추가.
      // 계산되지 않은 포인트 최소 하나 이상 포함.
      const startPointIdx = getStartPointIdx(this.destinations)

      if (startPointIdx < 0) {
        return
      }

      if (this.isInitialCalculation) {
        // 최초 연산 o
        const points = this.calcPoints(
          section(this.destinations, startPointIdx, [0, this.minPoint - 1]).map(
            (dest) => {
              return dest.value
            }
          ),
          this.maxFrameCountToNextPoint * (this.minPoint - 1) + 1
        ).slice(1)

        this.points.push(...points)
        ;[...Array(this.minPoint)].forEach((_, idx) => {
          this.destinations[idx].calculated = true
        })

        this.isInitialCalculation = false

        return this.points.shift()
      }

      const destsForCalc = section(
        this.destinations,
        startPointIdx,
        // 이전의 점을 1개 포함하여, 이전 이동 맥락을 파악
        [1, this.minPoint - 1]
      ).map((v) => v.value)

      // 연산에 필요한 점들이 모두 비슷한 점이면 연산하지 않음.
      if (
        this.hasSameDestsFlag ||
        [...Array(destsForCalc.length - 1)].every((_, idx) => {
          if (idx === 0) return true

          return (
            similarValue(destsForCalc[idx].x, destsForCalc[1 + idx].x) &&
            similarValue(destsForCalc[idx].y, destsForCalc[1 + idx].y)
          )
        })
        // this.getUncalculatedDestCount(this.destinations) < this.minPoint
      ) {
        this.hasSameDestsFlag = true
        return
      }

      // 최초 연산 x
      const points = this.calcPoints(
        destsForCalc,
        // 이전의 점을 1개 포함했기 대문에 minPoint보다 1개 더 추가
        this.maxFrameCountToNextPoint * (this.minPoint - 1 + 1) + 1
      )
        .reduce<Point[]>((prev, cur) => {
          const newPoints = [...prev]

          if (newPoints.length > 0) {
            newPoints.push(cur)

            return newPoints
          }

          if (
            similarValue(cur.x, this.destinations[startPointIdx].value.x) &&
            similarValue(cur.y, this.destinations[startPointIdx].value.y)
          ) {
            newPoints.push(cur)
          }

          return newPoints
        }, [])
        // 시작점 제외
        .slice(1)

      // 계산 완료 상태로 변경
      ;[...new Array(this.minPoint - 1)].forEach((_, idx) => {
        this.destinations[startPointIdx + 1 + idx].calculated = true
      })

      this.points.push(...points)
      this.destinations = this.destinations.slice(startPointIdx - 1)

      console.log(
        this.destinations.map((d) => ({ ...d })),
        destsForCalc,
        this.destinations[startPointIdx],
        this.calcPoints(
          destsForCalc,
          // 이전의 점을 1개 포함했기 대문에 minPoint보다 1개 더 추가
          this.maxFrameCountToNextPoint * (this.minPoint - 1 + 1) + 1
        )
      )

      return this.points.shift()
    })()

    return returnValue
  }
}
