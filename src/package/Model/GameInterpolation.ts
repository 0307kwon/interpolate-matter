import { interpolateBasis, quantize } from 'd3-interpolate'

interface Destination {
  value: number
  calculated: boolean
}

export default class GameInterpolation {
  private minPoint: number
  private frameCountToNextPoint: number
  private destinations: Destination[] = []
  private points: number[] = []
  private lastPoint: number | undefined

  /**
   * @param param.minPoint 보간 연산에 사용할 최소점 갯수
   * @param param.frameCountToNextPoint 다음 점까지 걸리는 프레임 수
   */
  constructor(param: { minPoint: number; frameCountToNextPoint: number }) {
    this.minPoint = param.minPoint
    this.frameCountToNextPoint = param.frameCountToNextPoint
  }

  addDestination(...destinations: number[]) {
    if (
      this.destinations[destinations.length - 1] &&
      Math.abs(
        destinations[0] - this.destinations[destinations.length - 1].value
      ) < 0.5
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
    if (this.destinations.length < this.minPoint) {
      return null
    }

    if (this.points.length > 0) {
      return this.points.shift()
    }

    // points가 더 이상 없으면 추가.
    // 계산되지 않은 포인트 최소 하나 이상 포함.
    const uncalculatedDestinationIdx = this.destinations.findIndex(
      (dest) => !dest.calculated
    )

    if (uncalculatedDestinationIdx < 0) {
      return null
    }

    if (uncalculatedDestinationIdx !== this.destinations.length - 1) {
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
        this.frameCountToNextPoint * (this.minPoint - 1) + 1
      )
        .map((value) => +value.toFixed(2))
        .slice(1)

      this.points.push(...points)

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
    const points = quantize(
      interpolateBasis(destinationValues),
      this.frameCountToNextPoint * (this.minPoint - 1) + 1
    )
      .filter(
        (v) => v >= this.destinations[uncalculatedDestinationIdx - 1].value
      )
      .map((value) => +value.toFixed(2))

    this.points.push(...points)
    this.destinations.shift()

    return this.points.shift()
  }
}
