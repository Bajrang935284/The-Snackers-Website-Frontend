
import React, { useState } from "react";
import { useAdmin } from "../../Context/AdminContext";
import { useNavigate } from "react-router-dom";
import "../Header/adminHeader.css";

const AdminHeader = () => {
  const { admin, logout, signIn } = useAdmin();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/admin"); // Redirect to admin login after logout
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setLoginError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await signIn(credentials);
      if (success) {
        setShowLoginModal(false);
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setLoginError("Login failed. Please try again.");
    }
  };

  return (
    <header className="admin-header">
      <div className="admin-header__logo">Snackers</div>
      <div className="admin-header__profile">
        {admin ? (
          <div className="profile-logged-in">
            <span className="profile-name">Profile</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>

      {showLoginModal && (
        <div className="login-modal">
          <div className="login-modal__content">
            <h2>Admin Login</h2>
            {loginError && <p className="error">{loginError}</p>}
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
              <button type="submit">Login</button>
            </form>
            <button className="close-modal" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;



