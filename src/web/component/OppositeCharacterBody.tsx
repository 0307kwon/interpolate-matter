import withGameLogic from '@/package/Renderer/withGameLogic'
import { communicator } from '@/web/App'
import { CharacterBodyShape } from '@/web/component/CharacterBody'
import { Body } from 'matter-js'
import { useEffect } from 'react'

export const OppositeCharacterBody = withGameLogic(
  CharacterBodyShape,
  ({ gameBody }) => {
    useEffect(() => {
      communicator.receive((message) => {
        Body.setPosition(gameBody, message.position)

        if (message.angle) {
          Body.setAngle(gameBody, message.angle)
        }
      })
    }, [])
  }
)
