
import React from 'react';
import { Just_Me_Again_Down_Here } from "next/font/google";
import { Heading, Highlight, Box  } from "@chakra-ui/react";

// Import the font
const justMeAgainFont = Just_Me_Again_Down_Here({
  weight: "400", // Specify the available weight(s)
  subsets: ["latin"], // Subset to optimize the font
});

const Title: React.FC = () => {
  return (

    <Box as="span" px="4" py="2">
      <Heading className={justMeAgainFont.className} color="purple.500" fontSize="4xl" display="inline">
          <Highlight query="Juula -" styles={{ fontSize: "6xl" }}>
            Juula - Learn Japanese from TV
          </Highlight>
        </Heading> 
    </Box>
  );
};

export default Title;