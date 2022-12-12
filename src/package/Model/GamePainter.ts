import GameStore from '@/package/Model/GameStore'
import { CleanUpEventFn, GameBody, GameBodyOptions } from '@/package/types'
import { calculateScaleRatio } from '@/package/Util'
import { cloneDeep } from 'lodash-es'
import { Body, Composite, Render, Runner } from 'matter-js'

export interface GamePainterConfig {
  canvasElementId: string
  fps: number
  resolution: { width: number; height: number }
}

// gameFactory로 받아온 body 객체를 그리는 역할
// canvas에 그리는 역할을 담당함.
export default class GamePainter {
  private _gameStore: GameStore
  private _isRemoved: boolean
  private _isStopped: boolean
  private _config: GamePainterConfig
  private _interval: number
  private _canvasElementId: string

  constructor(gameStore: GameStore, config: GamePainterConfig) {
    this._gameStore = gameStore
    this._isRemoved = false
    this._isStopped = false
    this._config = config
    this._interval = 1000 / config.fps
    this._canvasElementId = config.canvasElementId
  }

  getConfig() {
    return cloneDeep(this._config)
  }

  initCanvas(canvasElement: HTMLCanvasElement) {
    const { width, height } = this._config.resolution
    const runner = Runner.create()
    const render = Render.create({
      canvas: canvasElement,
      engine: this._gameStore.engine,
      options: {
        background: 'rgba(0,0,0,0)',
        wireframes: false,
        width,
        height
      }
    })

    Render.run(render)

    let then = 0
    const update = (time = 0) => {
      if (this._isRemoved) return

      requestAnimationFrame(update)

      if (this._isStopped) return

      const now = Date.now()
      const delta = now - then

      if (delta > this._interval) {
        Runner.tick(runner, this._gameStore.engine, time)
        then = now - (delta % this._interval)
      }
    }

    update()
  }

  respawnGameBody(gameBodyId: number) {
    const targetGameBody = this._gameStore.findGameBody(gameBodyId)

    if (!targetGameBody) return

    const { initialMatterInfo } = targetGameBody.options

    // 초기 위치, 크기로 설정
    Body.setPosition(targetGameBody, initialMatterInfo.position)
    Body.setVelocity(targetGameBody, {
      x: 0,
      y: 0
    })
    const ratio = calculateScaleRatio(
      targetGameBody.options.initialMatterInfo.size,
      targetGameBody.options.size
    )
    Body.scale(targetGameBody, ratio.scaleX, ratio.scaleY)
    targetGameBody.options.size = targetGameBody.options.initialMatterInfo.size
  }

  spawnGameBody<T extends GameBodyOptions>(
    gameBody: GameBody<T>
  ): CleanUpEventFn {
    if (!this._gameStore) throw new Error('gameStore가 존재하지 않습니다.')

    const isAlreadyExist = this._gameStore.findGameBody(gameBody.id)

    if (isAlreadyExist) {
      throw new Error(
        '이미 존재하는 gameBody입니다. respawnGameBody()를 사용해주세요.'
      )
    }

    const { engine } = this._gameStore

    Composite.add(engine.world, gameBody)

    this._gameStore.registerGameBody<T>(gameBody)

    return () => {
      this.unspawnGameBody(gameBody)
    }
  }

  unspawnGameBody(gameBody: GameBody) {
    if (!this._gameStore) throw new Error('gameStore가 존재하지 않습니다.')

    const isExist = this._gameStore.findGameBody(gameBody.id)

    if (!isExist) {
      throw new Error('존재하지 않는 gameBody는 삭제할 수 없습니다.')
    }

    const { engine } = this._gameStore

    Composite.remove(engine.world, gameBody)

    this._gameStore.removeGameBody(gameBody)
  }

  /**  렌더링 이벤트를 완전히 제거합니다. 다시 시작할 수 없습니다. */
  removeRendering() {
    this._isRemoved = true
  }

  stopRendering() {
    this._isStopped = true
  }

  restartRendering() {
    this._isStopped = false
  }
}
