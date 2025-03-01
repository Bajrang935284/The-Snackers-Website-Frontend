import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic fetch handler for order API requests
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

  // Fetch orders with an optional status filter
  const fetchOrders = async (status = '') => {
    const token = localStorage.getItem('adminToken');
    try {
      const data = await fetchHandler(
        `${BASE_URL}/api/v1/admin/orders${status ? `?status=${status}` : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(data.orders);
      return data.orders;
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const data = await fetchHandler(
        `${BASE_URL}/api/v1/admin/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status }),
        }
      );
      // Update the order in local state (assuming the updated order is returned as data.order)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
      return data.order;
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      const data = await fetchHandler(
        `${BASE_URL}/api/v1/admin/orders/${orderId}/payment-status`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ paymentStatus }),
        }
      );
      // Update the order in local state (assuming the updated order is returned as data.order)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
      return data.order;
    } catch (err) {
      console.error('Error updating payment status:', err);
      throw err;
    }
  };
  

  // Cancel order (or update its status to 'Cancelled')
  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    try {
      const data = await fetchHandler(
        `${BASE_URL}/api/v1/admin/orders/${orderId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Optionally remove the cancelled order from state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      return data;
    } catch (err) {
      console.error('Error cancelling order:', err);
      throw err;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        error,
        fetchOrders,
        updateOrderStatus,
        updatePaymentStatus,
        cancelOrder,
        setOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
