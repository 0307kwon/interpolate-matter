import { useGameMatterContext } from '@/package/Renderer/GameMatterContext'
import { GameBody, GameEvent } from '@/package/types'
import { Body, Collision, Query } from 'matter-js'
import { useCallback } from 'react'

const useGameBodyEvent = (gameBody: GameBody) => {
  const { gamePainter, gameStore } = useGameMatterContext()

  const getOutOfViewEvent = useCallback(
    (callbackWhenOutOfView: () => void): GameEvent => {
      const whenOutOfView = () => {
        const isOutOfView =
          gameBody.position.y >= gamePainter.getConfig().resolution.height + 400

        if (isOutOfView) {
          callbackWhenOutOfView()
        }
      }

      return whenOutOfView
    },
    []
  )

  const getCollisionEvent = useCallback(
    (
      gameBodies: GameBody[] | (() => GameBody[]),
      whenCollide: (collisions: Collision[]) => void
    ): GameEvent => {
      const collisionCallback = () => {
        const collisions = Query.collides(
          gameBody,
          gameBodies instanceof Array ? gameBodies : gameBodies()
        )

        if (collisions.length > 0) {
          whenCollide(collisions)
        }
      }

      return collisionCallback
    },
    []
  )

  const getOffsettingGravityEvent = useCallback((): GameEvent => {
    const gravity = gameStore.engine.gravity

    const offsetGravity = () => {
      Body.applyForce(gameBody, gameBody.position, {
        x: -gravity.x * gravity.scale * gameBody.mass,
        y: -gravity.y * gravity.scale * gameBody.mass
      })
    }

    return offsetGravity
  }, [])

  return {
    getOutOfViewEvent,
    getCollisionEvent,
    getOffsettingGravityEvent
  }
}

export default useGameBodyEvent
