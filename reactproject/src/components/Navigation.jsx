import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Link as ChakraLink, Heading, Button, Avatar, Text } from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';

export const Navigation = () => {
  const { loggedInUser } = useContext(DataContext);

  const handleLogout = () => {
    window.location.href = 'http://localhost:3000/auth/logout';
  };

  return (
    <Box as="nav" bg="teal.500" p={4} color="white">
      <Flex justify="space-between" align="center">
        <Heading size="md">Event Manager</Heading>
        <Flex align="center">
          <ChakraLink as={Link} to="/home/" p={2} _hover={{ textDecoration: 'underline' }}>
            Home
          </ChakraLink>
          <ChakraLink as={Link} to="/home/events" p={2} _hover={{ textDecoration: 'underline' }}>
            Events
          </ChakraLink>
          <ChakraLink as={Link} to="/home/add-event" p={2} _hover={{ textDecoration: 'underline' }}>
            Add Event
          </ChakraLink>

          {loggedInUser ? (
            <>
              {/* Display Avatar */}
              {loggedInUser.photos && loggedInUser.photos[0] ? (
                <Avatar size="sm" src={loggedInUser.photos[0].value} name={loggedInUser.displayName} />
              ) : (
                <Avatar size="sm" name={loggedInUser.name} />
              )}

              {/* Display User Name */}
              <Text ml={2} fontWeight="bold">
                {loggedInUser.name}
              </Text>

              <Button onClick={handleLogout} ml={4} colorScheme="red">
                Logout
              </Button>
            </>
          ) : (
            <>
              <ChakraLink as={Link} to="/login" p={2} _hover={{ textDecoration: 'underline' }}>
                Login
              </ChakraLink>
              <ChakraLink as={Link} to="/register" p={2} _hover={{ textDecoration: 'underline' }}>
                Register
              </ChakraLink>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;