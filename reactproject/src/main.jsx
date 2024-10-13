// Ensure all necessary imports are here
import React, { useContext } from 'react'; // Ensure useContext is imported
import ReactDOM from 'react-dom/client'; // Correct import for ReactDOM in React 18
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ChakraProvider, Box, Select, Center } from '@chakra-ui/react';
import Root from './components/Root';
import EventsPage from './pages/EventsPage';
import EventPage from './pages/EventPage';
import AddEventPage from './pages/AddEventPage';
import EditEventPage from './pages/EditEventPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer';
import { DataProvider, DataContext } from './contexts/DataContext'; // Ensure DataContext is imported correctly
import { brightTheme, darkTheme, modernTheme, defaultLightTheme } from './theme'; // Import the themes

// Function to manage the application's context, routing, and theme
function AppWithProvider() {
  const { currentTheme, setCurrentTheme } = useContext(DataContext);
  const location = useLocation();

  // Handler for changing themes
  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    if (selectedTheme === "bright") {
      setCurrentTheme(brightTheme);
    } else if (selectedTheme === "dark") {
      setCurrentTheme(darkTheme);
    } else if (selectedTheme === "modern") {
      setCurrentTheme(modernTheme);
    } else if (selectedTheme === "none") {
      setCurrentTheme(defaultLightTheme);
    }
  };

  return (
    <ChakraProvider theme={currentTheme}>
      <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="space-between">
        <Routes>
          <Route path="home" element={<Root />}>
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventPage />} />
            <Route path="events/edit/:eventId" element={<EditEventPage />} />
            <Route path="add-event" element={<AddEventPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

        {/* Conditionally render theme selection if not on login or register page */}
        {location.pathname !== '/login' && location.pathname !== '/register' && (
          <>
            <Center position="fixed" bottom="70px" left="0" right="0" zIndex="1">
              <Box>
                <Select placeholder="Choose your theme" onChange={handleThemeChange} width="200px">
                  <option value="none">No Theme (Light)</option>
                  <option value="bright">Bright</option>
                  <option value="dark">Dark</option>
                  <option value="modern">Modern</option>
                </Select>
              </Box>
            </Center>
            {/* Render Footer only on the main page */}
            {location.pathname === ('/home'||'/home/') && <Footer />}
          </>
        )}
      </Box>
    </ChakraProvider>
  );
}

// Main App component where the DataProvider wraps the entire application
function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppWithProvider />
      </BrowserRouter>
    </DataProvider>
  );
}

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);