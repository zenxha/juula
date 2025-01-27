'use client';

// import { Box, Grid, GridItem,  Flex, Text, Button, VStack, ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect, useRef} from "react";
// import Image from 'next/image';
import Title from "@/components/title";
import VideoPlayer from "@/components/VideoPlayer";
import { channels } from "@/data/channels";
import Hls from 'hls.js';

// import {Global} from "@emotion/react";
// import { Play } from "next/font/google";
// import '@vidstack/react/player/styles/base.css';
// import { MediaPlayer, MediaProvider } from '@vidstack/react';
// // import { PlayIcon } from '@vidstack/react/icons';
// import {
//     DefaultAudioLayout,
//     defaultLayoutIcons,
//     DefaultVideoLayout,
//   } from '@vidstack/react/player/layouts/default';

const Home: React.FC = () => {
    const [selectedChannel, setSelectedChannel] = useState(channels[0]);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(selectedChannel.url);
          hls.attachMedia(videoElement);
    
          return () => {
            hls.destroy();
          };
        }else if (videoElement && videoElement.canPlayType('application/vnd.apple.mpegurl')) {
          videoElement.src = selectedChannel.url;
        }
      }, [selectedChannel]);

  return (

    <div className="flex h-screen">
        <div className="flex flex-col w-3/5 h-screen">
            <div className="p-4 h-1/6 ">
                <Title />
            </div>
            <div className="flex-1 flex justify-center p-8">
                <div className="flex flex-col w-full p-4 rounded-md bg-red-500">
                    <div className="flex h-4/5 bg-blue-400">
                        <VideoPlayer videoSrc={selectedChannel.url} />
                    </div>
                    <div className="flex h-1/5 h-16 mt-4 overflow-x-auto bg-blue-400 ">
                        {channels.map(channel  => (
                            <button 
                                key={channel.name} 
                                onClick={() => setSelectedChannel(channel)} 
                                className={`px-6 py-2 my-2 ml-4 text-sm text-white rounded ${selectedChannel.name === channel.name ? 'bg-green-500' : 'bg-blue-500'}`}
                            >
                                {channel.name}
                            </button>
                        ))
                        }
                    </div>
                </div>

            </div>

        
        </div>
        <div className="flex flex-col w-2/5 h-screen p-8">
            <div className="flex-1 p-4 rounded-md mt-6 bg-red-500">
                
                    Top box
 
         
            </div>
            <div className="flex-1 p-4 rounded-md mt-6 bg-red-500">
                Bottom Box
            </div>

        </div>
    </div>

  );

};

export default Home;
