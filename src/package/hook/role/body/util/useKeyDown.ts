import useGameEvent from "@/package/hook/role/body/util/useGameEvent";
import { get } from "lodash-es";
import { useCallback, useEffect, useRef, useState } from "react";

type KeyCode = string;

type KeyHandlers = Record<KeyCode, () => void>;

const useKeyDown = () => {
  const keysDownRef = useRef<Set<string>>(new Set());
  const [keyHandler, setKeyHandler] = useState<KeyHandlers>({});
  const { addGameEvents } = useGameEvent();

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
          value[key]();

          deleteKeyDown(key);
        };
      });

      setKeyHandler((prev) => ({
        ...prev,
        ...newKeyHandlers,
      }));
    },
    [deleteKeyDown]
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
    const keyDownEvent = () => {
      Array.from(keysDownRef.current).forEach((code) => {
        get(keyHandler, code)?.();
      });
    };

    return addGameEvents(keyDownEvent);
  }, [addGameEvents, keyHandler]);

  return {
    setContinualKeyInput,
    setInstantKeyInput,
  };
};

export default useKeyDown;
