
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
  const { user, isLoading, signIn,signUp, logout } = useUser();
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
  // If the user is logged in, wrap the whole li with a Link
  <Link to="/profile/orders">
    <li className="header-menu-item profile-item">
      <ProfileIcon />
      {isLoading ? (
        <span className="auth-loading">Checking session...</span>
      ) : (
        <div className="profile-section">Profile</div>
      )}
    </li>
  </Link>
) : (
  // If the user is not logged in, use li with an onClick handler
  <li 
    className="header-menu-item profile-item" 
    onClick={() => setIsAuthModalOpen(true)}
  >
    <ProfileIcon />
    {isLoading ? (
      <span className="auth-loading">Checking session...</span>
    ) : (
      <div className="profile-section">Log in</div>
    )}
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
        />
      )}
      
    </div>
  );
};

export default Header;