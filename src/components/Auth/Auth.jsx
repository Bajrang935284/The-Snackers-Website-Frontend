import React, { useState } from 'react';
import './auth.css';

const AuthModal = ({ onClose, onSubmit, onForgotPassword }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (isForgotPassword) {
      try {
        // Call the forgot password function passed from parent
        await onForgotPassword(formData.email);
        setSuccessMessage("Password reset link sent to your email!");
      } catch (error) {
        setErrorMessage(error.message || "Failed to send reset link. Please try again.");
      }
    } else {
      // Existing login/signup functionality
      const success = await onSubmit(isLogin, formData);
      
      // If in login mode and login failed, clear fields and show error message
      if (isLogin && !success) {
        setFormData({ ...formData, password: '' });
        setErrorMessage("Invalid credentials, please try again.");
      }
    }
  };

  const switchToForgotPassword = () => {
    setIsForgotPassword(true);
    setIsLogin(true);
    setErrorMessage('');
    setSuccessMessage('');
    setFormData({ ...formData, password: '' });
  };

  const switchToLogin = () => {
    setIsForgotPassword(false);
    setIsLogin(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        {isForgotPassword ? (
          // Forgot Password View
          <>
            <h2>Reset Password</h2>
            <p className="instruction-text">
          

            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <button type="submit">Send Reset Link</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="text-button" onClick={switchToLogin}>
              Back to Sign In
            </button>
          </>
        ) : (
          // Login/Signup View
          <>
            <h2>The Snackers</h2>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required={!isLogin}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              {!isLogin && (
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required={!isLogin}
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button type="submit">{isLogin ? 'Log in' : 'Sign Up'}</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {isLogin && (
              <button className="text-button forgot-password" onClick={switchToForgotPassword}>
                Forgot Password?
              </button>
            )}
            <button className="switch-mode-button" onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(''); // clear any error when switching modes
            }}>
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;