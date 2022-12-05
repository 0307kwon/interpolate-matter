import { useGameMatterContext } from "@/package/Renderer/GameMatterContext";
import { GameEvent } from "@/package/types";
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

  return {
    addGameEvents,
  };
};

export default useGameEvent;
