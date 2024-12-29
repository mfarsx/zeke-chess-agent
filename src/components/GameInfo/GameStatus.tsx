import React from "react";
import { Alert, AlertIcon, Button, VStack } from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";

const GameStatus: React.FC = () => {
  const { status, resetGame } = useGameStore();

  if (status === "playing") return null;

  const messages = {
    checkmate: "Checkmate! Game Over",
    stalemate: "Stalemate! Game is a Draw",
    draw: "Game is a Draw",
  };

  return (
    <VStack spacing={4} mt={4}>
      <Alert status={status === "checkmate" ? "success" : "info"} w="full">
        <AlertIcon />
        {messages[status]}
      </Alert>
      <Button colorScheme="blue" onClick={resetGame}>
        New Game
      </Button>
    </VStack>
  );
};

export default GameStatus;
