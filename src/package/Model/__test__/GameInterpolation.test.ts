import GameInterpolation from '@/package/Model/GameInterpolation'
import { describe, expect, test } from '@jest/globals'

describe('GameInterpolation.popPoint', () => {
  test('4개의 종착지로 포인트를 최초 연산했을 때, 6개의 포인트가 출력된다.', () => {
    const frameCountToNextPoint = 2
    const minPoint = 4
    const interpolation = new GameInterpolation({
      minPoint,
      maxFrameCountToNextPoint: frameCountToNextPoint
    })

    const points: number[] = []

    interpolation.addDestination(1, 2, 7, 15)
    ;[...Array(frameCountToNextPoint * (minPoint - 1))].forEach(() => {
      const point = interpolation.popPoint()
      if (typeof point === 'number') {
        points.push(point)
      }
    })

    expect(points).toEqual([1.58, 2.67, 4.65, 7.5, 11.06, 15])
  })

  test('4개의 종착지로 포인트를 연산했을 때, 2개의 포인트가 출력된다.', () => {
    const frameCountToNextPoint = 2
    const minPoint = 4
    const interpolation = new GameInterpolation({
      minPoint,
      maxFrameCountToNextPoint: frameCountToNextPoint
    })

    const points: number[] = []

    interpolation.addDestination(-1, -2, -7, -15)
    ;[...Array(frameCountToNextPoint * (minPoint - 1))].forEach(() => {
      interpolation.popPoint()
    })

    interpolation.addDestination(-30)
    ;[...Array(frameCountToNextPoint)].forEach(() => {
      const point = interpolation.popPoint()
      if (typeof point === 'number') {
        points.push(point)
      }
    })

    expect(points).toEqual([-22.65, -30])
  })

  test('이전과 비슷한 값이 종착지로 추가되었을 때 무시한다.', () => {
    const frameCountToNextPoint = 2
    const interpolation = new GameInterpolation({
      minPoint: 3,
      maxFrameCountToNextPoint: frameCountToNextPoint
    })

    interpolation.addDestination(1)

    expect(interpolation.addDestination(1.4)).toBe(false)
  })

  test('실전 테스트', () => {
    const frameCountToNextPoint = 2
    const minPoint = 4
    const interpolation = new GameInterpolation({
      minPoint,
      maxFrameCountToNextPoint: frameCountToNextPoint
    })

    interpolation.addDestination(640)
    interpolation.addDestination(636.9272741394226)
    interpolation.addDestination(618.2735290857645)
    interpolation.addDestination(585.2813083317385)

    interpolation.addDestination(540.3455387259505)
    interpolation.addDestination(485.4611272871425)
    interpolation.addDestination(422.2897757143638)
    interpolation.addDestination(352.2156350034651)
    interpolation.addDestination(276.39166418458433)
    interpolation.addDestination(198.85097171323386)
    interpolation.addDestination(140.57363250062554)
    interpolation.addDestination(110.26045544663096)

    const points: number[] = []

    ;[...Array(frameCountToNextPoint * (12 - 1))].forEach(() => {
      const point = interpolation.popPoint()
      if (typeof point === 'number') {
        points.push(point)
      }
    })

    expect(points).toEqual([
      638.14, 634.33, 626.98, 615.88, 601.48, 585.28, 562.56, 540.35, 512.7,
      453.7, 422.29, 387.11, 352.22, 314.18, 237.59, 170.11, 126, 110.26
    ])
  })
})
