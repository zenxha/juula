'use client';

import { Box, Stack, For, Flex, Text, Button, VStack, ListCollection} from "@chakra-ui/react";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select"
import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import Image from 'next/image';
import { channels } from "../data/channels"  
// import '@vidstack/react/player/styles/base.css';
// import { MediaPlayer, MediaProvider } from '@vidstack/react';
// // import { PlayIcon } from '@vidstack/react/icons';
// import {
//     DefaultAudioLayout,
//     defaultLayoutIcons,
//     DefaultVideoLayout,
//   } from '@vidstack/react/player/layouts/default';

// const PageColors = {
//   "light": {
//     text: "black",
//     background: "white",
//   },
//   "dark": {
//     text: "white",
//     background: "#1a202c",
//   },
// };



const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const colors = PageColors[theme];
  const [selectedChannel, setSelectedChannel] = useState("http://luong.utako.moe/spaceshower/index.m3u8");
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && Hls.isSupported()) {
      const hls = new Hls();
      // setSelectedChannel("http://vthanh.utako.moe/NHK_G/index.m3u8");
      // hls.loadSource("http://luong.utako.moe/spaceshower/index.m3u8"); // Replace with your m3u8 stream URL
      // hls.loadSource("http://vthanh.utako.moe/NHK_G/index.m3u8");
      hls.loadSource(selectedChannel);
      hls.attachMedia(videoElement);

      return () => {
        hls.destroy();
      };
    }

    // Fallback for browsers that don't support HLS.js
    if (videoElement && videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = 'http://vthanh.utako.moe/TBS/index.m3u8'; // Fallback method for native HLS support (e.g., Safari)
    }
  }, [selectedChannel]);

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
        {/* <MediaPlayer autoPlay={true} title="Stream" src="http://luong.utako.moe/spaceshower/index.m3u8">
        <PlayIcon size={40} />
        <MediaProvider />
        </MediaPlayer> */}
        {/* <MediaPlayer title="Lol" src="http://luong.utako.moe/spaceshower/index.m3u8">
            <MediaProvider />
            <DefaultAudioLayout icons={defaultLayoutIcons} />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>} */}
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

          <Box>  
            <NativeSelectRoot size="md" width="240px" variant="plain" colorPalette="accent">
              <NativeSelectField
                style={{ background: "white", color: "black" }}
                placeholder="Select channel"
                items={channels}
                onChange={(e) =>{setSelectedChannel(e.currentTarget.value);
                  console.log(selectedChannel);}}
              />
            </NativeSelectRoot>
          </Box>

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
    <Box position="fixed" bottom="0px" right="10px">
      <Image src="https://catbox.moe/pictures/qts/1486346829409.png" alt="Cute Image" width={100} height={100} />
    </Box>
    </Box>
  );
};

export default Home;
