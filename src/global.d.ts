declare module '*.module.less' {
  const contents: Record<string, string>

  export default contents
}

declare module '*.gif'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'

declare module 'd3-interpolate-curve' {
  export const interpolateCardinal: (
    points: number[],
    epsilon?: number,
    samples?: number
  ) => (t: number) => number
}
