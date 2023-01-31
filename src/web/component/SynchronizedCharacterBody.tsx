import useGameBodyEvent from '@/package/hook/role/body/useGameBodyEvent'
import useGameEvent from '@/package/hook/role/body/util/useGameEvent'
import GameInterpolation from '@/package/Model/GameInterpolation'
import { useGameMatterContext } from '@/package/Renderer/GameMatterContext'
import withGameLogic from '@/package/Renderer/withGameLogic'
import { communicators } from '@/web/App'
import { CharacterBodyShape } from '@/web/component/MyCharacterBody'
import MyGameFactory from '@/web/Model/MyGameFactory'
import { latencyState } from '@/web/recoil/atom'
import { Body } from 'matter-js'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export const SynchronizedCharacterBody = withGameLogic(
  CharacterBodyShape,
  ({ gameBody }) => {
    const { addGameEvents } = useGameEvent()
    const { getOffsettingGravityEvent } = useGameBodyEvent(gameBody)
    const { gamePainter } = useGameMatterContext()
    const latency = useRecoilValue(latencyState)

    useEffect(() => {
      const interpolation = new GameInterpolation({
        minPoint: 3,
        maxFrameCountToNextPoint: 1
      })

      const communicator =
        communicators[gameBody.options.gameId as keyof typeof communicators]

      if (!communicator) {
        console.warn('There is no communicator')
        return
      }

      communicator.receive((message) => {
        const { x, y } = message.position
        interpolation.addDestination({ x, y })

        const point = MyGameFactory.createDestinationPoint(
          message.position,
          'blue'
        )
        gamePainter.spawnGameBody(point)

        setTimeout(() => {
          gamePainter.unspawnGameBody(point)
        }, (latency.value > 100 ? latency.value : 100) * 10)
      })

      const syncGameBody = () => {
        const position = interpolation.popPoint()

        if (position) {
          const point = MyGameFactory.createDestinationPoint(position)
          gamePainter.spawnGameBody(point)

          setTimeout(
            () => {
              gamePainter.unspawnGameBody(point)
            },
            latency.value > 100 ? latency.value : 100
          )

          Body.setPosition(gameBody, {
            x: position.x,
            y: position.y
          })
        }
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
