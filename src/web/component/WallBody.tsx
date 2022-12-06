import { GameBody } from "@/package";
import GameBodyShape from "@/package/Renderer/GameBodyShape";
import wallImg from "@/web/public/img/wall.png";

interface Props {
  gameBody: GameBody;
  transparent?: boolean;
}

const WallBody = ({ gameBody, transparent }: Props) => {
  return (
    <GameBodyShape
      gameBody={gameBody}
      bodyImgSrc={transparent ? undefined : wallImg}
    />
  );
};

export default WallBody;
