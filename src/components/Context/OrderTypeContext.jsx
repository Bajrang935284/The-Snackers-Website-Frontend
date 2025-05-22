import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderTypeContext = createContext();

export const OrderTypeProvider = ({ children }) => {
  const [orderType, setOrderType] = useState('delivery');      // 'delivery' or 'pickup'
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.thesnackers.in";

  // Fetch settings on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/settings`);
        setDeliveryAvailable(data.deliveryAvailable);
        setPickupAvailable(data.pickupAvailable);
        // ensure orderType is valid
        if (data.deliveryAvailable === false && orderType === 'delivery') {
          setOrderType('pickup');
        }
      } catch (err) {
        console.error("Could not fetch settings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Helpers to toggle on the server
  const updateDeliveryAvailable = async (flag) => {
    await axios.patch(`${BASE_URL}/api/v1/settings/delivery`, { deliveryAvailable: flag });
    setDeliveryAvailable(flag);
    if (!flag && orderType === 'delivery') {
      setOrderType('pickup');
    }
  };

  const updatePickupAvailable = async (flag) => {
    await axios.patch(`${BASE_URL}/api/v1/settings/pickup`, { pickupAvailable: flag });
    setPickupAvailable(flag);
    if (!flag && orderType === 'pickup') {
      setOrderType('delivery');
    }
  };

  return (
    <OrderTypeContext.Provider
      value={{
        orderType,
        setOrderType,
        deliveryAvailable,
        updateDeliveryAvailable,
        pickupAvailable,
        updatePickupAvailable,
        loading
      }}
    >
      {children}
    </OrderTypeContext.Provider>
  );
};

export const useOrderType = () => useContext(OrderTypeContext);

