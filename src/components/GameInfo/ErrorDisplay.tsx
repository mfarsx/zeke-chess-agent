import React from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";

const ErrorDisplay: React.FC = () => {
  const error = useGameStore((state) => state.error);

  if (!error) return null;

  return (
    <Alert status="error" mt={4}>
      <AlertIcon />
      {error}
    </Alert>
  );
};

export default ErrorDisplay;
