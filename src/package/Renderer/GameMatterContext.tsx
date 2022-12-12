import GamePainter, { GamePainterConfig } from '@/package/Model/GamePainter'
import GameStore from '@/package/Model/GameStore'
import { RESOLUTION } from '@/web/config'
import { Events } from 'matter-js'
import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import classes from './GameMatterContext.module.less'

interface ContextValue {
  gamePainter: GamePainter
  gameStore: GameStore
}

const Context = React.createContext<ContextValue | null>(null)

export interface GameMatterContextProps {
  children: ReactNode
  options: GamePainterConfig
  store: GameStore
}

const GameMatterContext = ({
  children,
  options,
  store
}: GameMatterContextProps) => {
  const isLoading = useRef(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [_gameStore] = useState(store)
  const [_gamePainter] = useState(new GamePainter(_gameStore, options))
  const contextValue = useMemo<ContextValue>(
    () => ({
      gamePainter: _gamePainter,
      gameStore: _gameStore
    }),
    []
  )

  useEffect(() => {
    if (!canvasRef.current) return
    if (!isLoading.current) return

    // 모든 정보가 갖춰지면 한번만 실행합니다.
    isLoading.current = false

    _gamePainter.initCanvas(canvasRef.current)
  }, [canvasRef, isLoading])

  useEffect(() => {
    return () => {
      if (isLoading.current) return

      _gamePainter.removeRendering()
      Events.off(_gameStore.engine, '', () => {})
    }
  }, [])

  return (
    <Context.Provider value={contextValue}>
      <div
        className={classes.root}
        style={{
          maxWidth: RESOLUTION.width,
          maxHeight: RESOLUTION.height,
          paddingTop: `${(RESOLUTION.height / RESOLUTION.width) * 100}%`
        }}
      >
        <canvas
          ref={canvasRef}
          id={_gamePainter.getConfig().canvasElementId}
        ></canvas>
        {children}
      </div>
    </Context.Provider>
  )
}

export const useGameMatterContext = () => {
  const value = useContext(Context)

  if (!value) {
    throw new Error("can't use this hook out of GameControllerContext")
  }

  return value as ContextValue
}

export default GameMatterContext
