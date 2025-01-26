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
    <div className="flex flex-1 flex-col h-full w-full overflow-hidden">
      {/* Top section */}
      <div className="flex flex-row h-1/8 w-full gap-4">
      {/* Top-left box (1/2 width, 1/8 height) */}
        <div className="flex items-center justify-start w-3/5">
          <Title />
        </div>
      {/* Top-right box (1/2 width, 1/8 height) */}
        <div className="flex bg-red-300 w-2/5">
          {/* Top Right (1/2 width, 1/8 height) */}
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-row h-7/8 w-full gap-2">
      {/* Bottom-left box (1/2 width, 7/8 height) */}
        <div className="w-3/5 bg-white">
        
          <Player />
          
        </div>
      {/* Bottom-right box (1/2 width, 7/8 height) */}
        <div className="bg-yellow-300 w-2/5">
          {/* <Player /> */}
        </div>
      </div>
    </div>
      {/* <Box position="fixed" bottom="0px" right="10px">
        <Image src="https://catbox.moe/pictures/qts/1486346829409.png" alt="Cute Image" width={100} height={100} />
      </Box> */}
    </Flex>
    </Box>
  );
};

export default Home;
