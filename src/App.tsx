import React from "react";
import { Box, Container, Grid, GridItem, Heading } from "@chakra-ui/react";
import Board from "./components/Board/Board";
import DifficultySelector from "./components/GameControls/DifficultySelector";
import MoveHistory from "./components/GameInfo/MoveHistory";
import GameStatus from "./components/GameInfo/GameStatus";
import ScoreDisplay from "./components/GameInfo/ScoreDisplay";
import ErrorDisplay from "./components/GameInfo/ErrorDisplay";
import ChatScreen from "./components/GameInfo/ChatScreen";

const App: React.FC = () => {
  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Container maxW="4xl">
        <Heading as="h1" size="xl" mb={8}>
          Zeke Chess Agent
        </Heading>

        <Grid templateColumns="2fr 1fr" gap={8}>
          <GridItem>
            <Board />
            <ErrorDisplay />
            <GameStatus />
            <Box mt={4}>
              <DifficultySelector />
            </Box>
          </GridItem>

          <GridItem>
            <ScoreDisplay />
            <Box mb={4}>
              <MoveHistory />
            </Box>
            <ChatScreen />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default App;
