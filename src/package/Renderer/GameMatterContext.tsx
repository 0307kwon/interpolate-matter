import AbstractGameFactory from "@/package/Model/AbstractGameFactory";
import GameMatterStore from "@/package/Model/GameMatterStore";
import GamePainter, { GamePainterOptions } from "@/package/Model/GamePainter";
import { Engine } from "matter-js";
import React, { ReactNode, useMemo, useRef, useState } from "react";
import classes from "./GameMatterContext.module.less";

interface ContextValue {
  gamePainter: GamePainter;
  gameFactory: AbstractGameFactory;
  gameMatterStore: GameMatterStore;
}

const createContext = (contextValue: ContextValue) =>
  React.createContext(contextValue);

export interface GameMatterContextProps {
  children: ReactNode;
  gameFactory: AbstractGameFactory;
  options: GamePainterOptions;
}

const GameMatterContext = ({
  children,
  gameFactory,
  options,
}: GameMatterContextProps) => {
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
