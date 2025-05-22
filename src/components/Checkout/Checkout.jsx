import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { Plus, Minus } from 'lucide-react';
import { useAddress } from '../Context/AddressContext';
import { useNavigate } from 'react-router-dom';
import DeliveryAddressSelector from '../address/DeliveryAddress';
import './checkout.css';
import { useCanteen } from '../Context/CanteenSettingsContext';
import { useOrderType } from '../Context/OrderTypeContext';

const Checkout = () => {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
  const { address } = useAddress();
  const { orderType, setOrderType, deliveryAvailable, pickupAvailable } = useOrderType();
  const [showUnavailableMsgOfDelivey, setShowUnavailableMsgOfDelivery] = useState(false);
  const [showUnavailableMsgOfPickup, setShowUnavailableMsgOfPickup] = useState(false);
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
   const [isDeliveryAddressOpen, setIsDeliveryAddressOpen] = useState(false);
  const { settings, isCanteenOpen } = useCanteen();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryCharge = orderType === 'delivery' ? 20 : 0;
  const orderAmount = totalPrice + deliveryCharge;

  const handleDelivery = () => {
    if (deliveryAvailable) {
      setOrderType('delivery');
    } else {
      setShowUnavailableMsgOfDelivery(true);
      setTimeout(() => {
        setShowUnavailableMsgOfDelivery(false);
      }, 3000);
    }
  };

  const handlePickup = () => {
    if (pickupAvailable) {
      setOrderType('pickup');
    } else {
      setShowUnavailableMsgOfPickup(true);
      setTimeout(() => {
        setShowUnavailableMsgOfPickup(false);
      }, 3000);
    }
  };

  const handleProceedToPayment = () => {
    if (!isCanteenOpen()) {
      let alertMessage = 'Canteen is currently closed.';
      if (settings) {
        alertMessage += ` Our operating hours are from ${settings.openTime} to ${settings.closeTime}.`;
      }
      alert(alertMessage + ' Please order during operating hours.');
      return;
    }

    if (totalPrice < 90) {
      alert('Minimum order amount should be ₹90');
      return;
    }

    if (orderType === 'delivery' && !selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }

    navigate('/payment', { state: { orderType, orderAmount } });
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
          {/* Left Section */}
          <div className="left-section">
            {/* Order Type */}
            <div className="checkout-card">
              <h3 className="section-heading">Order Type</h3>
              <div className="order-type-toggle">
                <button
                  className={`toggle-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={handleDelivery}
                >
                  {showUnavailableMsgOfDelivey ? 'Delivery is not available' : 'Delivery'}
                </button>
                <button
                  className={`toggle-btn ${orderType === 'pickup' ? 'active' : ''}`}
                  onClick={handlePickup}
                >
                  {showUnavailableMsgOfPickup ? 'Pickup is not available' : 'Pickup'}
                </button>
              </div>
            </div>

            {/* Address / Pickup Section */}
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
                    <div
            className="delivering-to"
            onClick={() => setIsDeliveryAddressOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <DeliveryAddressSelector
              isOpen={isDeliveryAddressOpen}
              setIsOpen={setIsDeliveryAddressOpen}
            />
            
          </div>
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

            {/* Payment Section */}
            <div className="checkout-card payment-section">
              <h3 className="section-heading">Payment</h3>
              <button
                className={`proceed-pay-btn ${
                  orderType === 'delivery' && !selectedAddress ? 'disabled' : ''
                }`}
                onClick={handleProceedToPayment}
                disabled={orderType === 'delivery' && !selectedAddress}
              >
                Proceed to Pay ₹{orderAmount.toFixed(2)}
              </button>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="right-section">
            <div className="bill-card">
              <div className="bill-header">
                <h2 className="bill-title">Your Order ({cartItems.length})</h2>
              </div>

              <div className="bill-items-container">
                <div className="bill-headers">
                  <span className="item-header">Item</span>
                  <span className="qty-header">Qty</span>
                  <span className="price-header">Price</span>
                </div>

                <div className="bill-items-list">
                  {cartItems.map((cartItem) => (
                    <div key={cartItem._id} className="bill-item">
                      <div className="item-details">
                        <h3 className="item-name">{cartItem.title}</h3>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => decreaseQuantity(cartItem._id)} className="quantity-btn" aria-label="Decrease quantity">
                          <Minus size={14} />
                        </button>
                        <span className="quantity">{cartItem.quantity}</span>
                        <button onClick={() => increaseQuantity(cartItem._id)} className="quantity-btn" aria-label="Increase quantity">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="item-price">₹{(cartItem.price * cartItem.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bill-divider"></div>

              <div className="bill-summary">
                <div className="bill-row">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="bill-row">
                    <span>Delivery Charge:</span>
                    <span>₹{deliveryCharge.toFixed(2)}</span>
                  </div>
                )}
                <div className="bill-divider"></div>
                <div className="bill-row total-row">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-price">₹{orderAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

