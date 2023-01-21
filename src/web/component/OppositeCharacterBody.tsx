import useGameEvent from '@/package/hook/role/body/util/useGameEvent'
import GameInterpolation from '@/package/Model/GameInterpolation'
import withGameLogic from '@/package/Renderer/withGameLogic'
import { communicator } from '@/web/App'
import { CharacterBodyShape } from '@/web/component/CharacterBody'
import { Body } from 'matter-js'
import { useEffect } from 'react'

export const OppositeCharacterBody = withGameLogic(
  CharacterBodyShape,
  ({ gameBody }) => {
    const { addGameEvents } = useGameEvent()

    useEffect(() => {
      const interpolationX = new GameInterpolation({
        minPoint: 4,
        maxFrameCountToNextPoint: 4
      })
      const interpolationY = new GameInterpolation({
        minPoint: 4,
        maxFrameCountToNextPoint: 4
      })

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

      return addGameEvents({
        name: 'afterUpdate',
        event: syncGameBody
      })
    }, [])
  }
)
