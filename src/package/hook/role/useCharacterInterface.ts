import useGameBodyEvent from "@/package/hook/role/body/useGameBodyEvent";
import useGameEvent from "@/package/hook/role/body/util/useGameEvent";
import { useGameMatterContext } from "@/package/Renderer/GameMatterContext";
import { GameBody, GameEvent } from "@/package/types";
import { CharacterBodyOptions } from "@/web/type";
import { Body } from "matter-js";
import { useCallback, useEffect, useRef } from "react";

const useCharacterInterface = (gameBody: GameBody<CharacterBodyOptions>) => {
  const { gameMatterStore } = useGameMatterContext();
  const { getCollisionEvent } = useGameBodyEvent(gameBody);
  const { addGameEvents } = useGameEvent();

  const moveLeft = useCallback(() => {
    Body.applyForce(gameBody, gameBody.position, {
      x: -gameBody.options.speed,
      y: 0,
    });
  }, [gameBody]);

  const moveRight = useCallback(() => {
    Body.applyForce(gameBody, gameBody.position, {
      x: gameBody.options.speed,
      y: 0,
    });
  }, [gameBody]);

  const canJump = useRef(false);

  const getCanJumpEvent = useCallback((): GameEvent => {
    return getCollisionEvent(
      () => gameMatterStore.getGameBodies().filter((body) => body != gameBody),
      (collisions) => {
        // 충돌하는 것 중에 중력의 반대방향으로 자신을 밀어내는 것이 있으면 점프가능
        const isCollidedWithFloor = collisions.some((collision) => {
          // bodyA 입장에서의 힘.
          // 둘 중 하나는 무조건 캐릭터다.
          // 충돌 방향이 위쪽이면 점프 가능
          const gameBodyA = collision.bodyA as GameBody;

          // bodyA가 대상 캐릭터일때, 캐릭터가 아닐때 충돌 벡터 방향이 다르므로 따로 계산
          const collisionNormal =
            gameBodyA === gameBody ? collision.normal.y : -collision.normal.y;

          return collisionNormal < -0.1;
        });

        if (isCollidedWithFloor) {
          canJump.current = true;
        }
      }
    );
  }, [getCollisionEvent, gameBody, gameMatterStore]);

  const jump = useCallback(() => {
    if (!canJump.current) return;

    Body.setVelocity(gameBody, {
      x: gameBody.velocity.x,
      y: -gameBody.options.jumpVelocity,
    });

    canJump.current = false;
  }, [gameBody]);

  useEffect(() => {
    return addGameEvents(getCanJumpEvent());
  }, []);

  return {
    moveLeft,
    moveRight,
    jump,
  };
};

export default useCharacterInterface;
