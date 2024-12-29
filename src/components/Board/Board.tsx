import React, { useState, useEffect } from "react";
import { Grid, GridItem, Spinner, Center } from "@chakra-ui/react";
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
      <GridItem
        key={i}
        w="12"
        h="12"
        onClick={() => handleSquareClick(position)}
        role="button"
        aria-label={`${position} ${piece ? piece.type : "empty"} square`}
      >
        <Square
          black={black}
          isSelected={isSelected}
          isPossibleMove={isPossibleMove}
        >
          {piece && <Piece type={piece.type} color={piece.color} />}
        </Square>
      </GridItem>
    );
  };

  return (
    <Grid
      templateColumns="repeat(8, 1fr)"
      width="96"
      height="96"
      border="2px"
      borderColor="gray.300"
      position="relative"
      role="grid"
      aria-label="Chess board"
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
      {[...Array(64)].map((_, i) => renderSquare(i))}
    </Grid>
  );
};

export default Board;
