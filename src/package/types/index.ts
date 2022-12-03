import { Body } from "matter-js";

export interface Size {
  width: number;
  height: number;
}

export interface GameBodyOptions {
  matterType: string;
  size: {
    width: number;
    height: number;
  };
  initialMatterInfo: {
    position: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
  };
}

export interface GameBody<T extends GameBodyOptions = GameBodyOptions>
  extends Body {
  options: T;
}

export type CleanUpEventFn = () => void;
