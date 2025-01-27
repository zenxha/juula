import React from 'react';
import { Button, HStack, Image } from '@chakra-ui/react';
import { channels } from '@/data/channels';

interface ChannelButtonsProps {
    selectedChannel: string;
    onChangeChannel: (channelUrl: string) => void;
}

const ChannelButtons: React.FC<ChannelButtonsProps> = ({ selectedChannel, onChangeChannel }) => {
    return (
        <HStack overflowX="scroll" gap={4} mt={4}>
            {channels.map((channel) => (
                <Button
                    key={channel.name}
                    onClick={() => onChangeChannel(channel.url)}
                    display="flex"
                    background={selectedChannel === channel.name ? "gray.300" : "teal.500"}
                >
                    <Image src={channel.logo} alt={channel.name} boxSize="20px" />
                    {channel.name}
                </Button>
            ))}
        </HStack>
    );
};

export default ChannelButtons;