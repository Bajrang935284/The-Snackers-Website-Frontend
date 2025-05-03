import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import './MobileCheckoutBar.css';
import { useCart } from '../Context/CartContext';

const MobileCheckoutBar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  // Calculate total quantity and price
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // If no items in cart, don't render the component
  if (totalQuantity === 0) {
    return null;
  }
  
  return (
    <div className="mobile-checkout-bar">
      <div className="checkout-info">
        <div className="checkout-quantity">
          {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
        </div>
        <div className="checkout-price">
          ₹{totalPrice.toFixed(2)}
        </div>
      </div>
      <button 
        className="checkout-button"
        onClick={() => navigate('/checkout')}
      >
        <div className="checkout-button-content">
          <ShoppingCart size={18} />
          <span>Checkout</span>
        </div>
      </button>
    </div>
  );
};

export default MobileCheckoutBar;