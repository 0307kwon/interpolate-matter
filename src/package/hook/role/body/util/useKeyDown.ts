import { useGameMatterContext } from "@/package/Renderer/GameMatterContext";
import { get } from "lodash-es";
import { Events } from "matter-js";
import { useCallback, useEffect, useRef, useState } from "react";

type KeyCode = string;

type KeyHandlers = Record<KeyCode, () => void>;

const useKeyDown = () => {
  const keysDownRef = useRef<Set<string>>(new Set());
  const { gameMatterStore } = useGameMatterContext();
  const [keyHandler, setKeyHandler] = useState<KeyHandlers>({});

  const deleteKeyDown = useCallback((code: string) => {
    keysDownRef.current.delete(code);
  }, []);

  const setContinualKeyInput = useCallback((value: KeyHandlers) => {
    setKeyHandler((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  const setInstantKeyInput = useCallback(
    (value: KeyHandlers) => {
      const newKeyHandlers: KeyHandlers = {};

      Object.keys(value).forEach((key) => {
        newKeyHandlers[key] = () => {
          keyHandler[key]();

          deleteKeyDown(key);
        };
      });

      setKeyHandler((prev) => ({
        ...prev,
        ...newKeyHandlers,
      }));
    },
    [deleteKeyDown, keyHandler]
  );

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (event.repeat) return;

      keysDownRef.current.add(event.code);
    };

    const keyUpListener = (event: KeyboardEvent) => {
      keysDownRef.current.delete(event.code);
    };

    addEventListener("keydown", keyDownListener);
    addEventListener("keyup", keyUpListener);

    return () => {
      window.removeEventListener("keydown", keyDownListener);
      window.removeEventListener("keyup", keyUpListener);
    };
  }, []);

  useEffect(() => {
    const engine = gameMatterStore.matterCore.engine;

    const keyDownEvent = () => {
      Array.from(keysDownRef.current).forEach((code) => {
        get(keyHandler, code)?.();
      });
    };

    Events.on(engine, "beforeUpdate", keyDownEvent);

    return () => {
      Events.off(engine, "beforeUpdate", keyDownEvent);
    };
  }, [gameMatterStore.matterCore.engine, keyHandler]);

  return {
    setContinualKeyInput,
    setInstantKeyInput,
  };
};

export default useKeyDown;
