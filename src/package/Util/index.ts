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

export const radian = (degree: number) => {
  return (degree * Math.PI) / 180.0;
};

export const degree = (radian: number) => {
  return (radian * 180) / Math.PI;
};
