import React, { createContext, useState, useEffect } from 'react';
import { brightTheme, darkTheme, modernTheme, defaultLightTheme } from '../theme';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(defaultLightTheme);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch events
        const eventsResponse = await fetch('/api/events');
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch users
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch logged-in user
        const userResponse = await fetch('/api/current_user', {
          credentials: 'include',
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setLoggedInUser(userData);
        } else {
          setLoggedInUser(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{
      events, setEvents,
      categories, setCategories,
      users, setUsers,
      loggedInUser, setLoggedInUser,
      loading, error,
      currentTheme, setCurrentTheme,
    }}>
      {children}
    </DataContext.Provider>
  );
};