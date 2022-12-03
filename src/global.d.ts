declare module "*.module.less" {
  const contents: Record<string, string>;

  export default contents;
}

declare module "*.gif" {
  const url: string;

  export default url;
}
