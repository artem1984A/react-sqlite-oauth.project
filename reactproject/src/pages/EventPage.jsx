import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Center,
  Avatar,
  Select,
} from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';
import { brightTheme, darkTheme, modernTheme, defaultLightTheme } from '../theme';

const EventPage = () => {
  const { eventId } = useParams();
  const { events, categories, users, setCurrentTheme } = useContext(DataContext);

  // Find the event using the event ID (converted to integer to match the ID format in SQLite)
  const event = events.find((e) => e.id === parseInt(eventId));

  if (!event) return <div>Event not found</div>;

  // Retrieve category names by mapping category IDs
  const categoryNames = event.categoryIds
    .map((id) => categories.find((cat) => cat.id === id)?.name || 'Unknown')
    .join(', ');

  // Find the creator using the `createdBy` field, which matches the user's `id`
  const creator = users.find((user) => user.id === event.createdBy);

  // Handle theme selection change
  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    if (selectedTheme === 'bright') {
      setCurrentTheme(brightTheme);
    } else if (selectedTheme === 'dark') {
      setCurrentTheme(darkTheme);
    } else if (selectedTheme === 'modern') {
      setCurrentTheme(modernTheme);
    } else if (selectedTheme === 'none') {
      setCurrentTheme(defaultLightTheme);
    }
  };

  return (
    <Center>
      <Box maxW="lg" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} boxShadow="md">
        <Heading mb={4}>{event.title}</Heading>
        <Image src={event.image} alt={event.title} mb={4} />
        <Text mb={4}>{event.description}</Text>
        <Text mb={2}>
          <strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}
        </Text>
        <Text mb={4}>
          <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
        </Text>
        <Text mb={4}>
          <strong>Categories:</strong> {categoryNames}
        </Text>
        {creator && (
          <HStack mb={4}>
            <Avatar src={creator.image || 'https://via.placeholder.com/150'} name={creator.name} />
            <Text>Created By: {creator.name || 'Unknown Author'}</Text>
          </HStack>
        )}
        <Button as={Link} to={`/home/events/edit/${event.id}`} colorScheme="blue" mr={4}>
          Edit
        </Button>
        <Button as={Link} to="/home/events" colorScheme="red">
          Back to Events
        </Button>

        {/* Add the dropdown for theme selection */}
        <Box mt={4}>
          <Select placeholder="Choose your theme" onChange={handleThemeChange} width="200px">
            <option value="none">No Theme (Light)</option>
            <option value="bright">Bright</option>
            <option value="dark">Dark</option>
            <option value="modern">Modern</option>
          </Select>
        </Box>
      </Box>
    </Center>
  );
};

export default EventPage;