import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";

const ScoreDisplay: React.FC = () => {
  const { score } = useGameStore();

  return (
    <Box bg="white" p={4} rounded="md" shadow="md" mb={4}>
      <Text fontWeight="bold">
        Score: {score > 0 ? "+" : ""}
        {score.toFixed(1)}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {score > 0
          ? "White is winning"
          : score < 0
          ? "Black is winning"
          : "Equal position"}
      </Text>
    </Box>
  );
};

export default ScoreDisplay;
