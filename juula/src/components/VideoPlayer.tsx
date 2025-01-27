import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
    videoSrc: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(videoElement);

            return () => {
                hls.destroy();
            };
        } else if (videoElement && videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = videoSrc;
        }
    }, [videoSrc]);

    return (
        <video ref={videoRef} controls className="object-contain w-full h-auto rounded-md" />
    );
};

export default VideoPlayer
