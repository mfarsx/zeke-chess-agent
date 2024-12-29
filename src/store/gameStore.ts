import { create } from "zustand";
import { Chess, Square } from "chess.js";
import { GameState, DifficultyLevel, ChatMessage } from "../types/chess.types";
import { getBestMove, evaluatePosition } from "../services/chessAI";
import {
  playMoveSound,
  playCheckSound,
  playGameEndSound,
} from "../utils/sound";
import { stockfishService } from "../services/stockfishService";

interface GameStore extends GameState {
  makeMove: (from: Square, to: Square) => Promise<void>;
  setDifficulty: (level: DifficultyLevel) => void;
  resetGame: () => void;
  score: number;
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
}

const getAgentResponse = async (
  game: Chess,
  status: string,
  difficulty: DifficultyLevel,
  userMessage?: string
): Promise<string> => {
  // Handle user questions about the game
  if (userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    if (
      lowerMessage.includes("hint") ||
      lowerMessage.includes("help") ||
      lowerMessage.includes("suggest")
    ) {
      const score = await evaluatePosition(game);
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

  const score = await evaluatePosition(game);
  const moveNumber = Math.floor(game.moveNumber() / 2);
  return stockfishService.getEngineComment(score, moveNumber);
};

export const useGameStore = create<GameStore>((set, get) => ({
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

  sendMessage: async (text: string) => {
    const state = get();
    const userMessage: ChatMessage = {
      text,
      sender: "user",
      timestamp: new Date(),
    };

    const agentResponse: ChatMessage = {
      text: await getAgentResponse(
        state.game,
        state.status,
        state.difficulty,
        text
      ),
      sender: "agent",
      timestamp: new Date(),
    };

    set({
      messages: [...state.messages, userMessage, agentResponse],
    });
  },

  makeMove: async (from: Square, to: Square) => {
    const state = get();
    const game = new Chess(state.game.fen());

    try {
      set({ isLoading: true, error: null });

      // Player move
      const move = game.move({ from, to });
      if (!move) {
        set({ isLoading: false, error: "Invalid move" });
        return;
      }

      // Play appropriate sound for player move
      const isCapture = move.captured !== undefined;
      playMoveSound(isCapture);
      if (game.isCheck()) playCheckSound();

      const moveHistory = [...state.moveHistory, `${from}-${to}`];
      let score = await evaluatePosition(game);

      // Check game status after player move
      if (game.isGameOver()) {
        set({ isLoading: false });
        playGameEndSound();
        const gameEndMessage: ChatMessage = {
          text: await getAgentResponse(
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

        set({
          game,
          moveHistory,
          score,
          status: game.isCheckmate()
            ? "checkmate"
            : game.isDraw()
            ? "draw"
            : "stalemate",
          messages: [...state.messages, gameEndMessage],
        });
        return;
      }

      // AI move
      const aiMove = await getBestMove(game, state.difficulty);
      game.move(aiMove);

      // Add agent's comment about the move
      const agentMessage: ChatMessage = {
        text: await getAgentResponse(game, "playing", state.difficulty),
        sender: "agent",
        timestamp: new Date(),
      };

      // Play appropriate sound for AI move
      const isAiCapture = aiMove.captured !== undefined;
      playMoveSound(isAiCapture);
      if (game.isCheck()) playCheckSound();

      moveHistory.push(`${aiMove.from}-${aiMove.to}`);
      score = await evaluatePosition(game);

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
          text: await getAgentResponse(game, status, state.difficulty),
          sender: "agent",
          timestamp: new Date(),
        };

        set({
          game,
          moveHistory,
          score,
          status,
          messages: [...state.messages, agentMessage, gameEndMessage],
        });
      } else {
        set({
          game,
          moveHistory,
          score,
          status,
          messages: [...state.messages, agentMessage],
        });
      }

      set({ isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: "An error occurred during the move" });
    }
  },

  setDifficulty: (level) => {
    stockfishService.setDifficulty(level);
    set((state) => ({
      difficulty: level,
      messages: [
        ...state.messages,
        {
          text: `Difficulty changed to ${level}. I'll adjust my play accordingly!`,
          sender: "agent",
          timestamp: new Date(),
        },
      ],
    }));
  },

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
