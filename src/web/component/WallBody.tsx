import { GameBody } from "@/package";
import GameBodyShape from "@/package/Renderer/GameBodyShape";
import wallImg from "@/web/public/img/wall.png";

interface Props {
  gameBody: GameBody;
}

const WallBody = ({ gameBody }: Props) => {
  return <GameBodyShape gameBody={gameBody} bodyImgSrc={wallImg} />;
};

export default WallBody;
