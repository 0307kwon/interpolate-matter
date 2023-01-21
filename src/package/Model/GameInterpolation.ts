import { interpolateBasis, quantize } from 'd3-interpolate'

interface Destination {
  value: number
  calculated: boolean
}

const similarValue = (valueA: number, valueB: number) => {
  return Math.abs(valueA - valueB) < 0.5
}

export default class GameInterpolation {
  private minPoint: number
  private maxFrameCountToNextPoint: number
  private destinations: Destination[] = []
  private points: number[] = []
  private isInitialCalculation: boolean = true
  private lastPoint: number | undefined

  /**
   * @param param.minPoint 보간 연산에 사용할 최소점 갯수
   * @param param.maxFrameCountToNextPoint 다음 점까지 걸리는 최대 프레임 수
   */
  constructor(param: { minPoint: number; maxFrameCountToNextPoint: number }) {
    this.minPoint = param.minPoint
    this.maxFrameCountToNextPoint = param.maxFrameCountToNextPoint
  }

  addDestination(...destinations: number[]) {
    if (
      this.destinations[destinations.length - 1] &&
      similarValue(
        destinations[0],
        this.destinations[destinations.length - 1].value
      )
    ) {
      return false
    }

    this.destinations.push(
      ...destinations.map((value) => ({
        calculated: false,
        value
      }))
    )
  }

  popPoint() {
    const returnValue: number | undefined = (() => {
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
          +this.destinations[this.destinations.length - 1].value.toFixed(2)

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

      if (this.isInitialCalculation) {
        // 최초 연산 o
        const destinationValues = this.destinations
          .slice(
            uncalculatedDestinationIdx,
            uncalculatedDestinationIdx + this.minPoint
          )
          .map((dest, idx) => {
            this.destinations[idx].calculated = true
            return dest.value
          })
        const points = quantize(
          interpolateBasis(destinationValues),
          this.maxFrameCountToNextPoint * (this.minPoint - 1) + 1
        )
          .map((value) => +value.toFixed(2))
          .slice(1)

        this.points.push(...points)

        this.isInitialCalculation = false

        return this.points.shift()
      }

      // 최초 연산 x
      this.destinations[uncalculatedDestinationIdx].calculated = true
      const destinationValues = this.destinations
        .slice(
          uncalculatedDestinationIdx - this.minPoint + 1,
          uncalculatedDestinationIdx + 1
        )
        .map((v) => v.value)
      const [startPoint, endPoint] = destinationValues.slice(-2)

      // 연산되지 않은 1개의 포인트를 포함하여 보간을 계산한다.
      const points = quantize(
        interpolateBasis(destinationValues),
        this.maxFrameCountToNextPoint * (this.minPoint - 1) + 1
      )
        .slice(-this.maxFrameCountToNextPoint)
        .map((value) => +value.toFixed(2))
        .filter((v) => {
          if (startPoint > endPoint) {
            return startPoint > v && endPoint <= v
          } else {
            return startPoint < v && endPoint >= v
          }
        })

      this.points.push(...points)
      this.destinations.shift()

      return this.points.shift()
    })()

    if (
      this.lastPoint &&
      returnValue &&
      similarValue(this.lastPoint, returnValue)
    ) {
      return
    }

    this.lastPoint = returnValue

    return returnValue
  }
}
