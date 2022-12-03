import GameFactory from "@/package/Model/GameFactory";
import GameMatterStore from "@/package/Model/GameMatterStore";
import GamePainter, { GamePainterOptions } from "@/package/Model/GamePainter";
import { Engine } from "matter-js";
import React, { ReactNode, useMemo, useRef, useState } from "react";
import classes from "./GameMatterContext.module.less";

interface ContextValue {
  gamePainter: GamePainter;
  gameFactory: GameFactory;
  gameMatterStore: GameMatterStore;
}

const createContext = (contextValue: ContextValue) =>
  React.createContext(contextValue);

export interface GameMatterContextProps<F extends GameFactory> {
  children: ReactNode;
  gameFactory: F;
  options: GamePainterOptions;
}

const GameMatterContext = <F extends GameFactory>({
  children,
  gameFactory,
  options,
}: GameMatterContextProps<F>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_gameMatterStore] = useState(
    new GameMatterStore({
      engine: Engine.create(),
    })
  );
  const [_gamePainter] = useState(new GamePainter(_gameMatterStore, options));
  const [_gameFactory] = useState(gameFactory);
  const contextValue = useMemo(
    () => ({
      gameMatterStore: _gameMatterStore,
      gamePainter: _gamePainter,
      gameFactory: _gameFactory,
    }),
    []
  );
  const ContextRef = useRef(createContext(contextValue));
  const Context = ContextRef.current;

  return (
    <Context.Provider value={contextValue}>
      <div className={classes.root}>
        <canvas ref={canvasRef} id={options.canvasElementId}></canvas>
        {children}
      </div>
    </Context.Provider>
  );
};

export default GameMatterContext;
