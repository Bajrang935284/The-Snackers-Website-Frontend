import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { Plus, Minus } from 'lucide-react';
import { useAddress } from '../Context/AddressContext';
import { useNavigate } from 'react-router-dom';
import './checkout.css';
import { useCanteen } from '../Context/CanteenSettingsContext';

const Checkout = () => {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
  const { address } = useAddress();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('delivery');
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  const { settings,isCanteenOpen } = useCanteen();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Helper function to check if canteen is open based on settings
 

  const handleProceedToPayment = () => {
    if (!isCanteenOpen()) {
      let alertMessage = 'Canteen is currently closed.';
      if (settings) {
        alertMessage += ` Our operating hours are from ${settings.openTime} to ${settings.closeTime}.`;
      }
      alert(alertMessage + ' Please order during operating hours.');
      return;
    }
    navigate('/payment', { state: { orderType, totalPrice } });
  };
  

  return (
    <div className="checkout-container">
      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <h1 className="empty-cart-heading">Your Cart is Empty</h1>
          <p className="empty-cart-subheading">
            Looks like you haven't added anything to your cart yet
          </p>
          <button
            className="return-home-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-content">
          {/* Left Side - Order Type, Address & Payment */}
          <div className="left-section">
            {/* Order Type Selection */}
            <div className="checkout-card">
              <h3 className="section-heading">Order Type</h3>
              <div className="order-type-toggle">
                <button
                  className={`toggle-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  Delivery
                </button>
                <button
                  className={`toggle-btn ${orderType === 'pickup' ? 'active' : ''}`}
                  onClick={() => setOrderType('pickup')}
                >
                  Pickup
                </button>
              </div>
            </div>

            {/* Address/Pickup Information */}
            {orderType === 'delivery' ? (
              <div className="checkout-card">
                <h4 className="section-heading">
                  {selectedAddress ? 'Delivery Address' : 'Select Delivery Address'}
                </h4>
                <div className="address-section">
                  {address ? (
                    <div className="saved-address">
                      <div className="address-details">
                        <h3>Saved Address</h3>
                        <p>{address}</p>
                      </div>
                      <button
                        className="deliver-here-btn"
                        onClick={() => setSelectedAddress(address)}
                      >
                        Deliver Here
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-address-btn"
                      onClick={() => setShowAddAddress(true)}
                    >
                      Add New Address
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="checkout-card">
                <h2 className="section-heading">Pickup Information</h2>
                <p className="pickup-message">
                  Your order will be prepared at the canteen. We'll notify you when it's ready for pickup.
                </p>
              </div>
            )}

            {/* Payment Card */}
            <div className="checkout-card payment-section">
              <h3 className="section-heading">Payment</h3>
              <button
                className={`proceed-pay-btn ${
                  orderType === 'delivery' && !selectedAddress ? 'disabled' : ''
                }`}
                onClick={handleProceedToPayment}
                disabled={orderType === 'delivery' && !selectedAddress}
              >
                Proceed to Pay ₹{totalPrice.toFixed(2)}
              </button>
            </div>
          </div>

          {/* Right Side - Cart Items */}
          <div className="right-section">
            <div className="cart-card">
              <h2 className="cart-heading">Your Order ({cartItems.length})</h2>
              <div className="cart-items-list">
                {cartItems.map((cartItem) => (
                  <div key={cartItem._id} className="cart-item">
                    <div className="item-info">
                      <h3 className="item-title">{cartItem.title}</h3>
                      <p className="item-price">₹{(cartItem.price * cartItem.quantity).toFixed(2)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => decreaseQuantity(cartItem._id)} className="quantity-btn">
                        <Minus size={18} />
                      </button>
                      <span className="quantity">{cartItem.quantity}</span>
                      <button onClick={() => increaseQuantity(cartItem._id)} className="quantity-btn">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total Amount:</span>
                <span className="total-price">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
