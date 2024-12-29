import React from "react";
import { Box } from "@chakra-ui/react";

interface SquareProps {
  black: boolean;
  isSelected?: boolean;
  isPossibleMove?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
}

const Square: React.FC<SquareProps> = ({
  black,
  isSelected,
  isPossibleMove,
  children,
  onClick,
  "aria-label": ariaLabel,
}) => {
  return (
    <Box
      w="full"
      h="full"
      bg={
        isSelected
          ? "blue.400"
          : isPossibleMove
          ? "green.200"
          : black
          ? "gray.600"
          : "gray.200"
      }
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      role="button"
      aria-label={ariaLabel}
      onClick={onClick}
      _hover={{
        cursor: "pointer",
        bg: isSelected
          ? "blue.500"
          : isPossibleMove
          ? "green.300"
          : black
          ? "gray.700"
          : "gray.300",
      }}
    >
      {isPossibleMove && (
        <Box
          position="absolute"
          w="3"
          h="3"
          borderRadius="full"
          bg="green.500"
          opacity={0.5}
        />
      )}
      {children}
    </Box>
  );
};

export default Square;
