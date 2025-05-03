import React from 'react';
import { useAdmin } from '../../Context/AdminContext';
import './adminProfile.css';

const Adminprofile = ({ onClose }) => {
  const { admin } = useAdmin();

  return (
    <div className="profile-modal">
      <div className="profile-modal__content">
        <div className="profile-modal__header">
          <h3 className="profile-modal__title">Admin Profile</h3>
          <button className="profile-modal__close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="profile-info">
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Adminprofile;


