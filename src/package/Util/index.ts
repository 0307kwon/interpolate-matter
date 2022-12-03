import { Size } from "@/package/types";

export const calculateScaleRatio = (sizeA: Size, sizeB: Size) => {
  return {
    scaleX: sizeA.width / sizeB.width,
    scaleY: sizeA.height / sizeB.height,
  };
};
