import { GameBody, GameEvent } from "@/package";
import useGameEvent from "@/package/hook/role/body/util/useGameEvent";
import GameBodyShape from "@/package/Renderer/GameBodyShape";
import withGameLogic from "@/package/Renderer/withGameLogic";
import NameTag from "@/web/component/NameTag";
import characterImg from "@/web/public/img/character.gif";
import { CharacterBodyOptions } from "@/web/type";
import { useEffect, useState } from "react";

interface Props {
  gameBody: GameBody<CharacterBodyOptions>;
}

const CharacterBodyShape = ({ gameBody }: Props) => {
  return (
    <GameBodyShape gameBody={gameBody} bodyImgSrc={characterImg}>
      <NameTag
        name={"test"}
        style={{
          position: "absolute",
          top: "-30px",
        }}
      />
    </GameBodyShape>
  );
};

const CharacterBody = withGameLogic(CharacterBodyShape, ({ gameBody }) => {
  const [test2] = useState("test2");
  const { publishGameEventOnce } = useGameEvent();

  useEffect(() => {
    const callback: GameEvent = (e) => {
      console.log(e);
    };

    publishGameEventOnce(gameBody, callback);
    publishGameEventOnce(gameBody, callback);
    publishGameEventOnce(gameBody, callback);
    publishGameEventOnce(gameBody, callback);
  }, []);
});

export default CharacterBody;
