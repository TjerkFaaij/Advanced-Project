import { Link } from "react-router-dom";
import { Box, Flex, Link as ChakraLink } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box bg="blue.600" px={4} py={3} color="white">
      <Flex
        maxW="960px"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <ChakraLink
          as={Link}
          to="/"
          fontWeight="bold"
          fontSize="lg"
          _hover={{ textDecoration: "underline", color: "blue.200" }}
        >
          Events
        </ChakraLink>
      </Flex>
    </Box>
  );
};
