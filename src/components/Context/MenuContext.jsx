// MenuContext.js
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const MenuContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const MenuProvider = ({ children }) => {
  const [adminMenuItems, setAdminMenuItems] = useState([]);
  const [userMenuItems, setUserMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(3);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const adminEndpoint = `${BASE_URL}/api/v1/menu/admin/search`;
      const userEndpoint = `${BASE_URL}/api/v1/menu/search`;

      // Fetch both endpoints in parallel
      const [adminResponse, userResponse] = await Promise.all([
        axios.get(adminEndpoint, {
          headers: {
            "Cache-Control": "no-cache",
            Accept: "application/json",
          },
        }),
        axios.get(userEndpoint, {
          headers: {
            "Cache-Control": "no-cache",
            Accept: "application/json",
          },
        }),
      ]);

      setAdminMenuItems(adminResponse.data.results);
      setUserMenuItems(userResponse.data.results);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      if (retryCount > 0) {
        setRetryCount(retryCount - 1);
        setTimeout(fetchMenuItems, 2000); // Retry after 2 seconds
      } else {
        setError(
          "Failed to load menu after multiple attempts. Please check your network."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [retryCount]);

  // Function to update the availability of a menu item.
  const updateAvailability = async (itemId, isAvailable) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/v1/menu/item/${itemId}`,
        { isAvailable },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedItem = response.data.menuItem;

      // Update admin menu items: replace the updated item.
      setAdminMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? updatedItem : item
        )
      );

      // Update user menu items: if item is available, update it; otherwise, remove it.
      setUserMenuItems((prevItems) => {
        if (updatedItem.isAvailable) {
          return prevItems.map((item) =>
            item._id === itemId ? updatedItem : item
          );
        } else {
          return prevItems.filter((item) => item._id !== itemId);
        }
      });

      return updatedItem;
    } catch (err) {
      console.error("Error updating menu item availability:", err);
      throw err;
    }
  };
  const addMenuItem = async (newItemData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/menu/menu`, newItemData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // After successfully adding, refresh both admin and user menu items.
      await fetchMenuItems();

      return response.data;
    } catch (err) {
      console.error("Error adding menu item:", err);
      throw err;
    }
  };

  return (
    <MenuContext.Provider
      value={{
        adminMenuItems,
        userMenuItems,
        loading,
        error,
        updateAvailability,
        fetchMenuItems,
        addMenuItem // Exposing fetchMenuItems can be handy for manual refreshes.
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

