import React, { useState, useContext } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Container,
  Textarea,
  Select,
  CheckboxGroup,
  Checkbox,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Center
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/DataContext';
import { brightTheme, darkTheme, modernTheme, defaultLightTheme } from '../theme'; // Import themes

const AddEventPage = () => {
  const { categories, users, setEvents, setUsers, setCurrentTheme } = useContext(DataContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [createdBy, setCreatedBy] = useState('');

  // New states for user creation (optional)
  const [newUserName, setNewUserName] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCategoryChange = (values) => {
    setSelectedCategories(values.map(Number));
  };

  // Function to handle new user creation (optional)
  const handleCreateUser = async () => {
    if (!newUserName || !newUserAvatar) {
      toast({
        title: 'Error',
        description: 'Please enter a username and upload an avatar.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', newUserName);
    formData.append('image', newUserAvatar);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      const createdUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, createdUser]);
      setCreatedBy(createdUser._id); // Set the created user as the event creator

      toast({
        title: 'User created.',
        description: 'New user has been added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose(); // Close the modal after creating the user
    } catch (error) {
      console.error("Error details:", error); // Log the error for more details
      toast({
        title: 'Error',
        description: error.message || 'There was an error creating the user.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    if (!title || !description || !startTime || !endTime || !createdBy || !location) {
        toast({
            title: 'Error',
            description: 'All fields must be filled out.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
        return;
    }

    // Prepare the data to match your SQLite expectations
    const newEvent = {
        title,
        description,
        image,
        startTime: new Date(startTime).toISOString(),  // Format as ISO string
        endTime: new Date(endTime).toISOString(),      // Format as ISO string
        location,
        categoryIds: JSON.stringify(selectedCategories),  // Serialize categoryIds as JSON string
        createdBy,
    };

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
            throw new Error('Failed to add event');
        }

        const createdEvent = await response.json();
        setEvents((prevEvents) => [...prevEvents, createdEvent]);

        toast({
            title: 'Event created.',
            description: 'Your event has been added successfully.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });

        navigate('/home/events');
    } catch (error) {
        console.error("Error details:", error); // Log for more details
        toast({
            title: 'Error',
            description: 'There was an error creating the event.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
  };

  // Handler for changing themes using the select dropdown
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
    <Container maxW="container.md" p={4}>
      <Heading mb={4}>Add New Event</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Categories</FormLabel>
            <CheckboxGroup
              value={selectedCategories.map(String)}
              onChange={handleCategoryChange}
            >
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox key={category.id} value={category.id.toString()}>
                    {category.name}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Created By</FormLabel>
            <Select
              placeholder="Select creator"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Button onClick={onOpen} colorScheme="teal" width="full">
            Add User
          </Button>

          <Button type="submit" colorScheme="blue" width="full">
            Add Event
          </Button>
        </VStack>
      </form>

      {/* Modal for creating a new user */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>New User Name</FormLabel>
              <Input
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Upload Avatar</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewUserAvatar(e.target.files[0])}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateUser} isDisabled={!newUserName || !newUserAvatar}>
              Create User
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

   
    </Container>
  );
};

export default AddEventPage;