import { create } from "zustand";
import { Chess, Square } from "chess.js";
import { GameState, DifficultyLevel, ChatMessage } from "../types/chess.types";
import { getBestMove, evaluatePosition } from "../services/chessAI";
import {
  playMoveSound,
  playCheckSound,
  playGameEndSound,
} from "../utils/sound";

interface GameStore extends GameState {
  makeMove: (from: Square, to: Square) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  resetGame: () => void;
  score: number;
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => void;
}

const getAgentResponse = (
  game: Chess,
  status: string,
  difficulty: DifficultyLevel,
  userMessage?: string
): string => {
  // Handle user questions about the game
  if (userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    if (
      lowerMessage.includes("hint") ||
      lowerMessage.includes("help") ||
      lowerMessage.includes("suggest")
    ) {
      const score = evaluatePosition(game);
      if (score < -1) {
        return "You're in a strong position! Look for forcing moves and ways to maintain your advantage.";
      } else if (score > 1) {
        return "I have an advantage, but the game isn't over. Look for defensive resources and try to complicate the position.";
      } else {
        return "The position is fairly equal. Focus on developing your pieces and controlling the center.";
      }
    }

    if (lowerMessage.includes("why") && lowerMessage.includes("move")) {
      return "I chose my last move based on positional considerations and tactical opportunities. Would you like me to explain more specific aspects of the position?";
    }
  }

  // Handle game state responses
  if (status !== "playing") {
    if (status === "checkmate") {
      const winner = game.turn() === "w" ? "Black" : "White";
      return `Checkmate! ${winner} wins! Would you like to play another game?`;
    } else if (status === "stalemate") {
      return "The game is a draw by stalemate. Shall we play another one?";
    } else {
      return "The game is drawn. Would you like to start a new game?";
    }
  }

  const position = game.fen();
  const isCheck = game.isCheck();
  const moveCount = Math.floor(game.moveNumber() / 2);
  const score = evaluatePosition(game);
  const material = countMaterial(game);

  // Opening stage responses
  if (moveCount < 4) {
    const openingResponses = [
      "I'm following classical opening principles. Development and center control are key!",
      "The opening phase is crucial. Let's see how the position develops.",
      "I'm aiming for a solid position in the opening. How will you respond?",
    ];
    return openingResponses[
      Math.floor(Math.random() * openingResponses.length)
    ];
  }

  // Check situations
  if (isCheck) {
    const checkResponses = [
      "Check! How will you defend?",
      "I've put your king in check. What's your response?",
      "Check! The king is under attack.",
    ];
    return checkResponses[Math.floor(Math.random() * checkResponses.length)];
  }

  // Material imbalance responses
  if (Math.abs(material) >= 3) {
    if (material > 0) {
      return "I have a material advantage, but there's still play in the position.";
    } else {
      return "You have more material, but I'll try to create counterplay.";
    }
  }

  // Positional responses based on evaluation
  if (score > 2) {
    return "I'm in a difficult position, but I'll look for tactical chances.";
  } else if (score < -2) {
    return "I have a strong position. Be careful with your next moves!";
  }

  // Generic responses for balanced positions
  const responses = [
    "Interesting position! There are several plans to consider.",
    "The position is complex with chances for both sides.",
    "This requires careful calculation. Let me think about the possibilities.",
    "A critical moment in the game. Every move counts!",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// Helper function to count material difference
const countMaterial = (game: Chess): number => {
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  let total = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = values[piece.type as keyof typeof values] || 0;
        total += piece.color === "w" ? value : -value;
      }
    }
  }

  return total;
};

export const useGameStore = create<GameStore>((set) => ({
  game: new Chess(),
  difficulty: "beginner",
  playerColor: "white",
  moveHistory: [],
  status: "playing",
  score: 0,
  isLoading: false,
  error: null,
  messages: [
    {
      text: "Hello! I'm Zeke, your chess companion. I'll help you improve your game. Feel free to ask for hints or explanations about my moves!",
      sender: "agent",
      timestamp: new Date(),
    },
  ],

  sendMessage: (text: string) =>
    set((state) => {
      const userMessage: ChatMessage = {
        text,
        sender: "user",
        timestamp: new Date(),
      };

      const agentResponse: ChatMessage = {
        text: getAgentResponse(
          state.game,
          state.status,
          state.difficulty,
          text
        ),
        sender: "agent",
        timestamp: new Date(),
      };

      return {
        ...state,
        messages: [...state.messages, userMessage, agentResponse],
      };
    }),

  makeMove: (from, to) =>
    set((state) => {
      const game = new Chess(state.game.fen());
      try {
        set({ isLoading: true, error: null });

        // Player move
        const move = game.move({ from, to });
        if (!move) {
          set({ isLoading: false, error: "Invalid move" });
          return state;
        }

        // Play appropriate sound for player move
        const isCapture = move.captured !== undefined;
        playMoveSound(isCapture);
        if (game.isCheck()) playCheckSound();

        const moveHistory = [...state.moveHistory, `${from}-${to}`];
        let score = evaluatePosition(game);

        // Check game status after player move
        if (game.isGameOver()) {
          set({ isLoading: false });
          playGameEndSound();
          const gameEndMessage: ChatMessage = {
            text: getAgentResponse(
              game,
              game.isCheckmate()
                ? "checkmate"
                : game.isDraw()
                ? "draw"
                : "stalemate",
              state.difficulty
            ),
            sender: "agent",
            timestamp: new Date(),
          };
          return {
            ...state,
            game,
            moveHistory,
            score,
            status: game.isCheckmate()
              ? "checkmate"
              : game.isDraw()
              ? "draw"
              : "stalemate",
            messages: [...state.messages, gameEndMessage],
          };
        }

        // AI move
        const aiMove = getBestMove(game, state.difficulty);
        game.move(aiMove);

        // Add agent's comment about the move
        const agentMessage: ChatMessage = {
          text: getAgentResponse(game, "playing", state.difficulty),
          sender: "agent",
          timestamp: new Date(),
        };

        // Play appropriate sound for AI move
        const isAiCapture = aiMove.captured !== undefined;
        playMoveSound(isAiCapture);
        if (game.isCheck()) playCheckSound();

        moveHistory.push(`${aiMove.from}-${aiMove.to}`);
        score = evaluatePosition(game);

        // Check game status after AI move
        const status = game.isGameOver()
          ? game.isCheckmate()
            ? "checkmate"
            : game.isDraw()
            ? "draw"
            : "stalemate"
          : "playing";

        if (game.isGameOver()) {
          playGameEndSound();
          const gameEndMessage: ChatMessage = {
            text: getAgentResponse(game, status, state.difficulty),
            sender: "agent",
            timestamp: new Date(),
          };
          return {
            ...state,
            game,
            moveHistory,
            score,
            status,
            messages: [...state.messages, agentMessage, gameEndMessage],
          };
        }

        set({ isLoading: false });
        return {
          ...state,
          game,
          moveHistory,
          score,
          status,
          messages: [...state.messages, agentMessage],
        };
      } catch (e) {
        set({ isLoading: false, error: "An error occurred during the move" });
        return state;
      }
    }),

  setDifficulty: (level) =>
    set((state) => ({
      ...state,
      difficulty: level,
      messages: [
        ...state.messages,
        {
          text: `Difficulty changed to ${level}. I'll adjust my play accordingly!`,
          sender: "agent",
          timestamp: new Date(),
        },
      ],
    })),

  resetGame: () =>
    set({
      game: new Chess(),
      moveHistory: [],
      status: "playing",
      score: 0,
      error: null,
      isLoading: false,
      messages: [
        {
          text: "New game started! I'm ready to play. Remember, you can ask me for hints or explanations about my moves. Good luck!",
          sender: "agent",
          timestamp: new Date(),
        },
      ],
    }),
}));
