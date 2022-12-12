import { GameBody, GameBodyOptions } from '@/package/types'
import { remove } from 'lodash-es'
import { Engine } from 'matter-js'

interface Constructor {
  engine: Engine
  gameBodies?: GameBody<GameBodyOptions>[]
}

export default class GameStore {
  private _store: { engine: Engine; gameBodies: GameBody<GameBodyOptions>[] }

  constructor({ engine, gameBodies }: Constructor) {
    this._store = {
      engine,
      gameBodies: gameBodies || []
    }
  }

  get engine() {
    return this._store.engine
  }

  registerGameBody<T extends GameBodyOptions>(gameBody: GameBody<T>) {
    this._store.gameBodies.push(gameBody)
  }

  removeGameBody(gameBody: GameBody) {
    remove(this._store.gameBodies, (body) => body.id === gameBody.id)
  }

  findGameBody<T extends GameBodyOptions>(bodyId: number) {
    for (let i = 0; i < this._store.gameBodies.length; i++) {
      if (this._store.gameBodies[i].id === bodyId) {
        return this._store.gameBodies[i] as GameBody<T>
      }
    }
  }

  findGameBodies(...matterTypes: string[]) {
    return this._store.gameBodies.filter((body) =>
      matterTypes.includes(body.options.matterType)
    )
  }

  getGameBodies() {
    return [...this._store.gameBodies]
  }
}
