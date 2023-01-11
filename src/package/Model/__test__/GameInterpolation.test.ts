import GameInterpolation from '@/package/Model/GameInterpolation'
import { describe, expect, test } from '@jest/globals'

describe('GameInterpolation.popPoint', () => {
  test('3개의 종착지로 포인트를 최초 연산했을 때, 4개의 포인트가 출력된다.', () => {
    const frameCountToNextPoint = 2
    const interpolation = new GameInterpolation({
      minPoint: 3,
      frameCountToNextPoint
    })

    const points: number[] = []

    interpolation.addDestination(1, 2, 7)
    ;[...Array(frameCountToNextPoint * 2)].forEach(() => {
      const point = interpolation.popPoint()
      if (typeof point === 'number') {
        points.push(point)
      }
    })

    expect(points).toEqual([1.58, 2.67, 4.58, 7])
  })

  test('3개의 종착지로 포인트를 연산했을 때, 2개의 포인트가 출력된다.', () => {
    const frameCountToNextPoint = 2
    const interpolation = new GameInterpolation({
      minPoint: 3,
      frameCountToNextPoint
    })

    const points: number[] = []

    interpolation.addDestination(1, 2, 7)
    ;[...Array(frameCountToNextPoint * 2)].forEach(() => {
      interpolation.popPoint()
    })

    interpolation.addDestination(9)
    ;[...Array(frameCountToNextPoint)].forEach(() => {
      const point = interpolation.popPoint()
      if (typeof point === 'number') {
        points.push(point)
      }
    })

    expect(points).toEqual([7.94, 9])
  })
})
