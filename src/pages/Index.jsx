import React, { useState } from "react";
import { Box, FormControl, FormLabel, Input, Button, Text, useToast, Grid, GridItem } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const exampleColors = [
  { hex: "#FF0000", name: "Red" },
  { hex: "#00FF00", name: "Green" },
  { hex: "#0000FF", name: "Blue" },
  { hex: "#FFFF00", name: "Yellow" },
  { hex: "#FF00FF", name: "Magenta" },
  { hex: "#00FFFF", name: "Cyan" },
];

const Index = () => {
  const [hexCode, setHexCode] = useState("");

  const handleExampleClick = (hex) => {
    setHexCode(hex);
    fetchColorName(hex.replace("#", ""));
  };
  const [colorName, setColorName] = useState("");
  const [colorSwatch, setColorSwatch] = useState(null);
  const toast = useToast();

  const fetchColorName = async (hex) => {
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hex}`);
      if (!response.ok) {
        throw new Error("Color not found");
      }
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
        setColorSwatch(data.colors[0].swatchImg.svg);
      } else {
        setColorName("Color name not found");
        setColorSwatch(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColorName(hexCode.replace("#", ""));
  };

  return (
    <Box p={4}>
      <FormControl id="hex-color" as="form" onSubmit={handleSubmit}>
        <FormLabel>Enter HEX Color Code</FormLabel>
        <Input type="text" placeholder="e.g., #1a2b3c" value={hexCode} onChange={(e) => setHexCode(e.target.value)} />
        <Button leftIcon={<FaSearch />} mt={2} colorScheme="blue" type="submit">
          Translate Color
        </Button>
      </FormControl>
      {colorName && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Color Name: {colorName}
          </Text>
          {colorSwatch && <Box mt={2} dangerouslySetInnerHTML={{ __html: colorSwatch }} />}
        </Box>
      )}
      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Example Colors
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {exampleColors.map((color) => (
            <GridItem key={color.hex} bg={color.hex} p={4} borderRadius="md" cursor="pointer" onClick={() => handleExampleClick(color.hex)}>
              <Text fontSize="lg" fontWeight="bold">
                {color.name}
              </Text>
              <Text>{color.hex}</Text>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Index;
