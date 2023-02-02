import {
  calcNewPoints,
  calcNewPointsInitially,
  Dest,
  getStartPointIdx,
  isMinDestCountSatisfied,
  Point,
  similarValue
} from '@/package/Model/GameInterpolation/util'

export default class GameInterpolation {
  private minDestCount: number
  private maxFrameCountToNextDest: number
  private dests: Dest[] = []
  private points: Point[] = []
  private shouldCalculateInitially = true
  private hasSameDestsFlag = false

  /**
   * @param param.minDestCount 보간 연산에 사용할 최소점 갯수
   * @param param.maxFrameCountToNextDest 다음 점까지 걸리는 최대 프레임 수
   */
  constructor(param: {
    minDestCount: number
    maxFrameCountToNextDest: number
  }) {
    if (param.minDestCount <= 1) {
      throw new Error('minDestCount should be greater than one')
    }

    this.minDestCount = param.minDestCount
    this.maxFrameCountToNextDest = param.maxFrameCountToNextDest
  }

  private getAddableDests({
    dests,
    hasSameDestsFlag
  }: {
    dests: Point[]
    hasSameDestsFlag: boolean
  }): {
    result: 'success' | 'hasSameDestFlag' | 'hasSimilarValue'
    addableDests: Point[]
  } {
    if (!isMinDestCountSatisfied(this.dests, this.minDestCount)) {
      return {
        result: 'success',
        addableDests: [...dests]
      }
    }

    if (
      this.dests[dests.length - 1] &&
      similarValue(dests[0].x, this.dests[this.dests.length - 1].value.x) &&
      similarValue(dests[0].y, this.dests[this.dests.length - 1].value.y)
    ) {
      return {
        result: 'hasSimilarValue',
        addableDests: []
      }
    }

    if (hasSameDestsFlag) {
      return {
        result: 'hasSameDestFlag',
        addableDests: [...dests]
      }
    }

    return {
      result: 'success',
      addableDests: [...dests]
    }
  }

  private getNewPointsByDests({
    startPointIdx,
    shouldCalculateInitially
  }: {
    startPointIdx: number
    shouldCalculateInitially: boolean
  }): {
    result:
      | 'initialCalculation'
      | 'laterCalculation'
      | 'minDestCountNotSatisfied'
      | 'startPointNotExist'
      | 'isAllDestPointsSimilar'
    points: Point[]
  } {
    if (!isMinDestCountSatisfied(this.dests, this.minDestCount)) {
      return {
        result: 'minDestCountNotSatisfied',
        points: []
      }
    }

    if (shouldCalculateInitially) {
      // 초기 연산 O
      const points = calcNewPointsInitially({
        dests: this.dests,
        maxFrameCountToNextDest: this.maxFrameCountToNextDest,
        minDestCount: this.minDestCount
      })

      return {
        result: 'initialCalculation',
        points
      }
    }

    // 초기 연산 X
    const { result, points } = calcNewPoints({
      startPointIdx,
      dests: this.dests,
      maxFrameCountToNextDest: this.maxFrameCountToNextDest,
      minDestCount: this.minDestCount,
      hasSameDestsFlag: this.hasSameDestsFlag
    })

    if (result === 'isAllDestPointsSimilar') {
      return {
        result,
        points: []
      }
    }

    return {
      result: 'laterCalculation',
      points
    }
  }

  private addNewDests = (...dests: Point[]) => {
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

  addDest(...dests: Point[]): boolean {
    /**
     * dests 추가
     */
    const { result: addableResult, addableDests } = this.getAddableDests({
      dests,
      hasSameDestsFlag: this.hasSameDestsFlag
    })

    if (addableDests.length === 0) {
      return false
    }

    // 비슷한 값의 종착점이 여러개 있는 상태에서, 다른 값의 종착점이 들어왔을 때의 처리.
    if (addableResult === 'hasSameDestFlag') {
      this.hasSameDestsFlag = false
      // 이전 점, 현재 점으로 2개의 점이 필요
      this.dests = this.dests.slice(-2)
      this.dests[0].calculated = true
      this.dests[1].calculated = true
    }

    this.addNewDests(...addableDests)

    /**
     * 추가된 dests에 대한 points 계산
     * */
    const startPointIdx = getStartPointIdx(this.dests)

    if (startPointIdx < 0) {
      return true
    }

    const { result, points } = this.getNewPointsByDests({
      startPointIdx,
      shouldCalculateInitially: this.shouldCalculateInitially
    })

    if (result === 'initialCalculation') {
      ;[...Array(this.minDestCount)].forEach((_, idx) => {
        this.dests[idx].calculated = true
      })

      this.shouldCalculateInitially = false
    } else if (result === 'laterCalculation') {
      const startPointIdx = getStartPointIdx(this.dests)
      // 계산 완료 상태로 변경
      for (let i = 0; i < this.minDestCount - 1; i++) {
        this.dests[startPointIdx + 1 + i].calculated = true
      }

      // 다음 연산부터 필요한 dest만 남기고 모두 제거.
      this.dests = this.dests.slice(startPointIdx - 1)
    } else if (result === 'isAllDestPointsSimilar') {
      // 계산할 종착점이 모두 비슷하니 종착점 더이상 넣지마라. 라고 명령.
      this.hasSameDestsFlag = true
    }

    this.points.push(...points)

    return true
  }

  popPoint(): Point | undefined {
    if (this.points.length > 0) {
      return this.points.shift()
    }

    return
  }
}
