import { useGameMatterContext } from "@/package/Renderer/GameMatterContext";
import MatterImg from "@/package/Renderer/MatterImg";
import { GameBody, GameBodyOptions } from "@/package/types";
import React, { ReactNode, useContext, useEffect, useState } from "react";

interface ContextValue<T extends GameBodyOptions = GameBodyOptions> {
  gameBody: GameBody<T>;
}

const Context = React.createContext<ContextValue | null>(null);

interface Props<T extends GameBodyOptions> {
  gameBody: GameBody<T>;
  children: ReactNode;
}

// 리렌더 여러번 새로운 바디가 생성되는 것을 막기 위한 context입니다.
const GameBodyContext = <T extends GameBodyOptions>({
  gameBody,
  children,
}: Props<T>) => {
  const [contextValue] = useState({
    gameBody,
  });

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useGameBody = <T extends GameBodyOptions>() => {
  const value = useContext(Context);

  if (!value) {
    throw new Error("can't use this hook out of GameBody");
  }

  return value as ContextValue<T>;
};

export interface GameBodyShapeProps<T extends GameBodyOptions> {
  gameBody: GameBody<T>;
  bodyImgSrc: string;
  children?: ReactNode;
}

const GameBodyShape = <T extends GameBodyOptions>({
  gameBody,
  bodyImgSrc,
  children,
}: GameBodyShapeProps<T>) => {
  const { gamePainter } = useGameMatterContext();

  useEffect(() => {
    gamePainter.spawnGameBody(gameBody);
  }, []);

  return (
    <GameBodyContext gameBody={gameBody}>
      <MatterImg imgSrc={bodyImgSrc}>{children}</MatterImg>
    </GameBodyContext>
  );
};

export default GameBodyShape;
