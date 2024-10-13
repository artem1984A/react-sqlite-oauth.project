import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Heading, Center, Select } from '@chakra-ui/react';
import Navigation from './Navigation';
import Footer from './Footer';


const Root = () => {
  const location = useLocation();
 

 

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="space-between">
      <Box>
        <Navigation />
        <Center mb={8}>
          <Heading as="h1" fontSize={["2xl", "3xl"]} fontFamily="Georgia, serif">
            Welcome to the Event Manager
          </Heading>
        </Center>
        {/* Render page content */}
        <Outlet />
        </Box>

{/* Conditionally render the Footer only on the "/home" or "/home/" path */}
{(location.pathname === '/home' || location.pathname === '/home/') && <Footer />}
</Box>
  );
};

export default Root;