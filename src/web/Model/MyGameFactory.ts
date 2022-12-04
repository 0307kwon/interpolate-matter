import GameFactory from "@/package/Model/GameFactory";
import { INITIAL_CHARACTER_SIZE, RESOLUTION } from "@/web/config";
import { CharacterBodyOptions, MATTER_TYPE } from "@/web/type";

export default class MyGameFactory extends GameFactory {
  static createBasicCharacterBody({
    matterType,
    gameId,
  }: {
    matterType: MATTER_TYPE;
    gameId: string;
  }) {
    const gameBody = MyGameFactory.createGameBody<CharacterBodyOptions>({
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

  static createMyCharacterBody(gameId: string) {
    const character = MyGameFactory.createBasicCharacterBody({
      matterType: MATTER_TYPE.myCharacter,
      gameId,
    });

    return character;
  }

  static createWall(param: {
    width: number;
    thickness: number;
    angle?: number;
    x: number;
    y: number;
  }) {
    const wall = MyGameFactory.createGameBody({
      ...param,
      height: param.thickness,
      isStatic: true,
      customOption: {
        matterType: MATTER_TYPE.wall,
      },
    });

    return wall;
  }
}
