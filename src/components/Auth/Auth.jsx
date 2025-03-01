// src/components/AuthModal.js
// AuthModal.jsx
// import React, { useState } from 'react';
// import './auth.css';

// const AuthModal = ({ onClose, onSubmit }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(isLogin, formData);
//   };

//   return (
//     <div className="auth-modal-overlay">
//       <div className="auth-modal">
//         <button className="close-btn" onClick={onClose}>×</button>
//         <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
//         <form onSubmit={handleSubmit}>
//           {!isLogin && (
//             <input
//               type="text"
//               placeholder="Name"
//               value={formData.name}
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//             />
//           )}
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({...formData, email: e.target.value})}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => setFormData({...formData, password: e.target.value})}
//           />
//           <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
//         </form>
//         <button onClick={() => setIsLogin(!isLogin)}>
//           {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
//         </button>
//       </div>
//     </div>
//   );
// };
// export default AuthModal;

import React, { useState } from 'react';
import './auth.css';

const AuthModal = ({ onClose, onSubmit }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''

  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous error
    setErrorMessage('');
    
    // Assume onSubmit returns a boolean (or promise resolving to a boolean)
    const success = await onSubmit(isLogin, formData);
    
    // If in login mode and login failed, clear fields and show error message
    if (isLogin && !success) {
      setFormData({ email: '', password: '', name: '' });
      setErrorMessage("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {!isLogin && (
  <input
    type="phone"
    placeholder="Phone number"
    value={formData.phone}
    onChange={(e) =>
      setFormData({ ...formData, phone: e.target.value })
    }
  />
)}
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
        </form>
        {/* Display error message if exists */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={() => {
          setIsLogin(!isLogin);
          setErrorMessage(''); // clear any error when switching modes
        }}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
