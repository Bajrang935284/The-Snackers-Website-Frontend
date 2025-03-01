import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext'; 
import { useAddress } from '../Context/AddressContext';
import axios from "axios";
import './Payment.css';
import './OrderConfirmationModal.css';

const OrderConfirmationModal = ({ orderDetails, onClose }) => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate('/profile/orders');
    onClose();
  };

  const handleGoHome = () => {
    navigate('/');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="success-icon">✓</div>
        <h2>Order Confirmed!</h2>
        
        <div className="order-details">
          <p>
            <span>Order ID:</span>
            <span>{orderDetails.orderId}</span>
          </p>
          <p>
            <span>Total Amount:</span>
            <span>₹{orderDetails.totalAmount}</span>
          </p>
          <p>
            <span>Payment Method:</span>
            <span>{orderDetails.paymentMethod}</span>
          </p>
          <p>
            <span>Estimated Time:</span>
            <span>{orderDetails.estimatedTime}</span>
          </p>
        </div>

        <div className="action-buttons">
          <button onClick={handleViewOrders}>Track Orders</button>
          <button onClick={handleGoHome}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const { address } = useAddress();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async () => {
    setIsOrderProcessing(true);
    try {
      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty. Please add items before placing an order.');
      }
  
      // Validate delivery details
      const deliveryType = "delivery"; // or "pickup" based on user selection
      if (deliveryType === "delivery" && !address) {
        throw new Error('Hostel name is required for delivery.');
      }
      if (deliveryType === "pickup" && !pickupTime) {
        throw new Error('Pickup time is required for pickup.');
      }
  
      // Prepare order details
      const orderDetails = {
        orderItems: cartItems.map(item => ({
          itemId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryDetails: {
          type: deliveryType,
          hostelName: deliveryType === "delivery" ? address : null,
          pickupTime: deliveryType === "pickup" ? pickupTime : null
        }
      };
  
      // Get base URL
      const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You are not logged in. Please log in to place an order.');
      }
  
      // Send request to backend
      const response = await axios.post(`${BASE_URL}/api/v1/order/place-order`, orderDetails, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add token for authentication
        },
      });
  
      // Handle successful response
      setOrderData(response.data);
      setShowConfirmation(true);
      setCartItems([]); // Clear cart after successful order
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || error.message || 'Failed to place order');
    } finally {
      setIsOrderProcessing(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="payment-page">
      <h2 className="page-heading">Secure Payment</h2>
      
      <div className="payment-layout">
        <div className="order-summary">
          <h3 className="summary-heading">Order Summary</h3>
          {cartItems.map(item => (
            <div key={item._id} className="order-item">
              <span>{item.title}</span>
              <span>x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="total-amount">
            <strong>Total Amount:</strong>
            <strong>₹{totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-methods">
          <h3 className="summary-heading">Payment Options</h3>
          <div className="payment-option">
            <label>
              
              <div>
                <h4>UPI Payment</h4>
                <p>Currently Unavailable</p>
              </div>
            </label>
          </div>

          <div className="payment-option">
            <label>
              <input 
                type="radio" 
                value="cash"
                checked={selectedPaymentMethod === 'cash'}
                onChange={handlePaymentMethodChange}
              />
              <div>
                <h4>Cash on Delivery</h4>
                <p>Pay when you receive your order</p>
              </div>
            </label>
          </div>

          <button 
            className="place-order-btn"
            disabled={!selectedPaymentMethod || isOrderProcessing}
            onClick={handlePlaceOrder}
          >
            {isOrderProcessing ? 'Processing...' : `Pay ₹${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>

      {showConfirmation && orderData && (
        <OrderConfirmationModal 
          orderDetails={orderData}
          onClose={handleCloseConfirmation}
        />
      )}
    </div>
  );
};

export default Payment;