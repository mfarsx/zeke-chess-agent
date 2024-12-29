import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  useColorModeValue,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";
import { useGameStore } from "../../store/gameStore";

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState("");
  const messages = useGameStore((state) => state.messages);
  const sendMessage = useGameStore((state) => state.sendMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue("white", "gray.700");
  const bubbleColorUser = useColorModeValue("blue.100", "blue.700");
  const bubbleColorAgent = useColorModeValue("gray.100", "gray.600");

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="md"
      shadow="md"
      h="400px"
      display="flex"
      flexDirection="column"
      position="relative"
    >
      <Box
        ref={scrollContainerRef}
        flex="1"
        overflowY="auto"
        p={4}
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
          scrollBehavior: "smooth",
        }}
      >
        <VStack spacing={4} alignItems="stretch">
          {messages.map((msg, index) => (
            <Flex
              key={index}
              justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}
            >
              <Box
                maxW="80%"
                bg={msg.sender === "user" ? bubbleColorUser : bubbleColorAgent}
                px={4}
                py={2}
                borderRadius="lg"
              >
                <Text>{msg.text}</Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {msg.timestamp.toLocaleTimeString()}
                </Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} style={{ height: "1px" }} />
        </VStack>
      </Box>

      <HStack p={4} spacing={2} borderTopWidth={1} bg={bgColor}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          size="md"
          bg={bgColor}
        />
        <IconButton
          colorScheme="blue"
          aria-label="Send message"
          icon={<ChevronUpIcon />}
          onClick={handleSendMessage}
          isDisabled={!message.trim()}
        />
      </HStack>
    </Box>
  );
};

export default ChatScreen;
