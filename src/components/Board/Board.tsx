import React, { useState, useEffect } from "react";
import { Grid, GridItem, Spinner, Center, Box, Text } from "@chakra-ui/react";
import Square from "./Square";
import Piece from "./Piece";
import { useGameStore } from "../../store/gameStore";
import { Square as ChessSquare } from "chess.js";

const Board: React.FC = () => {
  const { game, makeMove, status, isLoading } = useGameStore();
  const [selectedSquare, setSelectedSquare] = useState<ChessSquare | null>(
    null
  );
  const [possibleMoves, setPossibleMoves] = useState<ChessSquare[]>([]);

  useEffect(() => {
    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      setPossibleMoves(moves.map((move) => move.to as ChessSquare));
    } else {
      setPossibleMoves([]);
    }
  }, [selectedSquare, game]);

  const handleSquareClick = (position: ChessSquare) => {
    if (status !== "playing" || isLoading) {
      setSelectedSquare(null);
      return;
    }

    if (selectedSquare) {
      makeMove(selectedSquare, position);
      setSelectedSquare(null);
    } else if (game.get(position)?.color === "w") {
      setSelectedSquare(position);
    }
  };

  const renderSquare = (i: number) => {
    const file = i % 8;
    const rank = Math.floor(i / 8);
    const black = (file + rank) % 2 === 1;
    const position = `${String.fromCharCode(97 + file)}${
      8 - rank
    }` as ChessSquare;
    const piece = game.get(position);
    const isSelected = position === selectedSquare;
    const isPossibleMove = possibleMoves.includes(position);

    return (
      <Square
        key={i}
        black={black}
        isSelected={isSelected}
        isPossibleMove={isPossibleMove}
        onClick={() => handleSquareClick(position)}
        aria-label={`${position} ${piece ? piece.type : "empty"} square`}
      >
        {piece && <Piece type={piece.type} color={piece.color} />}
      </Square>
    );
  };

  return (
    <Box position="relative" maxW="600px" mx="auto">
      <Grid
        templateColumns="30px repeat(8, 1fr)"
        templateRows="repeat(8, 1fr) 30px"
        gap={0}
        bg="white"
        border="2px"
        borderColor="gray.300"
        role="grid"
        aria-label="Chess board"
        aspectRatio="1"
      >
        {isLoading && (
          <Center
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.300"
            zIndex={1}
          >
            <Spinner size="xl" />
          </Center>
        )}

        {/* Board squares with rank labels */}
        {[...Array(8)].map((_, rank) => (
          <React.Fragment key={rank}>
            <GridItem
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {8 - rank}
              </Text>
            </GridItem>
            {[...Array(8)].map((_, file) => (
              <Box key={file} w="full" h="full">
                {renderSquare(rank * 8 + file)}
              </Box>
            ))}
          </React.Fragment>
        ))}

        {/* File labels (a-h) */}
        <GridItem />
        {[...Array(8)].map((_, file) => (
          <GridItem
            key={file}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {String.fromCharCode(97 + file)}
            </Text>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Board;
