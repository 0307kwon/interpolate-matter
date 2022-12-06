import { useGameMatterContext } from "@/package/Renderer/GameMatterContext";
import { GameBody, GameEvent } from "@/package/types";
import { Collision, Query } from "matter-js";
import { useCallback } from "react";

const useGameBodyEvent = (gameBody: GameBody) => {
  const { gamePainter } = useGameMatterContext();

  const outOfViewEvent = useCallback(
    (callbackWhenOutOfView: () => void): GameEvent => {
      const whenOutOfView = () => {
        const isOutOfView =
          gameBody.position.y >=
          gamePainter.getConfig().resolution.height + 400;

        if (isOutOfView) {
          callbackWhenOutOfView();
        }
      };

      return whenOutOfView;
    },
    []
  );

  const collisionEvent = useCallback(
    (
      gameBodies: GameBody[] | (() => GameBody[]),
      whenCollide: (collisions: Collision[]) => void
    ): GameEvent => {
      const collisionCallback = () => {
        const collisions = Query.collides(
          gameBody,
          gameBodies instanceof Array ? gameBodies : gameBodies()
        );

        if (collisions.length > 0) {
          whenCollide(collisions);
        }
      };

      return collisionCallback;
    },
    []
  );

  return {
    outOfViewEvent,
    collisionEvent,
  };
};

export default useGameBodyEvent;
