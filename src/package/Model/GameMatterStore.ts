import { GameBody, GameBodyOptions } from "@/package/types";
import { remove } from "lodash-es";
import { Engine, Events, Render, Runner } from "matter-js";

interface MatterCore {
  engine: Engine;
  render?: Render;
  runner?: Runner;
}

interface Constructor {
  engine: MatterCore["engine"];
  gameBodies?: GameBody<GameBodyOptions>[];
}

export default class GameMatterStore {
  private _matterCore: MatterCore;
  private _gameBodies: GameBody<GameBodyOptions>[];

  constructor({ engine, gameBodies }: Constructor) {
    this._matterCore = {
      engine,
    };

    this._gameBodies = gameBodies || [];
  }

  set matterCore({ engine, runner, render }) {
    this._matterCore = {
      engine,
      runner,
      render,
    };
  }

  get matterCore(): Readonly<MatterCore> {
    return this._matterCore;
  }

  registerGameBody<T extends GameBodyOptions>(gameBody: GameBody<T>) {
    this._gameBodies.push(gameBody);
  }

  removeGameBody(gameBody: GameBody) {
    remove(this._gameBodies, (body) => body.id === gameBody.id);
  }

  findGameBody<T extends GameBodyOptions>(bodyId: number) {
    for (let i = 0; i < this._gameBodies.length; i++) {
      if (this._gameBodies[i].id === bodyId) {
        return this._gameBodies[i] as GameBody<T>;
      }
    }
  }

  findGameBodies(...matterTypes: string[]) {
    return this._gameBodies.filter((body) =>
      matterTypes.includes(body.options.matterType)
    );
  }

  reset() {
    Events.off(this._matterCore.engine, "", () => {});
  }

  getGameBodies() {
    return [...this._gameBodies];
  }
}
