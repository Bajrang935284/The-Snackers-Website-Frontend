import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import './editProfile.css';


const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const EditProfile = () => {
  const { user, logout } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, email })
      });
      if (!response.ok) throw new Error('Failed to update profile');
      await response.json();
      setSuccess('Profile updated successfully');
      // Optionally update context if useUser provides a method
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate('/profile')} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
