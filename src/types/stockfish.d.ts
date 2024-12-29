declare module "stockfish.js" {
  const workerUrl: string;
  export = workerUrl;
}

declare module "*.js" {
  const content: string;
  export default content;
}
