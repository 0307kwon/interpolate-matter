import { Size } from "@/package/types";

export const calculateScaleRatio = (sizeA: Size, sizeB: Size) => {
  return {
    scaleX: sizeA.width / sizeB.width,
    scaleY: sizeA.height / sizeB.height,
  };
};

export const $ById = (id: string) => {
  const $element = document.getElementById(id);

  if (!$element) throw new Error(`can't find target element by id`);

  return $element;
};
