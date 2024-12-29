import { Chess, Move } from "chess.js";

type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

const PIECE_VALUES: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

// Position weights for piece placement
const POSITION_WEIGHTS: Record<"p" | "n", number[][]> = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
    [0.5, 1, 1, -2, -2, 1, 1, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-5, -4, -3, -3, -3, -3, -4, -5],
    [-4, -2, 0, 0, 0, 0, -2, -4],
    [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
    [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
    [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
    [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
    [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
    [-5, -4, -3, -3, -3, -3, -4, -5],
  ],
};

export function evaluatePosition(game: Chess): number {
  if (game.isCheckmate()) return -Infinity;
  if (game.isDraw()) return 0;

  let score = 0;
  const board = game.board();

  // Material and position evaluation
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece) continue;

      const pieceType = piece.type.toLowerCase() as PieceType;
      const baseValue = PIECE_VALUES[pieceType];
      const multiplier = piece.color === "w" ? 1 : -1;

      // Add position bonus for pawns and knights
      let positionBonus = 0;
      if (pieceType === "p" || pieceType === "n") {
        const weights = POSITION_WEIGHTS[pieceType];
        const row = piece.color === "w" ? i : 7 - i;
        positionBonus = weights[row][j];
      }

      score += multiplier * (baseValue + positionBonus);
    }
  }

  return score;
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): [number, Move | null] {
  if (depth === 0 || game.isGameOver()) {
    return [evaluatePosition(game), null];
  }

  const moves = game.moves({ verbose: true });
  let bestMove: Move | null = null;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const [evaluation] = minimax(game, depth - 1, alpha, beta, false);
      game.undo();

      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const [evaluation] = minimax(game, depth - 1, alpha, beta, true);
      game.undo();

      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return [minEval, bestMove];
  }
}

export function getBestMove(
  game: Chess,
  difficulty: "beginner" | "intermediate" | "advanced"
): Move {
  const depthMap = {
    beginner: 2,
    intermediate: 3,
    advanced: 4,
  };

  const depth = depthMap[difficulty];
  const [_score, bestMove] = minimax(game, depth, -Infinity, Infinity, true);

  if (!bestMove) {
    // Fallback to random move if no best move found
    const moves = game.moves({ verbose: true });
    return moves[Math.floor(Math.random() * moves.length)];
  }

  return bestMove;
}
