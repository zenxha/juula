'use client';

import { Box, Flex, Text, Button } from "@chakra-ui/react";
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
      videoElement.src = 'Http://vthanh.utako.moe/TBS/index.m3u8'; // Fallback method for native HLS support (e.g., Safari)
    }
  }, []);

  return (
    <Box
      w="100%"
      minH="100vh"
      bg="gray.900"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      color="white"
    >
      <Box w="80%" maxW="1200px" textAlign="center">
        <Text fontSize="3xl" mb="4" fontWeight="bold">
          Welcome to Juula - Live Japanese TV Streaming
        </Text>
        <Text fontSize="lg" mb="6">
          Enjoy live Japanese television shows with interactive features for language learning and comprehension!
        </Text>

        <Flex justify="center" mb="6">
          <Box
            bg="black"
            w="100%"
            maxW="960px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
          >
           
            <video
              ref={videoRef}
              controls
            >
              Your browser does not support the video tag.
            </video>
          </Box>
          Hi
        </Flex>



        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => alert("Quiz feature coming soon!")}
        >
          Test Your Listening Comprehension
        </Button>
      </Box>
      <Box
        position="fixed"
        bottom="10px"
        right="10px"
        boxSize="100px"
    >
        <img src="https://catbox.moe/pictures/qts/1486346829409.png" alt="Cute Image" />
    </Box>
    </Box>

  );
};

export default Home;