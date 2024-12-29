import React from "react";
import { Box, VStack, Text, Heading, Grid, GridItem } from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";

const MoveHistory: React.FC = () => {
  const moveHistory = useGameStore((state) => state.moveHistory);

  // Group moves into pairs (white and black)
  const moveGroups = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    moveGroups.push({
      number: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1],
    });
  }

  return (
    <Box
      p={4}
      bg="white"
      rounded="md"
      shadow="md"
      height="calc(100vh - 200px)"
      display="flex"
      flexDirection="column"
    >
      <Heading size="md" mb={4}>
        Move History
      </Heading>
      <Grid templateColumns="auto 1fr 1fr" gap={2} mb={2} px={2}>
        <GridItem fontWeight="bold">#</GridItem>
        <GridItem fontWeight="bold">White</GridItem>
        <GridItem fontWeight="bold">Black</GridItem>
      </Grid>
      <Box
        flex="1"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.300",
            borderRadius: "24px",
          },
        }}
      >
        <VStack align="stretch" spacing={1}>
          {moveGroups.map(({ number, white, black }) => (
            <Grid
              key={number}
              templateColumns="auto 1fr 1fr"
              gap={2}
              p={2}
              bg={number % 2 === 0 ? "gray.50" : "white"}
              alignItems="center"
            >
              <GridItem fontWeight="medium" color="gray.600">
                {number}.
              </GridItem>
              <GridItem>{white}</GridItem>
              <GridItem>{black || "..."}</GridItem>
            </Grid>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default MoveHistory;
