import { GameBody, GameBodyOptions } from "@/package/types";
import Matter, { Bodies, Body } from "matter-js";

type CreateGameBodyOptions<T extends GameBodyOptions> =
  Matter.IChamferableBodyDefinition & {
    width: number;
    height: number;
    x: number;
    y: number;
    customOption: T;
  };

export default abstract class AbstractGameFactory {
  static createGameBody<T extends GameBodyOptions>(
    createOption: CreateGameBodyOptions<T>
  ): GameBody {
    const x = createOption.x;
    const y = createOption.y;
    const width = createOption.width;
    const height = createOption.height;

    const option = {
      render: {
        fillStyle: "rgba(0,0,0,0)",
      },
      ...createOption,
    };

    const body = Bodies.rectangle(x, y, width, height, option);

    Body.set(body, {
      options: {
        ...createOption.customOption,
      },
    });

    return body as GameBody<T>;
  }

  protected abstract createMyCharacterBody<
    T extends GameBodyOptions
  >(): GameBody<T>;
}
