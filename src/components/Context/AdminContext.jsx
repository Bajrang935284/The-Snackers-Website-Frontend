// AdminContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Use a separate token for admin, adjust BASE_URL as needed
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generic fetch handler for admin API requests
  const fetchHandler = async (url, options = {}) => {
    setIsLoading(true);
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

  // Check admin authentication status on mount
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await fetchHandler(`${BASE_URL}/api/v1/admin/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data || !data.email) {
        throw new Error('Invalid admin data');
      }
      setAdmin(data);
    } catch (err) {
      console.error('Admin session validation failed:', err);
      logout();
    }
  };

  // Admin sign-in method
  const signIn = async (credentials) => {
    try {
      const data = await fetchHandler(`${BASE_URL}/api/v1/admin/signin`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        setAdmin(data.admin || data);
      }
      return true;
    } catch (err) {
      console.error('Admin login failed:', err);
      return false;
    }
  };

  // Admin sign-up method
  const signUp = async (adminData) => {
    try {
      const data = await fetchHandler(`${BASE_URL}/api/v1/admin/signup`, {
        method: 'POST',
        body: JSON.stringify(adminData),
      });
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        setAdmin(data.admin || data);
      }
      return true;
    } catch (err) {
      console.error('Admin signup failed:', err);
      return false;
    }
  };

  // Logout clears token and admin state
  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isLoading,
        error,
        signUp,
        signIn,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

