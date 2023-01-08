import { GameBody, GameEvent } from '@/package'
import useGameEvent from '@/package/hook/role/body/util/useGameEvent'
import useKeyDown from '@/package/hook/role/body/util/useKeyDown'
import useCharacterInterface from '@/package/hook/role/useCharacterInterface'
import GameBodyShape from '@/package/Renderer/GameBodyShape'
import withGameLogic from '@/package/Renderer/withGameLogic'
import { communicator } from '@/web/App'
import NameTag from '@/web/component/NameTag'
import characterImg from '@/web/public/img/character.gif'
import { CharacterBodyOptions } from '@/web/type'
import { useEffect } from 'react'

export interface BodyShapeProps {
  gameBody: GameBody<CharacterBodyOptions>
}

export const CharacterBodyShape = ({ gameBody }: BodyShapeProps) => {
  return (
    <GameBodyShape gameBody={gameBody} bodyImgSrc={characterImg}>
      <NameTag
        name={'test'}
        style={{
          position: 'absolute',
          top: '-30px'
        }}
      />
    </GameBodyShape>
  )
}

const CharacterBody = withGameLogic(CharacterBodyShape, ({ gameBody }) => {
  const { moveLeft, moveRight, jump } = useCharacterInterface(gameBody)
  const { setContinualKeyInput, setInstantKeyInput } = useKeyDown()
  const { addGameEvents } = useGameEvent()

  useEffect(() => {
    setContinualKeyInput({
      KeyA: moveLeft,
      KeyD: moveRight
    })

    setInstantKeyInput({
      KeyW: jump
    })

    let beforeTimeStamp = 0
    const sendGameBodyPosition: GameEvent = (e) => {
      if (e.timestamp - beforeTimeStamp < 100) {
        return
      }
      beforeTimeStamp = e.timestamp
      console.log('전송')

      const message = {
        position: {
          ...gameBody.position
        },
        angle: gameBody.angle
      }

      setTimeout(() => {
        communicator.send(message)
      }, 150)
    }

    return addGameEvents(sendGameBodyPosition)
  }, [])
})

export default CharacterBody
