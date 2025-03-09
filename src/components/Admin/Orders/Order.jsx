import React, { useEffect } from 'react';
import { useOrder } from '../../Context/OrderContaxt';
import "../Orders/order.css";

const Order = () => {
  const { orders, fetchOrders, updateOrderStatus, updatePaymentStatus, isLoading, error } = useOrder();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (isLoading) return <div className="orders-loading">Loading orders...</div>;
  if (error) return <div className="orders-error">Error: {error}</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-heading">Orders</h2>
      <div className="orders-content">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Token No</th>
              <th>Phone Number</th>
              <th>Time</th>
              <th>Quantity</th>
              <th>Item(s)</th>
              <th>Total Amount</th>
              <th>Delivery Details</th>
              <th>Order Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
  {orders
    .filter(order => {
      // If orderStatus is 'Delivered' and paymentStatus is 'Paid', filter it out
      return !(order.orderStatus === 'Delivered' && (order.paymentStatus || 'Pending') === 'Paid');
    })
    .map((order) => {
      const totalQuantity = order.orderItems
        ? order.orderItems.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
      const itemNames = order.orderItems
        ? order.orderItems.map((item) => item.name).join(', ')
        : 'N/A';

      const { deliveryDetails } = order;
      let deliveryInfo = null;
      if (deliveryDetails) {
        if (deliveryDetails.type === 'delivery') {
          deliveryInfo = (
            <div>
              <div>Type: {deliveryDetails.type}</div>
              <div>Hostel: {deliveryDetails.hostelName || 'N/A'}</div>
            </div>
          );
        } else if (deliveryDetails.type === 'pickup') {
          deliveryInfo = (
            <div>
              <div>Type: {deliveryDetails.type}</div>
              <div>
                Pickup: {deliveryDetails.pickupTime ? new Date(deliveryDetails.pickupTime).toLocaleString() : 'N/A'}
              </div>
            </div>
          );
        }
      }

      return (
        <tr key={order._id}>
          <td>{order.tokenNo}</td>
          <td>{order.phone}</td>
          <td>{new Date(order.createdAt).toLocaleString()}</td>
          <td>{totalQuantity}</td>
          <td>{itemNames}</td>
          <td>{order.totalAmount}</td>
          <td>{deliveryInfo}</td>
          <td>
            <select
              value={order.orderStatus}
              onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
            >
              {orderStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              value={order.paymentStatus || 'Pending'}
              onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
            >
              {paymentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </td>
        </tr>
      );
    })}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Order;




