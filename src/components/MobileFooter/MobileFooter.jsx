
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu as MenuIcon, ShoppingBag, ShoppingCart } from 'lucide-react'; 
import Home from '../HomeIcon';
import { useCart } from '../Context/CartContext';
import './mobileFooter.css'; // Separate CSS for the mobile footer

const MobileFooter = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mobile-footer">
      <nav className="mobile-footer-nav">
        {/* Home */}
        <Link to="/" className="mobile-footer-item">
          <Home size={20} />
          <span>Snackers</span>
        </Link>

        {/* Search */}
        <Link to="/search" className="mobile-footer-item">
          <Search size={20} />
          <span>Search</span>
        </Link>

        {/* Menu */}
        <Link to="/menu" className="mobile-footer-item">
          <MenuIcon size={20} />
          <span>Menu</span>
        </Link>

        {/* Orders (example icon: ShoppingBag) */}
        <Link to="/profile/orders" className="mobile-footer-item">
          <ShoppingBag size={20} />
          <span>Orders</span>
        </Link>

    
      </nav>
    </div>
  );
};

export default MobileFooter;

