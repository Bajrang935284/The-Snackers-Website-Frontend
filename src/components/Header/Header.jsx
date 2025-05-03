
import React, { useState } from 'react';
import { ShoppingCart, User, SearchIcon, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Header/header.css';
import DeliveryAddressSelector from '../address/DeliveryAddress';
import { useUser } from '../Context/UserContext';
import AuthModal from '../Auth/Auth';
import CartIcon from '../CartIcon';
import LocationIcon from '../LocationIcon';
import { useCart } from '../Context/CartContext';
import MobileFooter from '../MobileFooter/MobileFooter';
import Logo from '../Logo';
import ArrowDown from '../ArrowDown';
import ProfileIcon from '../Profile/ProfileIcon';

const Header = () => {
  const { user, isLoading, signIn,signUp, logout,handleForgotPassword } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDeliveryAddressOpen, setIsDeliveryAddressOpen] = useState(false);
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleAuthSubmit = async (isLogin, formData) => {
    const success = isLogin ? await signIn(formData) : await signUp(formData);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const handleForgotPasswordSubmit = async (email) => {
    try {
      await handleForgotPassword(email);
      return true;
    } catch (error) {
      console.error("Failed to send reset email:", error);
      return false;
    }
  };

  return (
    <div className="header-container">
      <header className="header">
        {/* Logo Section */}
        <div className="header-logo">
          <h2>
            <Link to="/">
              <Logo size={100} />
            </Link>
          </h2>
        </div>

        {/* Address Section */}
        <div className="address">
          <div className="location-icon">
            <LocationIcon />
          </div>
          <div
            className="delivering-to"
            onClick={() => setIsDeliveryAddressOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <DeliveryAddressSelector
              isOpen={isDeliveryAddressOpen}
              setIsOpen={setIsDeliveryAddressOpen}
            />
            <span className="arrowDown">
              <ArrowDown />
            </span>
          </div>
        </div>

        {/* Menu Section */}
        <ul className="header-menu">
          <Link to="/search">
          <li className="header-menu-item" >
            <SearchIcon size={20} />
            Search
          </li>
          </Link>

          <Link to="/menu">
          <li className="header-menu-item">

            <Menu size={24} color="black" />
            Menu
          </li>
          </Link>

          {user ? (
  <Link to="/profile">
    <li className="profile-item">
      {/* Always show icon on desktop, and on mobile when logged in */}
      <ProfileIcon className="profile-icon" />
      
      {/* Desktop: Show "Profile" label */}
      <span className="profile-label">Profile</span>
    </li>
  </Link>
) : (
  <li
    className="profile-item"
    onClick={() => setIsAuthModalOpen(true)}
  >
    {/* Mobile: Show only log in button */}
    <button className="login-button-mobile">
      Log in
    </button>
    
    {/* Desktop: Show icon + "Log in" label */}
    <ProfileIcon className="profile-icon-desktop" />
    <span className="profile-label">Log in</span>
  </li>
)}




          <Link to="/checkout">
          <li className="header-menu-item">
            <div className="cart-icon-container">
              <CartIcon />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </div>
           Cart
          </li>
          </Link>
        </ul>
      </header>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSubmit={handleAuthSubmit}
          onForgotPassword = {handleForgotPassword}

        />
      )}
      
    </div>
  );
};

export default Header;