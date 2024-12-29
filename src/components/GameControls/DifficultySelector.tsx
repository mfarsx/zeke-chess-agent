import React from "react";
import { Select, Box } from "@chakra-ui/react";
import { useGameStore } from "../../store/gameStore";
import { DifficultyLevel } from "../../types/chess.types";

const DifficultySelector: React.FC = () => {
  const { difficulty, setDifficulty } = useGameStore();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(event.target.value as DifficultyLevel);
  };

  return (
    <Box bg="white" p={4} rounded="md" shadow="md">
      <Select value={difficulty} onChange={handleChange}>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </Select>
    </Box>
  );
};

export default DifficultySelector;
