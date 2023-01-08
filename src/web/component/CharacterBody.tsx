import { GameBody } from '@/package'
import useKeyDown from '@/package/hook/role/body/util/useKeyDown'
import useCharacterInterface from '@/package/hook/role/useCharacterInterface'
import GameBodyShape from '@/package/Renderer/GameBodyShape'
import withGameLogic from '@/package/Renderer/withGameLogic'
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

  useEffect(() => {
    setContinualKeyInput({
      KeyA: moveLeft,
      KeyD: moveRight
    })

    setInstantKeyInput({
      KeyW: jump
    })
  }, [])
})

export default CharacterBody
