import React from "react";
import { Box, VStack, Text, Heading } from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";

const MoveHistory: React.FC = () => {
  const { moveHistory } = useGameStore();

  return (
    <Box p={4} bg="white" rounded="md" shadow="md">
      <Heading size="md" mb={4}>
        Move History
      </Heading>
      <VStack align="stretch" spacing={2}>
        {moveHistory.map((move, index) => (
          <Text key={index}>
            {index + 1}. {move}
          </Text>
        ))}
      </VStack>
    </Box>
  );
};

export default MoveHistory;
