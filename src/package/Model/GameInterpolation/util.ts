import { quantize } from 'd3-interpolate'
import { interpolateCardinal } from 'd3-interpolate-curve'

export interface Point {
  x: number
  y: number
}

/**
 * Destination point
 */
export interface Dest {
  value: Point
  calculated: boolean
}

export const similarValue = (valueA: number, valueB: number) => {
  return Math.abs(valueA - valueB) < 0.5
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

const getUncalculatedDestIdx = (dests: Dest[]) => {
  return dests.findIndex((dest) => !dest.calculated)
}

// 계산되지 않은 종착점 갯수
const getUncalculatedDestCount = (dests: Dest[]) => {
  const uncalculatedDestIdx = getUncalculatedDestIdx(dests)

  if (uncalculatedDestIdx < 0) {
    return 0
  }

  return dests.length - uncalculatedDestIdx
}

export const getStartPointIdx = (dests: Dest[]) => {
  const uncalculatedDestIdx = getUncalculatedDestIdx(dests)

  if (uncalculatedDestIdx === 0) {
    return 0
  }

  // 계산되지 않은 idx의 이전 idx가 시작 지점이므로.
  return uncalculatedDestIdx - 1
}

export const isMinDestCountSatisfied = (
  dests: Dest[],
  minDestCount: number
) => {
  if (getStartPointIdx(dests) === 0) {
    return getUncalculatedDestCount(dests) >= minDestCount
  }

  return getUncalculatedDestCount(dests) + 1 >= minDestCount
}

export const calcPoints = (
  destinationPoints: Point[],
  samplingCount: number
): Point[] => {
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
export const calcNewPointsInitially = ({
  dests,
  minDestCount,
  maxFrameCountToNextDest
}: {
  dests: Dest[]
  minDestCount: number
  maxFrameCountToNextDest: number
}): Point[] => {
  const points = calcPoints(
    section(dests, 0, [0, minDestCount - 1]).map((dest) => {
      return dest.value
    }),
    maxFrameCountToNextDest * (minDestCount - 1) + 1
  ).slice(1)

  return points
}

// 최초 연산 x
export const calcNewPoints = ({
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
} => {
  const destPointsForCalc = section(
    dests,
    startPointIdx,
    // 이전의 점을 1개 포함하여, 이전 이동 맥락을 파악
    [1, minDestCount - 1]
  ).map((v) => v.value)

  // 연산에 필요한 점들이 모두 비슷한 점이면 연산하지 않음.
  const isAllDestPointsSimilar = [...Array(destPointsForCalc.length - 1)].every(
    (_, idx) => {
      if (idx === 0) return true

      return (
        similarValue(destPointsForCalc[idx].x, destPointsForCalc[1 + idx].x) &&
        similarValue(destPointsForCalc[idx].y, destPointsForCalc[1 + idx].y)
      )
    }
  )

  if (hasSameDestsFlag || isAllDestPointsSimilar) {
    return {
      result: 'isAllDestPointsSimilar',
      points: []
    }
  }

  const points = calcPoints(
    destPointsForCalc,
    // 이전의 점을 1개 포함했기 대문에 minDestCount보다 1개 더 추가
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
