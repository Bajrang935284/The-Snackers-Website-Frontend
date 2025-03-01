// CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cartItems from localStorage, if available.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error reading cartItems from localStorage", error);
      return [];
    }
  });

  // Update localStorage whenever cartItems changes.
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cartItems to localStorage", error);
    }
  }, [cartItems]);

  // Add an item to the cart with initial quantity of 1.
  const addToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
  };

  // Remove an item from the cart by its _id.
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
  };

  // Increase the quantity of a specific item.
  const increaseQuantity = (itemId) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease the quantity of a specific item, removing it if quantity goes to 0.
  const decreaseQuantity = (itemId) => {
    setCartItems(prev => {
      const updatedItems = prev.map(item =>
        item._id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  // Check if an item is already in the cart.
  const isInCart = (itemId) => {
    return cartItems.some(item => item._id === itemId);
  };

  // Get the quantity of a specific item in the cart.
  const getItemQuantity = (itemId) => {
    const item = cartItems.find(item => item._id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      isInCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
