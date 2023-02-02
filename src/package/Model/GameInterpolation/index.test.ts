import GameInterpolation from '@/package/Model/GameInterpolation'
import { section } from '@/package/Model/GameInterpolation/util'
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

describe('addDestination', () => {
  // minPoint = 현재 point + 계산되지 않은 point 갯수
  test('현재 point 1개 + 계산되지 않은 point 갯수가 minPoint 미만이면 같은 종착점이라도 추가한다.', () => {
    const interpolation = new GameInterpolation({
      minDestCount: 2,
      maxFrameCountToNextDest: 1
    })

    let destCount = 0
    ;[...Array(2)].forEach(() => {
      const result = interpolation.addDest({
        x: 2,
        y: 2
      })

      if (result) {
        destCount += 1
      }
    })
    ;[...Array(1)].forEach(() => {
      interpolation.popPoint()
    })
    ;[...Array(1)].forEach(() => {
      const result = interpolation.addDest({
        x: 2,
        y: 2
      })

      if (result) {
        destCount += 1
      }
    })

    expect(destCount).toEqual(3)
  })

  test('같은 종착점에 대해서 여러번 point를 계산하지 않는다.', () => {
    const interpolation = new GameInterpolation({
      minDestCount: 3,
      maxFrameCountToNextDest: 1
    })

    interpolation.addDest(
      {
        x: 2,
        y: 2
      },
      {
        x: 2,
        y: 3
      },
      {
        x: 2,
        y: 4
      },
      {
        x: 2,
        y: 5
      },
      {
        x: 2,
        y: 5
      },
      {
        x: 2,
        y: 5
      }
    )

    let uncalculatedcount = 0
    // 초기 계산
    ;[...Array(5)].forEach(() => {
      const result = interpolation.popPoint()

      // 연산된 포인트가 존재하지 않을 때 undefined를 리턴
      if (result === undefined) {
        uncalculatedcount += 1
      }
    })

    // 연산하지 않는 횟수가 1회
    expect(uncalculatedcount).toEqual(1)
  })

  test('여러개의 같은 종착점 입력 이후 새로운 종착점이 입력되면 새로운 point가 출력된다.', () => {
    const interpolation = new GameInterpolation({
      minDestCount: 4,
      maxFrameCountToNextDest: 1
    })

    interpolation.addDest(
      {
        x: 2,
        y: 2
      },
      {
        x: 2,
        y: 3
      },
      {
        x: 2,
        y: 5
      },
      {
        x: 2,
        y: 5
      },
      {
        x: 2,
        y: 5
      },
      {
        x: 2,
        y: 5
      },
      {
        x: 2,
        y: 5
      }
    )

    // 초기 계산
    ;[...Array(4)].forEach(() => {
      const result = interpolation.popPoint()

      console.log(result)
    })

    interpolation.addDest(
      {
        x: 2,
        y: 4
      },
      {
        x: 2,
        y: 3
      },
      {
        x: 2,
        y: 2
      }
    )

    let result = interpolation.popPoint()

    // y값이 5 -> 4 방향으로 이동해야함.
    expect(result?.y).toBeLessThan(5)
  })

  // isMinPointCountSatisfied
  // test('첫 연산 시에는 minPoint만큼 미연산된 종착점이 있어야한다.', () => {
  //   const interpolation = new GameInterpolation({
  //     maxFrameCountToNextDest: 1,
  //     minDestCount: 3
  //   })

  //   interpolation.addDest({ x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 })

  //   expect(interpolation.isMinDestCountSatisfied()).toBe(true)
  // })

  // isMinPointCountSatisfied
  // test('첫 연산 이후부터 minPoint + 1 만큼 미연산된 종착점이 있어야한다.', () => {
  //   const interpolation = new GameInterpolation({
  //     maxFrameCountToNextDest: 1,
  //     minDestCount: 3
  //   })

  //   interpolation.addDest({ x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 })

  //   interpolation.popPoint()

  //   interpolation.addDest({ x: 1, y: 2 }, { x: 1, y: 3 })

  //   expect(interpolation.isMinDestCountSatisfied()).toBe(true)
  // })
})
