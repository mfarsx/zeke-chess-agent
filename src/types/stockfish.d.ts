declare module "stockfish.js" {
  export class Engine {
    constructor();
    postMessage(message: string): void;
    onmessage: (event: MessageEvent) => void;
    addEventListener(
      type: string,
      listener: (event: MessageEvent) => void
    ): void;
    removeEventListener(
      type: string,
      listener: (event: MessageEvent) => void
    ): void;
  }
}
