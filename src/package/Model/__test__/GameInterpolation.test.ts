import GameInterpolation, { section } from '@/package/Model/GameInterpolation'
import { describe, expect, test } from '@jest/globals'

describe('section', () => {
  test('기준 index에서 오른쪽으로 2개를 포함시킬 수 있다.', () => {
    const array = [1, 2, 3, 4, 5, 6, 7]

    expect(section(array, 2, [0, 2])).toEqual([3, 4, 5])
  })

  test('기준 index에서 왼쪽 1개를 포함시킬 수 있다.', () => {
    const array = [1, 2, 3, 4, 5, 6, 7]

    expect(section(array, 2, [1, 0])).toEqual([2, 3])
  })

  test('기준 index에서 왼쪽 1개, 오른쪽 2개를 포함시킬 수 있다.', () => {
    const array = [1, 2, 3, 4, 5, 6, 7]

    expect(section(array, 2, [1, 2])).toEqual([2, 3, 4, 5])
  })
})

describe('GameInterpolation class', () => {
  test('같은 종착점은 최대 minPoint만큼 쌓인다.', () => {
    const interpolation = new GameInterpolation({
      minPoint: 2,
      maxFrameCountToNextPoint: 10
    })

    let destCount = 0
    ;[...Array(3)].forEach(() => {
      const result = interpolation.addDestination({
        x: 2,
        y: 2
      })

      if (result) {
        destCount += 1
      }
    })

    expect(destCount).toEqual(2)
  })
})
