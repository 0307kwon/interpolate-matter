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

export default class GameInterpolation {
  private minPoint: number
  private maxFrameCountToNextPoint: number
  private destinations: Destination[] = []
  private points: Point[] = []
  private isInitialCalculation: boolean = true
  private lastPoint: Point | undefined

  /**
   * @param param.minPoint 보간 연산에 사용할 최소점 갯수
   * @param param.maxFrameCountToNextPoint 다음 점까지 걸리는 최대 프레임 수
   */
  constructor(param: { minPoint: number; maxFrameCountToNextPoint: number }) {
    this.minPoint = param.minPoint
    this.maxFrameCountToNextPoint = param.maxFrameCountToNextPoint
  }

  addDestination(...dests: Point[]) {
    // TODO: minPoint 채울 때까지 같은 포인트라도 추가하기
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

    this.destinations.push(
      ...dests.map((value) => ({
        calculated: false,
        value: {
          x: +value.x.toFixed(2),
          y: +value.y.toFixed(2)
        }
      }))
    )
  }

  private calcPoints(
    destinationPoints: Point[],
    samplingCount: number
  ): Point[] {
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

    // console.log(points)

    return points
  }

  popPoint(): Point | undefined {
    const returnValue: Point | undefined = (() => {
      if (this.destinations.length < this.minPoint) {
        return
      }

      if (this.points.length > 0) {
        return this.points.shift()
      }

      // 더 이상 추가적인 종착지가 존재하지 않을 때, 마지막 종착지를 포인트로 리턴한다.
      if (
        !this.isInitialCalculation &&
        this.destinations.length === this.minPoint &&
        this.destinations.every((d) => d.calculated)
      ) {
        const newLastPoint =
          this.destinations[this.destinations.length - 1].value

        return newLastPoint
      }

      // points가 더 이상 없으면 연산을 통해 추가.
      // 계산되지 않은 포인트 최소 하나 이상 포함.
      const uncalculatedDestinationIdx = this.destinations.findIndex(
        (dest) => !dest.calculated
      )

      if (uncalculatedDestinationIdx < 0) {
        return
      }

      // 계산되지 않은 종착점 갯수가 최소 point 갯수보다 작으면 탈출
      if (
        this.destinations.length - uncalculatedDestinationIdx <
        this.minPoint
      ) {
        return
      }

      if (this.isInitialCalculation) {
        // 최초 연산 o
        const destinationPoints = this.destinations
          .slice(
            uncalculatedDestinationIdx,
            uncalculatedDestinationIdx + this.minPoint
          )
          .map((dest, idx) => {
            this.destinations[idx].calculated = true
            return dest.value
          })

        const points = this.calcPoints(
          destinationPoints,
          this.maxFrameCountToNextPoint * (this.minPoint - 1) + 1
        ).slice(1)

        this.points.push(...points)

        this.isInitialCalculation = false

        // console.log(points, '최초 연산 o')

        return this.points.shift()
      }

      // 최초 연산 x
      const destinationPoints = this.destinations
        .slice(uncalculatedDestinationIdx - 1, uncalculatedDestinationIdx + 3)
        .map((v) => v.value)
      // const [startPoint, endPoint] = destinationPoints.slice(-2)

      ;[...new Array(this.minPoint - 1)].forEach((_, idx) => {
        this.destinations[uncalculatedDestinationIdx + idx].calculated = true
      })

      // TODO: Cardinal Interpolation 보간법 쓰자.

      // 연산되지 않은 1개의 포인트를 포함하여 보간을 계산한다.
      const points = this.calcPoints(
        destinationPoints,
        this.maxFrameCountToNextPoint * (this.minPoint - 1) + 1
      )
      // TODO: 여기서 짤리는듯!!!!!
      // .slice(-this.maxFrameCountToNextPoint)
      // .filter((v) => {
      //   const betweenX =
      //     startPoint.x >= endPoint.x
      //       ? startPoint.x >= v.x && endPoint.x <= v.x
      //       : startPoint.x <= v.x && endPoint.x >= v.x
      //   const betweenY =
      //     startPoint.y >= endPoint.y
      //       ? startPoint.y >= v.y && endPoint.y <= v.y
      //       : startPoint.y <= v.y && endPoint.y >= v.y

      //   return betweenX && betweenY
      // })

      console.log(points, '이거라고?')

      this.points.push(...points)
      this.destinations.shift()

      // console.log(points, points.length, '최초 연산 x', destinationPoints)

      return this.points.shift()
    })()

    if (
      this.lastPoint &&
      returnValue &&
      this.lastPoint.x === returnValue.x &&
      this.lastPoint.y === returnValue.y
    ) {
      return
    }

    this.lastPoint = returnValue

    return returnValue
  }
}
