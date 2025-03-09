import React, { useState, useEffect } from 'react';
import { useCanteen } from '../../Context/CanteenSettingsContext';
import './adminSetting.css';

const AdminSetting = () => {
  const { settings, updateSettings,isCanteenOpen } = useCanteen();
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [message, setMessage] = useState('');
  const [canteenStatus, setCanteenStatus] = useState(false);
  // When settings load, prefill the inputs
  useEffect(() => {
    if (settings) {
      setOpenTime(settings.openTime);
      setCloseTime(settings.closeTime);

      setCanteenStatus(isCanteenOpen());
    }
   
  }, [settings,isCanteenOpen]);

  const handleUpdate = async () => {
    try {
      const res = await updateSettings({ openTime, closeTime });
      setMessage(res.message || 'Settings updated successfully');
    } catch (error) {
      setMessage('Failed to update settings');
    }
  };

  return (
    <div className="admin-settings-container">
      <h2>Canteen Settings</h2>
      <div className="admin-settings-form">
        <label>
          Open Time (HH:MM):
          <input
            type="text"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
          />
        </label>
        <label>
          Close Time (HH:MM):
          <input
            type="text"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
          />
        </label>
        <button onClick={handleUpdate}>Update Settings</button>
      </div>
      {message && <p className="admin-settings-message">{message}</p>}
    </div>
  );
};

export default AdminSetting;


