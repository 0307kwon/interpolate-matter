import { GameBody, GameBodyOptions } from "@/package/types";
import { radian } from "@/package/Util";
import Matter, { Bodies, Body } from "matter-js";

type CreateGameBodyOptions<T extends GameBodyOptions> =
  Matter.IChamferableBodyDefinition & {
    width: number;
    height: number;
    x: number;
    y: number;
    customOption: Omit<T, "initialMatterInfo" | "size">;
  };

/**
 * create gameBody with custom options
 * this class is responsible for creating gameBody
 */
export default class GameFactory {
  protected constructor() {
    throw new Error("please use class by static");
  }

  static createGameBody<T extends GameBodyOptions = GameBodyOptions>(
    createOption: CreateGameBodyOptions<T>
  ): GameBody<T> {
    const x = createOption.x;
    const y = createOption.y;
    const width = createOption.width;
    const height = createOption.height;

    const option: CreateGameBodyOptions<T> = {
      render: {
        fillStyle: "rgba(0,0,0,0)",
      },
      ...createOption,
      angle: radian(createOption.angle ?? 0),
    };

    const body = Bodies.rectangle(x, y, width, height, option);

    Body.set(body, {
      options: {
        ...createOption.customOption,
        size: {
          width,
          height,
        },
        initialMatterInfo: {
          position: {
            x,
            y,
          },
          size: {
            width,
            height,
          },
        },
      },
    });

    return body as GameBody<T>;
  }
}
