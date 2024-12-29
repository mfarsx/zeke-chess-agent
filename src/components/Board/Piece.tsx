import React from "react";
import { Text } from "@chakra-ui/react";

interface PieceProps {
  type: string;
  color: "w" | "b";
}

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const pieceSymbol = getPieceSymbol(type, color);

  return (
    <Text fontSize="3xl" cursor="grab">
      {pieceSymbol}
    </Text>
  );
};

function getPieceSymbol(type: string, color: "w" | "b"): string {
  const pieces = {
    w: { p: "♙", n: "♘", b: "♗", r: "♖", q: "♕", k: "♔" },
    b: { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" },
  };

  return pieces[color][type as keyof (typeof pieces)["w"]] || "";
}

export default Piece;
