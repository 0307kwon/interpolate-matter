import { GameBody } from "@/package";
import GameBodyShape from "@/package/Renderer/GameBodyShape";
import withGameLogic from "@/package/Renderer/withGameLogic";
import NameTag from "@/web/component/NameTag";
import characterImg from "@/web/public/img/character.gif";
import { useEffect, useState } from "react";

interface Props {
  gameBody: GameBody;
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

const CharacterBody = withGameLogic(CharacterBodyShape, () => {
  const [test2] = useState("test2");

  useEffect(() => {
    console.log(test2);
  }, []);
});

export default CharacterBody;
