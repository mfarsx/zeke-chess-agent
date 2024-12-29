import { Chess } from "chess.js";

export type GameStatus = "playing" | "checkmate" | "draw" | "stalemate";
export type PlayerColor = "white" | "black";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface ChatMessage {
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export interface GameState {
  game: Chess;
  difficulty: DifficultyLevel;
  playerColor: PlayerColor;
  moveHistory: string[];
  status: GameStatus;
  messages: ChatMessage[];
}
