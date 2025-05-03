
import React, { useState, useEffect } from 'react';
import { useCanteen } from '../../Context/CanteenSettingsContext';
import { useOrderType } from '../../Context/OrderTypeContext';
import { Clock, ShoppingBag } from 'lucide-react';
import './adminSetting.css'; // We'll add our new styles to this file

const AdminSetting = () => {
  const { settings, updateSettings, isCanteenOpen } = useCanteen();
  const {
    deliveryAvailable,
    updateDeliveryAvailable,
    pickupAvailable,
    updatePickupAvailable
  } = useOrderType();

  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [message, setMessage] = useState('');
  const [canteenStatus, setCanteenStatus] = useState(false);

  // Prefill inputs when settings load
  useEffect(() => {
    if (settings) {
      setOpenTime(settings.openTime);
      setCloseTime(settings.closeTime);
      setCanteenStatus(isCanteenOpen());
    }
  }, [settings, isCanteenOpen]);

  const handleUpdate = async () => {
    try {
      const res = await updateSettings({ openTime, closeTime });
      setMessage(res.message || 'Settings updated successfully');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      setMessage('Failed to update settings');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeliveryToggle = async () => {
    try {
      await updateDeliveryAvailable(!deliveryAvailable);
    } catch {
      setMessage('Failed to update delivery availability');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePickupToggle = async () => {
    try {
      await updatePickupAvailable(!pickupAvailable);
    } catch {
      setMessage('Failed to update pickup availability');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Canteen Name Header */}
      <div className="canteen-header">
        <h1>The Snackers</h1>
        <div className="status-indicator">
          <span className={`status-badge ${canteenStatus ? 'open' : 'closed'}`}>
            <span className="status-dot"></span>
            {canteenStatus ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="message-container">
          {message}
        </div>
      )}

      <div className="settings-cards-container">
        {/* Time Settings Card */}
        <div className="settings-card">
          <div className="card-header">
            <Clock className="card-icon" size={20} />
            <h2>Operating Hours</h2>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Open Time (HH:MM)</label>
              <input
                type="text"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                placeholder="09:00"
              />
            </div>
            <div className="input-group">
              <label>Close Time (HH:MM)</label>
              <input
                type="text"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                placeholder="17:00"
              />
            </div>
            <button className="update-button" onClick={handleUpdate}>
              Update Hours
            </button>
          </div>
        </div>

        {/* Order Type Settings Card */}
        <div className="settings-card">
          <div className="card-header">
            <ShoppingBag className="card-icon" size={20} />
            <h2>Order Types</h2>
          </div>
          <div className="card-body">
            <div className="checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={handleDeliveryToggle}
                />
                <span className="checkbox-label">Delivery Available</span>
              </label>
            </div>
            <div className="checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={pickupAvailable}
                  onChange={handlePickupToggle}
                />
                <span className="checkbox-label">Pickup Available</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetting;