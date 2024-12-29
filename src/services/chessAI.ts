import { Chess, Move } from "chess.js";
import { DifficultyLevel } from "../types/chess.types";
import { stockfishService } from "./stockfishService";

export async function getBestMove(
  game: Chess,
  difficulty: DifficultyLevel
): Promise<Move> {
  try {
    // Set difficulty level
    stockfishService.setDifficulty(difficulty);

    // Get best move from Stockfish
    const moveString = await stockfishService.getBestMove(game.fen());

    // Convert UCI move format to chess.js move object
    const from = moveString.slice(0, 2) as any;
    const to = moveString.slice(2, 4) as any;
    const promotion = moveString.length > 4 ? moveString[4] : undefined;

    // Make the move to get the full move object
    const move = game.move({ from, to, promotion });

    // Undo the move since we just needed the move object
    game.undo();

    return move;
  } catch (error) {
    console.error("Error getting best move:", error);
    // Fallback to random legal move if there's an error
    const moves = game.moves({ verbose: true });
    return moves[Math.floor(Math.random() * moves.length)];
  }
}

export async function evaluatePosition(game: Chess): Promise<number> {
  try {
    // Get evaluation from Stockfish
    const score = await stockfishService.evaluatePosition(game.fen());
    return score;
  } catch (error) {
    console.error("Error evaluating position:", error);
    // Fallback to simple material counting if there's an error
    return calculateMaterialScore(game);
  }
}

// Fallback material counting function
function calculateMaterialScore(game: Chess): number {
  const pieceValues = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  let score = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type as keyof typeof pieceValues];
        score += piece.color === "w" ? value : -value;
      }
    }
  }

  return score;
}
