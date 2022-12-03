import { GameBodyOptions } from "@/package";
import GameFactory from "@/package/Model/GameFactory";
import { INITIAL_CHARACTER_SIZE, RESOLUTION } from "@/web/config";
import { MATTER_TYPE } from "@/web/type";

interface CharacterBodyOptions extends GameBodyOptions {
  gameId: string;
  speed: number;
  jumpVelocity: number;
}

export default class MyGameFactory extends GameFactory {
  private createBasicCharacterBody({
    matterType,
    gameId,
  }: {
    matterType: MATTER_TYPE;
    gameId: string;
  }) {
    const gameBody = this.createGameBody<CharacterBodyOptions>({
      width: INITIAL_CHARACTER_SIZE.width,
      height: INITIAL_CHARACTER_SIZE.height,
      x: RESOLUTION.width / 2,
      y: -100,
      chamfer: {
        radius: [40, 40, 0, 0],
      },
      customOption: {
        matterType,
        gameId,
        speed: 0.015,
        jumpVelocity: 10,
      },
      frictionAir: 0.03,
      friction: 0.01,
      density: 0.008,
    });

    return gameBody;
  }

  createMyCharacterBody(gameId: string) {
    const character = this.createBasicCharacterBody({
      matterType: MATTER_TYPE.myCharacter,
      gameId,
    });

    return character;
  }
}
