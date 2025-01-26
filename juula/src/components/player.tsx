
import React, {useState, useEffect, useRef} from 'react';
import { Box, Button, HStack, AspectRatio, Image } from '@chakra-ui/react';
import {channels} from '@/data/channels';
import Hls from 'hls.js';

const Player = () => {

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

    // Fallback for browsers that don't support HLS.js
    
    return (
      <div className = "w-1/2 h-screen bg-green-300"> 
        <div className="aspect-w-16 aspect-h-9 w-full h-full border">
          <video ref={videoRef} controls className="object-contain w-full h-auto rounded-md" />
        </div>
        <HStack overflowX="scroll" gap={4} mt={4}>
          {channels.map((channel) => (
            <Button
              key={channel.name}
              onClick={() => setSelectedChannel(channel)}
            >
              <Image src={channel.logo} alt={channel.name} boxSize="20px" />
              {channel.name}
            </Button>
          ))}
        </HStack>
      </div>
  );
};
export default Player;
