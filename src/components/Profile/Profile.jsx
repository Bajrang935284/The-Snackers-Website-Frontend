import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import { useAddress } from '../Context/AddressContext';
import { useNavigate, useLocation } from 'react-router-dom';
import DeliveryAddressSelector from '../address/DeliveryAddress';
import ArrowDown from '../ArrowDown';
import '../Profile/profile.css';

const Profile = () => {
  const { user, logout } = useUser();
  const { address } = useAddress();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [showAddressSelector, setShowAddressSelector] = useState(false);

  // States for editing profile info
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3000/api/v1/order/my-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname === '/profile/orders') {
      fetchOrders();
    }
  }, [location.pathname]);

  // Handler for updating profile info
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: editName, email: editEmail })
      });
      if (!response.ok) throw new Error('Failed to update profile');
      await response.json();
      alert('Profile updated successfully');
      // Optionally update the user context here if needed
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  return (
    <div className='profile'>
      <div className='profile-container'>
        <div className='left-sidebar'>
          <div className='user'>
            <h3>{user?.name}</h3>
            <h4>{user?.phone}</h4>
          </div>
          <div className='orders' onClick={() => {
            setActiveTab('current');
            // Optionally, fetch orders here if needed
          }}>
            <p>Orders</p>
          </div>
          <div className='addresses' onClick={() => {
            setActiveTab('addresses');
            // Reset the address selector state when switching tabs, if desired
            setShowAddressSelector(false);
          }}>
            <p>Addresses</p>
          </div>
          <div className='edit-profile' onClick={() => setActiveTab('editProfile')}>
            <p>Edit Profile</p>
          </div>
          <div className='customer-support' onClick={() => setActiveTab('customerSupport')}>
            <p>Customer Support</p>
          </div>
          <div className='logout'>
            <h3 onClick={() => {
              logout();
              navigate('/');
            }}>Logout</h3>
          </div>
        </div>
        
        <div className='right-sidebar'>
          {loading && <p>Loading orders...</p>}
          {error && <p className="error">{error}</p>}
          
          {activeTab === 'current' && orders && (
            <div className="orders-container">
              <div className="order-tabs">
                <button 
                  className={activeTab === 'current' ? 'active' : ''}
                  onClick={() => setActiveTab('current')}
                >
                  Current Orders
                </button>
                <button
                  className={activeTab === 'completed' ? 'active' : ''}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed Orders
                </button>
              </div>
              <div className="orders-list">
                {(activeTab === 'current' ? orders.currentOrders : orders.completedOrders).map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <span>Order ID: {order._id}</span>
                      <span className={`status ${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="order-details">
                      <p>Total Amount: ₹{order.totalAmount}</p>
                      <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="order-items">
                      <h4>Items:</h4>
                      {order.orderItems.map(item => (
                        <div key={item.itemId} className="order-item">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'editProfile' && (
            <div className="edit-profile-form">
              <h2>Edit Profile</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input 
                    id="name"
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input 
                    id="email"
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)} 
                  />
                </div>
                <button type="submit">Update Profile</button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="address-card">
              <h2 className="address-title">Delivery Address</h2>
              {address ? (
                <div className="address-info">
                  <div className="current-address">
                    <h3>Current Address:</h3>
                    <p>{address}</p>
                  </div>
                  <button 
                    className="change-address-btn" 
                    onClick={() => setShowAddressSelector(true)}
                  >
                    Change Address
                  </button>
                </div>
              ) : (
                <div className="address-empty">
                  <p>No address selected.</p>
                  <button 
                    className="change-address-btn" 
                    onClick={() => setShowAddressSelector(true)}
                  >
                    Add Address
                  </button>
                </div>
              )}
              {showAddressSelector && (
                <div className="address-selector">
                  {/* This renders your address selection/search component only when requested */}
                  <DeliveryAddressSelector /> <ArrowDown/>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customerSupport' && (
            <div className="customer-support-card">
              <h2>Customer Support</h2>
              <p>For any bug related to website , please contact at  bbana15102004@gmail.com.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

