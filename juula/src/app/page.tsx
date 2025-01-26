'use client';

import { Box, Flex, Text, Button, VStack} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import Hls from "hls.js";

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('http://vthanh.utako.moe/Tokyo_MX1/index.m3u8'); // Replace with your m3u8 stream URL
      hls.attachMedia(videoElement);

      return () => {
        hls.destroy();
      };
    }

    // Fallback for browsers that don't support HLS.js
    if (videoElement && videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = 'http://vthanh.utako.moe/TBS/index.m3u8'; // Fallback method for native HLS support (e.g., Safari)
    }
  }, []);

  return (
    <Box w="100%" minH="100vh" bg="gray.100" color="gray.900">
      <Flex justify="center" align="center" flexDirection="column" py={8}>
        <Text fontSize="3xl" mb={4} fontWeight="bold">
          Welcome to Juula - Live Japanese TV Streaming
        </Text>
        <Text fontSize="lg" mb={6} textAlign="center">
          Enjoy live Japanese television shows with interactive features for language learning and comprehension!
        </Text>
      </Flex>

      <Flex justify="center" gap={6} px={4}>
        {/* Video Section */}
        <Box
          bg="black"
          w="70%"
          maxW="800px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
        >
          <video ref={videoRef} controls width="100%" style={{ display: "block" }}>
            Your browser does not support the video tag.
          </video>
        </Box>

        {/* Info Section */}
        <VStack
          bg="white"
          w="30%"
          maxW="400px"
          p={4}
          borderRadius="lg"
          boxShadow="md"

          align="stretch"
        >
          {/* Summary Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Summary
            </Text>
            <Text fontSize="sm" color="gray.700">
              • Leaves are Green (葉っぱ): The vibrant green leaves that blanket the countryside are the symbol of Japan’s natural beauty, signifying renewal and harmony.
            </Text>
            <Text fontSize="sm" color="gray.700" mt={2}>
              • The Cherry Blossom Leaves (桜の葉): After the iconic cherry blossoms bloom, the leaves create a serene landscape evoking peace and nostalgia.
            </Text>
          </Box>

          {/* Transcript Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Transcript
            </Text>
            <Text fontSize="sm" color="gray.700">
              Live transcription will appear here.
            </Text>
            <Button mt={2} size="sm" colorScheme="blue">
              Live Transcript
            </Button>
          </Box>

          {/* Translate Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Translate
            </Text>
            <Button colorScheme="teal" size="sm">
              Translation
            </Button>
          </Box>

          {/* Keywords Section */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Keywords
            </Text>
            <Text fontSize="sm" color="gray.700">
              Highlighted keywords will appear here.
            </Text>
          </Box>
        </VStack>
      </Flex>

      {/* Footer */}
      <Box position="fixed" bottom="10px" right="10px" boxSize="100px">
        <img src="https://catbox.moe/pictures/qts/1486346829409.png" alt="Cute Image" />
      </Box>
    </Box>
  );
};

export default Home;
