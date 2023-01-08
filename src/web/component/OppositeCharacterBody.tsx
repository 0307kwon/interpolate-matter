import useGameEvent from '@/package/hook/role/body/util/useGameEvent'
import withGameLogic from '@/package/Renderer/withGameLogic'
import { communicator } from '@/web/App'
import { CharacterBodyShape } from '@/web/component/CharacterBody'
import { Body, Vector } from 'matter-js'
import { useEffect } from 'react'

export const OppositeCharacterBody = withGameLogic(
  CharacterBodyShape,
  ({ gameBody }) => {
    const { addGameEvents } = useGameEvent()

    useEffect(() => {
      let nextFrameStatusQueue: { position: Vector; angle?: number }[] = []

      communicator.receive((message) => {
        if (nextFrameStatusQueue.length > 4) {
          nextFrameStatusQueue = []
        }

        nextFrameStatusQueue.push(message)
      })

      const syncGameBodyEvent = () => {
        const nextFrameStatus = nextFrameStatusQueue.shift()

        if (nextFrameStatus) {
          Body.setPosition(gameBody, nextFrameStatus.position)

          if (nextFrameStatus.angle) {
            Body.setAngle(gameBody, nextFrameStatus.angle)
          }
        }
      }

      return addGameEvents({
        name: 'afterUpdate',
        event: syncGameBodyEvent
      })
    }, [])
  }
)
