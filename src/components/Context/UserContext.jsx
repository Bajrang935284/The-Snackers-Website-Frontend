// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Generic API request handler
  const fetchHandler = async (url, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Check user authentication status
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchHandler(`${BASE_URL}/api/v1/user/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.email) {
        throw new Error('Invalid user data');
      }
      setUser(data);
    } catch (err) {
      console.error('Session validation failed:', err);
      logout();
    }
  };

  // Sign in method
  const signIn = async (credentials) => {
    try {
      const data = await fetchHandler(`${BASE_URL}/api/v1/user/signin`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      localStorage.setItem('token', data.token);
      setUser(data.user || data);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  // Sign up method
  const signUp = async (userData) => {
    try {
      const data = await fetchHandler(`${BASE_URL}/api/v1/user/signup`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      localStorage.setItem('token', data.token);
      setUser(data.user || data);
      return true;
    } catch (err) {
      console.error('Signup failed:', err);
      return false;
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        signUp,
        signIn,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);

