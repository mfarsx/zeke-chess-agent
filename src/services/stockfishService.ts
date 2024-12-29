import { Engine } from "stockfish.js";

class StockfishService {
  private engine: Engine | null = null;
  private isReady = false;
  private moveTime = 1000; // Default thinking time in milliseconds
  private skill = 10; // Default skill level (0-20)

  constructor() {
    this.initEngine();
  }

  private initEngine() {
    this.engine = new Engine();

    this.engine.onmessage = (event: MessageEvent) => {
      const message = event.data;
      if (message === "uciok") {
        this.configureEngine();
      } else if (message === "readyok") {
        this.isReady = true;
      }
    };

    this.engine.postMessage("uci");
  }

  private configureEngine() {
    if (!this.engine) return;

    // Configure engine settings
    this.engine.postMessage("setoption name MultiPV value 1");
    this.engine.postMessage(`setoption name Skill Level value ${this.skill}`);
    this.engine.postMessage("isready");
  }

  public setDifficulty(level: "beginner" | "intermediate" | "advanced") {
    switch (level) {
      case "beginner":
        this.skill = 5;
        this.moveTime = 500;
        break;
      case "intermediate":
        this.skill = 10;
        this.moveTime = 1000;
        break;
      case "advanced":
        this.skill = 20;
        this.moveTime = 2000;
        break;
    }

    if (this.engine) {
      this.engine.postMessage(`setoption name Skill Level value ${this.skill}`);
    }
  }

  public async getBestMove(fen: string): Promise<string> {
    if (!this.engine || !this.isReady) {
      throw new Error("Engine not ready");
    }

    return new Promise((resolve) => {
      if (!this.engine) return;

      const handleMessage = (event: MessageEvent) => {
        const message = event.data;
        if (typeof message === "string" && message.startsWith("bestmove")) {
          const bestMove = message.split(" ")[1];
          this.engine?.removeEventListener("message", handleMessage);
          resolve(bestMove);
        }
      };

      this.engine.addEventListener("message", handleMessage);
      this.engine.postMessage("position fen " + fen);
      this.engine.postMessage(`go movetime ${this.moveTime}`);
    });
  }

  public async evaluatePosition(fen: string): Promise<number> {
    if (!this.engine || !this.isReady) {
      throw new Error("Engine not ready");
    }

    return new Promise((resolve) => {
      if (!this.engine) return;

      const handleMessage = (event: MessageEvent) => {
        const message = event.data;
        if (typeof message === "string" && message.includes("score cp")) {
          const scoreMatch = message.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            const score = parseInt(scoreMatch[1]) / 100; // Convert centipawns to pawns
            this.engine?.removeEventListener("message", handleMessage);
            resolve(score);
          }
        }
      };

      this.engine.addEventListener("message", handleMessage);
      this.engine.postMessage("position fen " + fen);
      this.engine.postMessage("go depth 15");
    });
  }

  public getEngineComment(score: number, moveNumber: number): string {
    if (moveNumber < 10) {
      return this.getOpeningComment(score);
    } else if (Math.abs(score) > 3) {
      return this.getAdvantageComment(score);
    } else {
      return this.getMiddlegameComment(score);
    }
  }

  private getOpeningComment(score: number): string {
    const comments = [
      "Developing pieces and controlling the center.",
      "Following classical opening principles.",
      "Working on piece development and king safety.",
      "Building a strong pawn structure.",
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  private getAdvantageComment(score: number): string {
    if (score > 3) {
      return "I have a significant advantage. Looking for tactical opportunities.";
    } else {
      return "You have a strong position. I need to find defensive resources.";
    }
  }

  private getMiddlegameComment(score: number): string {
    if (Math.abs(score) < 0.5) {
      return "The position is roughly equal. Both sides have chances.";
    } else if (score > 0) {
      return "I have a slight advantage. Looking to increase the pressure.";
    } else {
      return "You have a small edge. I'll try to create counterplay.";
    }
  }

  public cleanup() {
    if (this.engine) {
      this.engine.postMessage("quit");
      this.engine = null;
    }
  }
}

export const stockfishService = new StockfishService();
