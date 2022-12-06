import { useGameMatterContext } from "@/package/Renderer/GameMatterContext";
import { GameBody, GameEvent } from "@/package/types";
import { Events } from "matter-js";
import { useCallback } from "react";

type EventName = "beforeUpdate" | "afterUpdate";

type CleanUpEventFn = () => void;

const useGameEvent = () => {
  const { gameMatterStore } = useGameMatterContext();
  const engine = gameMatterStore.matterCore.engine;

  /**
   * Add events and return cleanUp function for useEffect.
   *
   * Events will be added with "beforeUpdate" by default.
   */
  const addGameEvents = useCallback(
    (
      ...events: (GameEvent | { name: EventName; event: GameEvent })[]
    ): CleanUpEventFn => {
      events.forEach((event) => {
        if (typeof event === "function") {
          Events.on(engine, "beforeUpdate", event);
          return;
        }

        Events.on(engine, event.name, event.event);
      });

      return () => {
        events.forEach((event) => {
          if (typeof event === "function") {
            Events.off(engine, "beforeUpdate", event);
            return;
          }

          Events.off(engine, event.name, event.event);
        });
      };
    },
    []
  );

  /**
   * publish game event which executes once.
   *
   * if you call several times, each event executes sequently per frame
   */
  const publishGameEventOnce = useCallback(
    (gameBody: GameBody, event: GameEvent) => {
      const wrappedEvent: GameEvent = (e) => {
        if (gameBody.options.subscriber.callbackQueue.length === 1) {
          Events.off(engine, "afterUpdate", wrappedEvent);
        }

        const curEvent = gameBody.options.subscriber.callbackQueue.pop();

        if (!curEvent) {
          Events.off(engine, "afterUpdate", wrappedEvent);
          return;
        }

        curEvent(e);
      };

      if (gameBody.options.subscriber.callbackQueue.length === 0) {
        Events.on(engine, "afterUpdate", wrappedEvent);
      }

      gameBody.options.subscriber.callbackQueue.push(event);
    },
    []
  );

  return {
    addGameEvents,
    publishGameEventOnce,
  };
};

export default useGameEvent;
