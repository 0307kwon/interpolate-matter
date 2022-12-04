import { useGameBody } from "@/package/Renderer/GameBodyShape";
import { useGameMatterContext } from "@/package/Renderer/GameMatterContext";
import { $ById } from "@/package/Util";
import { Events } from "matter-js";
import { ReactNode, useEffect, useRef } from "react";
import classes from "./MatterImg.module.less";

interface Props {
  imgSrc: string;
  children?: ReactNode;
}

const MatterImg = ({ imgSrc, children }: Props) => {
  const { gameMatterStore, gamePainter } = useGameMatterContext();
  const { gameBody } = useGameBody();
  const imgRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const engine = gameMatterStore.matterCore.engine;

    const updateImg = () => {
      const $imgDom = imgRef.current;
      const $rootDom = rootRef.current;

      if (!$imgDom || !$rootDom) {
        throw new Error();
      }

      const matterWidth = gameBody.options.size.width;
      const matterHeight = gameBody.options.size.height;

      // 원래 크기에 비해서 실제 크기가 얼마나 큰지에 따라 캐릭터 비율, 위치를 다르게 해줘야함
      const { resolution, canvasElementId } = gamePainter.getConfig();
      const realCanvasWidth = $ById(canvasElementId).getClientRects()[0].width;
      const originalCanvasWidth = resolution.width;

      const originalToRealWidthRatio =
        realCanvasWidth / (originalCanvasWidth * 1.0);

      const calculatedMatterSize = {
        width: matterWidth * originalToRealWidthRatio,
        height: matterHeight * originalToRealWidthRatio,
      };

      // TODO: translate로 바꿔야 함
      $rootDom.style.left =
        gameBody.position.x * originalToRealWidthRatio -
        calculatedMatterSize.width / 2 +
        "px";
      $rootDom.style.top =
        gameBody.position.y * originalToRealWidthRatio -
        calculatedMatterSize.height / 2 +
        "px";
      $rootDom.style.width = calculatedMatterSize.width + "px";
      $rootDom.style.height = calculatedMatterSize.height + "px";
      $imgDom.style.transform = `rotate(${gameBody.angle}rad)`;
    };

    Events.on(engine, "afterUpdate", updateImg);

    return () => {
      Events.off(engine, "afterUpdate", updateImg);
    };
  }, []);

  return (
    <div className={classes.root} ref={rootRef}>
      <div className={classes.MatterImg} ref={imgRef}>
        <img src={imgSrc} />
      </div>
      {children}
    </div>
  );
};

export default MatterImg;
