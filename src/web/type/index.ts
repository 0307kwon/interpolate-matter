import { GameBodyOptions } from '@/package'

export const enum MATTER_TYPE {
  myCharacter = 'myCharacter',
  otherCharacter = 'otherCharacter',
  wall = 'wall',
  point = 'point'
}

export interface CharacterBodyOptions extends GameBodyOptions {
  gameId: string
  speed: number
  jumpVelocity: number
}
