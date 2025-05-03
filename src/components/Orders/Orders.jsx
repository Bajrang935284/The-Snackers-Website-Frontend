import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import './orders.css'; 
import BackAero from './BackAero';

const Orders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const navigate = useNavigate();

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
    fetchOrders();
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <button className="back-button" onClick={handleBackClick}>
          <BackAero/>
        </button>
        <h1>My Orders</h1>
      </div>

      {loading && (
        <div className="loading-spinner">
          <p>Loading your orders...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={fetchOrders}>Try Again</button>
        </div>
      )}

      {orders && (
        <div className="orders-container">
          <div className="order-tabs">
            <button 
              className={activeTab === 'current' ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab('current')}
            >
              Current
            </button>
            <button
              className={activeTab === 'completed' ? 'tab-button active' : 'tab-button'}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>
         
          <div className="orders-list">
            {(activeTab === 'current' ? orders.currentOrders : orders.completedOrders)?.length > 0 ? (
              (activeTab === 'current' ? orders.currentOrders : orders.completedOrders).map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">Token No #{order.tokenNo}</div>
                    <div className={`order-status ${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </div>
                  </div>
                  
                  <div className="order-date">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}  at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  
                  <div className="order-items">
                    {order.orderItems.map(item => (
                      <div key={item.itemId} className="order-item">
                        <div className="item-quantity">{item.quantity}x</div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-total">
                    <span>Total Amount:</span>
                    <span className="total-amount">₹{order.totalAmount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-orders">
                <p>No {activeTab} orders found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;