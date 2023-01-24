import useGameBodyEvent from '@/package/hook/role/body/useGameBodyEvent'
import useGameEvent from '@/package/hook/role/body/util/useGameEvent'
import GameInterpolation from '@/package/Model/GameInterpolation'
import withGameLogic from '@/package/Renderer/withGameLogic'
import { communicators } from '@/web/App'
import { CharacterBodyShape } from '@/web/component/MyCharacterBody'
import { Body } from 'matter-js'
import { useEffect } from 'react'

export const SynchronizedCharacterBody = withGameLogic(
  CharacterBodyShape,
  ({ gameBody }) => {
    const { addGameEvents } = useGameEvent()
    const { getOffsettingGravityEvent } = useGameBodyEvent(gameBody)

    useEffect(() => {
      const interpolationX = new GameInterpolation({
        minPoint: 2,
        maxFrameCountToNextPoint: 6
      })
      const interpolationY = new GameInterpolation({
        // TODO: 다른 사용자는 80fps? 정도로 높게. 나만 60fps로 고정
        minPoint: 2,
        maxFrameCountToNextPoint: 6
      })

      const communicator =
        communicators[gameBody.options.gameId as keyof typeof communicators]

      if (!communicator) {
        console.warn('There is no communicator')
        return
      }

      communicator.receive((message) => {
        const { x, y } = message.position
        interpolationX.addDestination(x)
        interpolationY.addDestination(y)
      })

      const syncGameBody = () => {
        const positionX = interpolationX.popPoint()
        const positionY = interpolationY.popPoint()

        Body.setPosition(gameBody, {
          x: positionX || gameBody.position.x,
          y: positionY || gameBody.position.y
        })
      }

      return addGameEvents(
        {
          name: 'afterUpdate',
          event: syncGameBody
        },
        getOffsettingGravityEvent()
      )
    }, [])
  }
)
