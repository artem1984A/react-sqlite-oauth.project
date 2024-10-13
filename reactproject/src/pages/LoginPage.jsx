import React, { useContext, useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, Text, Center } from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { currentUser } = useContext(DataContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Perform login logic here
    console.log('Logging in with', email, password);
  };

  const handleGithubLogin = () => {
    // Redirect to GitHub OAuth login URL (handled via backend)
    window.location.href = 'http://localhost:3000/auth/github';
  };

  const handleNavigateHome = () => {
    navigate('/home/');
  };

  const handleNavigateRegister = () => {
    navigate('/register');
  };

  return (
    <Box maxW="sm" mx="auto" p={6} mt={10} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      {currentUser ? (
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          Welcome, {currentUser.displayName}!
        </Heading>
      ) : (
        <>
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Log In
          </Heading>
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                Log In
              </Button>
            </VStack>
          </form>
          <Text mt={4} textAlign="center">
            OR
          </Text>
          <Button onClick={handleGithubLogin} colorScheme="gray" variant="outline" width="full" mt={4}>
            Log In with GitHub
          </Button>

          {/* Home and Register Buttons */}
          <Center mt={8}>
            <VStack spacing={4} width="full">
              <Button onClick={handleNavigateHome} colorScheme="teal" variant="solid" width="full">
                Go to Home
              </Button>
              <Button onClick={handleNavigateRegister} colorScheme="green" variant="solid" width="full">
                Register
              </Button>
            </VStack>
          </Center>
        </>
      )}
    </Box>
  );
};

export default LoginPage;