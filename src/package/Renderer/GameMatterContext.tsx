import GameMatterStore from "@/package/Model/GameMatterStore";
import GamePainter, { GamePainterConfig } from "@/package/Model/GamePainter";
import { Engine } from "matter-js";
import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classes from "./GameMatterContext.module.less";

interface ContextValue {
  gamePainter: GamePainter;
  gameMatterStore: GameMatterStore;
}

const Context = React.createContext<ContextValue | null>(null);

export interface GameMatterContextProps {
  children: ReactNode;
  options: GamePainterConfig;
}

const GameMatterContext = ({ children, options }: GameMatterContextProps) => {
  const isLoading = useRef(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_gameMatterStore] = useState(
    new GameMatterStore({
      engine: Engine.create(),
    })
  );
  const [_gamePainter] = useState(new GamePainter(_gameMatterStore, options));
  const contextValue = useMemo(
    () => ({
      gameMatterStore: _gameMatterStore,
      gamePainter: _gamePainter,
    }),
    []
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!isLoading.current) return;

    // 모든 정보가 갖춰지면 한번만 실행합니다.
    isLoading.current = false;

    _gamePainter.initCanvas(canvasRef.current);
  }, [canvasRef, isLoading]);

  return (
    <Context.Provider value={contextValue}>
      <div className={classes.root}>
        <canvas ref={canvasRef} id={options.canvasElementId}></canvas>
        {children}
      </div>
    </Context.Provider>
  );
};

export const useGameMatterContext = () => {
  const value = useContext(Context);

  if (!value) {
    throw new Error("can't use this hook out of GameControllerContext");
  }

  return value as ContextValue;
};

export default GameMatterContext;
