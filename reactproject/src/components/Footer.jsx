import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box 
      as="footer"
      width="100%"
      py={4}
      bg="teal.500"
      color="white"
      mt="auto"
      boxShadow="sm"
    >
      <Center>
        <Text fontSize="sm" textAlign="center">
          All rights reserved. Created By Ryzhov A.
        </Text>
      </Center>
    </Box>
  );
};

export default Footer;