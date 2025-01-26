'use client';

import { Box, Grid, GridItem,  Flex, Text, Button, VStack, ChakraProvider } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import Image from 'next/image';
import Title from "@/components/title";
import Player from "@/components/player";
import {Global} from "@emotion/react";
import { Play } from "next/font/google";
// import '@vidstack/react/player/styles/base.css';
// import { MediaPlayer, MediaProvider } from '@vidstack/react';
// // import { PlayIcon } from '@vidstack/react/icons';
// import {
//     DefaultAudioLayout,
//     defaultLayoutIcons,
//     DefaultVideoLayout,
//   } from '@vidstack/react/player/layouts/default';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('https://luong.utako.moe/spaceshower/index.m3u8'); // Replace with your m3u8 stream URL
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

    <Box bg="teal.300" height="100vh" width="100vw">
    <Flex margin="20px" bg="teal.500" height="100%">  
    <Grid
      flex={1}
      templateRows="repeat(8, 1fr)" // First row 1/8 height, second row 7/8 height
      templateColumns="1fr 1fr" // Two columns, each 1/2 width
      gap={4}
      h="100vh"
      w="100%"
      overflow={"hidden"}
    >
      {/* Top-left box (1/2 width, 1/8 height) */}
      <GridItem rowSpan={1} colSpan={1}>
        <Box h="100%" w="100%" display="flex" alignItems="center" justifyContent="flex-start">
         <Title></Title>
        </Box>
      </GridItem>

      {/* Top-right box (1/2 width, 1/8 height) */}
      <GridItem rowSpan={4} colSpan={1}>
        <Box bg="red.300" h="100%" w="100%">
          Top Right (1/2 width, 1/8 height)
        </Box>
      </GridItem>

      {/* Bottom-left box (1/2 width, 7/8 height) */}
      <GridItem rowSpan={7} colSpan={1}>
          <Player></Player>
      </GridItem>

      {/* Bottom-right box (1/2 width, 7/8 height) */}
      <GridItem rowSpan={4} colSpan={1}>
        <Box bg="yellow.300" h="100%" w="100%">
          {/* <Player /> */}
        </Box>
      </GridItem>
    </Grid>
      {/* <Box position="fixed" bottom="0px" right="10px">
        <Image src="https://catbox.moe/pictures/qts/1486346829409.png" alt="Cute Image" width={100} height={100} />
      </Box> */}
    </Flex>
    </Box>
  );
};

export default Home;
