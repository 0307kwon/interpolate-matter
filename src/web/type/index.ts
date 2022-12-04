import { GameBodyOptions } from "@/package";

export const enum MATTER_TYPE {
  myCharacter = "myCharacter",
  wall = "wall",
}

export interface CharacterBodyOptions extends GameBodyOptions {
  gameId: string;
  speed: number;
  jumpVelocity: number;
}
