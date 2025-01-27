
import React from 'react';
import { Just_Me_Again_Down_Here } from "next/font/google";
// import { Heading, Highlight, Box  } from "@chakra-ui/react";

// Import the font
const justMeAgainFont = Just_Me_Again_Down_Here({
  weight: "400", // Specify the available weight(s)
  subsets: ["latin"], // Subset to optimize the font
});

const Title: React.FC = () => {
  return (

    <h1 className={`${justMeAgainFont.className} text-purple-500 text-4xl inline`}>
      <span className="text-6xl">
        Juula - 
      </span>
      Learn Japanese from TV
    </h1>
  );
};

export default Title;