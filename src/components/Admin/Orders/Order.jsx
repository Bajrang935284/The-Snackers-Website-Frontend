
import React, { useEffect, useState } from 'react';
import { useOrder } from '../../Context/OrderContaxt';
import "../Orders/order.css";

const Order = () => {
  const { orders, fetchOrders, updateOrderStatus, updatePaymentStatus, isLoading, error } = useOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');

  useEffect(() => {
    fetchOrders();
    
  }, []);

  const orderStatusOptions = ['Placed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const paymentStatusOptions = ['Pending', 'Paid', 'Failed'];

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await updatePaymentStatus(orderId, newPaymentStatus);
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  // Calculate next status based on current status
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Placed': 'Preparing',
      'Preparing': 'Ready',
      'Ready': 'Out for Delivery',
      'Out for Delivery': 'Delivered'
    };
    return statusFlow[currentStatus] || currentStatus;
  };

  // Get button text based on current status
  const getButtonText = (currentStatus) => {
    const buttonText = {
      'Placed': 'Start Preparing',
      'Preparing': 'Mark as Ready',
      'Ready': 'Send for Delivery',
      'Out for Delivery': 'Complete Order'
    };
    return buttonText[currentStatus] || 'Update';
  };

  // Get button icon based on current status
  const getButtonIcon = (currentStatus) => {
    const icons = {
      'Placed': '👨‍🍳',
      'Preparing': '✅',
      'Ready': '🚚',
      'Out for Delivery': '🔔'
    };
    return icons[currentStatus] || '';
  };

  // Enhanced search and filter function
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    // Apply status filter
    let statusCondition = true;
    if (filterStatus === 'cancelled') {
      statusCondition = order.orderStatus === 'Cancelled';
    } else if (filterStatus === 'active') {
      statusCondition = order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled';
    }
    
    // If search term is empty, just apply status filter
    if (!searchTerm.trim()) {
      return statusCondition;
    }
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // Check token number
    const tokenMatch = order.tokenNo ? 
      order.tokenNo.toString().includes(searchTermLower) : 
      false;
    
    // Check phone number
    const phoneMatch = order.phone ?
      String(order.phone).toLowerCase().includes(searchTermLower) :
      false;
    
    // Check item names
    let itemMatch = false;
    if (order.orderItems && Array.isArray(order.orderItems)) {
      itemMatch = order.orderItems.some(item => 
        item.name && item.name.toLowerCase().includes(searchTermLower)
      );
    }
    
    return (tokenMatch || phoneMatch || itemMatch) && statusCondition;
  });

  if (isLoading) return <div className="orders-loading">Loading orders...</div>;
  if (error) return <div className="orders-error">Error: {error}</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-heading">Orders</h2>
      
      <div className="orders-filters">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by token, phone, or item name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="filter-buttons">
          <button 
            className={filterStatus === 'active' ? 'active' : ''} 
            onClick={() => setFilterStatus('active')}
          >
            Active Orders
          </button>
          <button 
            className={filterStatus === 'cancelled' ? 'active' : ''} 
            onClick={() => setFilterStatus('cancelled')}
          >
            Cancelled Orders
          </button>
        </div>
      </div>
      
      <div className="orders-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            if (!order) return null;
            
            const totalQuantity = order.orderItems
              ? order.orderItems.reduce((acc, item) => acc + item.quantity, 0)
              : 0;
              
            const { deliveryDetails } = order;
            
            // Delivery information display
            let deliveryInfo = 'N/A';
            if (deliveryDetails && deliveryDetails.type) {
              // normalize the type string
              const t = deliveryDetails.type.toLowerCase();
              if (t === 'delivery') {
                deliveryInfo = `Delivery to: ${deliveryDetails.hostelName || 'N/A'}`;
              } 
              else if (t === 'pickup') {
                deliveryInfo = "Pickup";
              }
            }
            
            const isDisabled = order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled';
            const orderDate = new Date(order.createdAt || Date.now());
            
            // Highlight matching items if searching by item name
            const highlightMatchingItems = (itemName) => {
              if (!searchTerm.trim()) return itemName;
              
              if (itemName && itemName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return (
                  <span className="highlighted-item">{itemName}</span>
                );
              }
              
              return itemName;
            };
            
            return (
              <div 
                key={order._id} 
                className={`order-card ${(order.orderStatus || 'placed').toLowerCase()}-status`}
              >
                <div className="order-header">
                  <div className="order-token">Token #{order.tokenNo || 'N/A'}</div>
                  <div className="order-status-container">
                    <select
                      className="order-status-select"
                      value={order.orderStatus}
                      onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="order-time">
                  {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                
                <div className="order-contact">
                  <div className="order-phone"> <img width={15} src="/icons8-call-26.png" alt="call image" /> {order.phone || 'N/A'}</div>
                  <div className="order-delivery">{deliveryInfo}</div>
                </div>
                
                <div className="order-items">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item, index) => (
                          <tr key={index} className={item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()) ? 'highlighted-row' : ''}>
                            <td>{highlightMatchingItems(item.name || 'Unknown Item')}</td>
                            <td>{item.quantity || 0}</td>
                            <td>₹{item.price || 0}</td>
                            <td>₹{(item.quantity || 0) * (item.price || 0)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No items in this order</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="1">Total</td>
                        <td>{totalQuantity}</td>
                        <td></td>
                        <td>₹{order.totalAmount || 0}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="payment-section">
                  <div className="payment-status">
                    <span>Payment Status:</span>
                    <select
                      value={order.paymentStatus || 'Pending'}
                      onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                      className={`payment-status-${(order.paymentStatus || 'pending').toLowerCase()}`}
                    >
                      {paymentStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="order-actions">
                  {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                    <button 
                      className="action-button"
                      onClick={() => handleOrderStatusChange(order._id, getNextStatus(order.orderStatus))}
                    >
                      {getButtonIcon(order.orderStatus)} {getButtonText(order.orderStatus)}
                    </button>
                  )}
                  
                  {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                    <button 
                      className="cancel-button"
                      onClick={() => handleOrderStatusChange(order._id, 'Cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-orders">
            {searchTerm ? (
              <>
                <p>No orders found matching "{searchTerm}"</p>
                <button className="reset-search" onClick={() => setSearchTerm('')}>Clear Search</button>
              </>
            ) : (
              <p>No orders found. Adjust filters or check back later.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
