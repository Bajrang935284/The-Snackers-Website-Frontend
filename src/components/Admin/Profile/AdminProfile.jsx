
import React from 'react';
import { useAdmin } from '../../Context/AdminContext';
import './adminProfile.css'; 
const AdminProfile = ({ onClose }) => {
  const { admin, logout } = useAdmin();

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!admin) return null; // or you could show a loading state

  return (
    <div className="profile-modal">
      <div className="profile-modal__content">
        <div className="profile-modal__header">
          <h2 className="profile-modal__title">Admin Profile</h2>
          <button
            className="profile-modal__close"
            aria-label="Close profile"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="profile-info">
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
