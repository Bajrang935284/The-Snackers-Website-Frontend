import React, { useState } from 'react';
import '../Hero/adminHero.css';
import Order from '../Orders/Order';
import AdminMenu from '../Menu/AdminMenu';
import AdminSetting from '../Settings/AdminSetting';

const Hero = () => {
  const [selectedOption, setSelectedOption] = useState('Orders');

  const renderContent = () => {
    switch (selectedOption) {
      case 'Dashboard':
        return <div style={{display:'flex', justifyContent:"center", marginTop:'300px'}}>Coming soon</div>;
      case 'Orders':
        return <Order />;
      case 'Menu Items':
        return <AdminMenu/>;
      case 'Settings':
        return <AdminSetting/>;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <>
      <div className="hero">
        {/* Desktop Left Sidebar Menu - will be hidden on mobile */}
        <div className="hero__left-side">
          <ul className="hero__menu">
            <li
              className={`hero__menu-item ${selectedOption === 'Dashboard' ? 'active' : ''}`}
              onClick={() => setSelectedOption('Dashboard')}
            >
              Dashboard
            </li>
            <li
              className={`hero__menu-item ${selectedOption === 'Orders' ? 'active' : ''}`}
              onClick={() => setSelectedOption('Orders')}
            >
              Orders
            </li>
            <li
              className={`hero__menu-item ${selectedOption === 'Menu Items' ? 'active' : ''}`}
              onClick={() => setSelectedOption('Menu Items')}
            >
              Menu Items
            </li>
            <li
              className={`hero__menu-item ${selectedOption === 'Settings' ? 'active' : ''}`}
              onClick={() => setSelectedOption('Settings')}
            >
              Settings
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="hero__right-side">
          {renderContent()}
        </div>
      </div>

      <div className="mobile-footer">
  <div className="mobile-nav">
    <button 
      className={`mobile-nav-item ${selectedOption === 'Dashboard' ? 'active' : ''}`}
      onClick={() => setSelectedOption('Dashboard')}
    >
      <div className="mobile-nav-icon">📊</div>
      <span>Dashboard</span>
    </button>
    
    <button 
      className={`mobile-nav-item ${selectedOption === 'Orders' ? 'active' : ''}`}
      onClick={() => setSelectedOption('Orders')}
    >
      <div className="mobile-nav-icon">🛒</div>
      <span>Orders</span>
    </button>
    
    <button 
      className={`mobile-nav-item ${selectedOption === 'Menu Items' ? 'active' : ''}`}
      onClick={() => setSelectedOption('Menu Items')}
    >
      <div className="mobile-nav-icon">🍔</div>
      <span>Menu</span>
    </button>
    
    <button 
      className={`mobile-nav-item ${selectedOption === 'Settings' ? 'active' : ''}`}
      onClick={() => setSelectedOption('Settings')}
    >
      <div className="mobile-nav-icon">⚙️</div>
      <span>Settings</span>
    </button>
  </div>
</div>
    </>
  );
};

export default Hero;