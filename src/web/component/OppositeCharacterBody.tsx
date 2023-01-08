import withGameLogic from '@/package/Renderer/withGameLogic'
import { CharacterBodyShape } from '@/web/component/CharacterBody'

const OppositeCharacterBody = withGameLogic(
  CharacterBodyShape,
  ({ gameBody }) => {}
)

export default OppositeCharacterBody
