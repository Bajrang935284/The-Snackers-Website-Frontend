import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { Plus, Minus, Heading3 } from 'lucide-react';
import { useAddress } from '../Context/AddressContext';
import { useNavigate } from 'react-router-dom';
import './checkout.css';
import { useUser } from '../Context/UserContext';

const Checkout = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, } = useCart();
  
  const { address } = useAddress();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('delivery');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { orderType, totalPrice } });
  };

  return (
    <div className="checkout-container">
      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <h1 className="empty-cart-heading">Your Cart is Empty</h1>
          <p className="empty-cart-subheading">Looks like you haven't added anything to your cart yet</p>
          <button 
            className="return-home-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-content">
          {/* Left Side - Order Type, Address & Payment */}
          <div className="left-section">
            {/* Order Type Selection */}
            <div className="checkout-card">
              <h3 className="section-heading">Order Type</h3>
              <div className="order-type-toggle">
                <button
                  className={`toggle-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  Delivery
                </button>
                <button
                  className={`toggle-btn ${orderType === 'pickup' ? 'active' : ''}`}
                  onClick={() => setOrderType('pickup')}
                >
                  Pickup
                </button>
              </div>
            </div>

            {/* Address/Pickup Information */}
            {orderType === 'delivery' ? (
              <div className="checkout-card">
                <h4 className="section-heading">{selectedAddress ? (<h4> Delivery Address</h4>) : (<h4> Select Delivery Address</h4>)  }</h4>
                <div className="address-section">
                  {address ? (
                    <div className="saved-address">
                      <div className="address-details">
                        <h3>Saved Address</h3>
                        <p>{address}</p>
                      </div>
                      <button 
                        className="deliver-here-btn"
                        onClick={() => setSelectedAddress(address)}
                      >
                        Deliver Here
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="add-address-btn"
                      onClick={() => setShowAddAddress(true)}
                    >
                      Add New Address
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="checkout-card">
                <h2 className="section-heading">Pickup Information</h2>
                <p className="pickup-message">
                  Your order will be prepared at the canteen. We'll notify you when it's ready for pickup.
                </p>
              </div>
            )}

            {/* Payment Card */}
            <div className="checkout-card payment-section">
              <h3 className="section-heading">Payment</h3>
              <button 
                className={`proceed-pay-btn ${orderType === 'delivery' && !selectedAddress ? 'disabled' : ''}`}
                onClick={handleProceedToPayment}
                disabled={orderType === 'delivery' && !selectedAddress}
              >
                Proceed to Pay ₹{totalPrice.toFixed(2)}
              </button>
            </div>
          </div>

          {/* Right Side - Cart Items */}
          <div className="right-section">
            <div className="cart-card">
              <h2 className="cart-heading">Your Order ({cartItems.length})</h2>
              <div className="cart-items-list">
                {cartItems.map((cartItem) => (
                  <div key={cartItem._id} className="cart-item">
                    <div className="item-info">
                      <h3 className="item-title">{cartItem.title}</h3>
                      <p className="item-price">₹{(cartItem.price * cartItem.quantity).toFixed(2)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => decreaseQuantity(cartItem._id)} 
                        className="quantity-btn"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="quantity">{cartItem.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(cartItem._id)} 
                        className="quantity-btn"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total Amount:</span>
                <span className="total-price">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
    
  );
};

export default Checkout;

// import React, { useState, useEffect } from 'react';
// import { useCart } from '../Context/CartContext';
// import { Plus, Minus } from 'lucide-react';
// import { useAddress } from '../Context/DeliveryContext';
// import { useNavigate } from 'react-router-dom';
// import './checkout.css';
// import { useUser } from '../Context/UserContext';

// const LoginPopup = ({ onLogin, error, isLoading }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onLogin({ email, password });
//   };

//   return (
//     <div className="login-popup-overlay">
//       <div className="login-popup">
//         <h2>Please Login to Access Cart</h2>
//         <p>You need to be logged in to proceed with your order</p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button type="submit" disabled={isLoading}>
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div className="popup-footer">
//           <p>Don't have an account?{' '}
//             <button 
//               className="link-button"
//               onClick={() => navigate('/signup')}
//             >
//               Sign Up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Checkout = () => {
//   const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
//   const { address } = useAddress();
//   const navigate = useNavigate();
//   const { user, signIn, isLoading: isUserLoading, error: userError } = useUser();
  
//   const [orderType, setOrderType] = useState('delivery');
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showAddAddress, setShowAddAddress] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [loginError, setLoginError] = useState(null);

//   const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//   useEffect(() => {
//     if (!user && cartItems.length > 0) {
//       setShowLoginPopup(true);
//     }
//   }, [user, cartItems]);

//   const handleLogin = async (credentials) => {
//     try {
//       const success = await signIn(credentials);
//       if (success) {
//         setShowLoginPopup(false);
//         setLoginError(null);
//       }
//     } catch (error) {
//       setLoginError(error.message);
//     }
//   };

//   const handleProceedToPayment = () => {
//     navigate('/payment', { state: { orderType, totalPrice } });
//   };

//   return (
//     <div className="checkout-container">
//       {cartItems.length === 0 ? (
//         <div className="empty-cart-container">
//           <h1 className="empty-cart-heading">Your Cart is Empty</h1>
//           <p className="empty-cart-subheading">Looks like you haven't added anything to your cart yet</p>
//           <button 
//             className="return-home-btn"
//             onClick={() => navigate('/')}
//           >
//             Continue Shopping
//           </button>
//         </div>
//       ) : (
//         <div className="checkout-content">
//           {/* Left Side - Order Type, Address & Payment */}
//           <div className="left-section">
//             {/* Order Type Selection */}
//             <div className="checkout-card">
//               <h2 className="section-heading">Order Type</h2>
//               <div className="order-type-toggle">
//                 <button
//                   className={`toggle-btn ${orderType === 'delivery' ? 'active' : ''}`}
//                   onClick={() => setOrderType('delivery')}
//                 >
//                   Delivery
//                 </button>
//                 <button
//                   className={`toggle-btn ${orderType === 'pickup' ? 'active' : ''}`}
//                   onClick={() => setOrderType('pickup')}
//                 >
//                   Pickup
//                 </button>
//               </div>
//             </div>

//             {/* Address/Pickup Information */}
//             {orderType === 'delivery' ? (
//               <div className="checkout-card">
//                 <h2 className="section-heading">Delivery Address</h2>
//                 <div className="address-section">
//                   {address ? (
//                     <div className="saved-address">
//                       <div className="address-details">
//                         <h3>Saved Address</h3>
//                         <p>{address}</p>
//                       </div>
//                       <button 
//                         className="deliver-here-btn"
//                         onClick={() => setSelectedAddress(address)}
//                       >
//                         Deliver Here
//                       </button>
//                     </div>
//                   ) : (
//                     <button 
//                       className="add-address-btn"
//                       onClick={() => setShowAddAddress(true)}
//                     >
//                       Add New Address
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="checkout-card">
//                 <h2 className="section-heading">Pickup Information</h2>
//                 <p className="pickup-message">
//                   Your order will be prepared at the canteen. We'll notify you when it's ready for pickup.
//                 </p>
//               </div>
//             )}

//             {/* Payment Card */}
//             <div className="checkout-card payment-section">
//               <h2 className="section-heading">Payment</h2>
//               <button 
//                 className={`proceed-pay-btn ${orderType === 'delivery' && !selectedAddress ? 'disabled' : ''}`}
//                 onClick={handleProceedToPayment}
//                 disabled={orderType === 'delivery' && !selectedAddress}
//               >
//                 Proceed to Pay ₹{totalPrice.toFixed(2)}
//               </button>
//             </div>
//           </div>

//           {/* Right Side - Cart Items */}
//           <div className="right-section">
//             <div className="cart-card">
//               <h2 className="cart-heading">Your Order ({cartItems.length})</h2>
//               <div className="cart-items-list">
//                 {cartItems.map((cartItem) => (
//                   <div key={cartItem._id} className="cart-item">
//                     <div className="item-info">
//                       <h3 className="item-title">{cartItem.title}</h3>
//                       <p className="item-price">₹{(cartItem.price * cartItem.quantity).toFixed(2)}</p>
//                     </div>
//                     <div className="quantity-controls">
//                       <button 
//                         onClick={() => decreaseQuantity(cartItem._id)} 
//                         className="quantity-btn"
//                       >
//                         <Minus size={18} />
//                       </button>
//                       <span className="quantity">{cartItem.quantity}</span>
//                       <button 
//                         onClick={() => increaseQuantity(cartItem._id)} 
//                         className="quantity-btn"
//                       >
//                         <Plus size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="cart-total">
//                 <span>Total Amount:</span>
//                 <span className="total-price">₹{totalPrice.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showLoginPopup && (
//         <LoginPopup
//           onLogin={handleLogin}
//           error={loginError || userError}
//           isLoading={isUserLoading}
//         />
//       )}
//     </div>
//   );
// };

// export default Checkout;

// import React, { useState, useEffect } from 'react';
// import { useCart } from '../Context/CartContext';
// import { Plus, Minus } from 'lucide-react';
// import { useAddress } from '../Context/DeliveryContext';
// import { useNavigate } from 'react-router-dom';
// import './checkout.css';
// import { useUser } from '../Context/UserContext';

// const Checkout = () => {
//   const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
//   const { address } = useAddress();
//   const navigate = useNavigate();
//   const { user, signIn, isLoading: isUserLoading, error: userError } = useUser();
  
//   const [orderType, setOrderType] = useState('delivery');
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showAddAddress, setShowAddAddress] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [loginError, setLoginError] = useState(null);
//   const [loginCredentials, setLoginCredentials] = useState({
//     email: '',
//     password: ''
//   });

//   const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//   useEffect(() => {
//     if (!user && cartItems.length > 0) {
//       setShowLoginPopup(true);
//     }
//   }, [user, cartItems]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const success = await signIn(loginCredentials);
//       if (success) {
//         setShowLoginPopup(false);
//         setLoginError(null);
//       }
//     } catch (error) {
//       setLoginError(error.message);
//     }
//   };

//   const handleProceedToPayment = () => {
//     navigate('/payment', { state: { orderType, totalPrice } });
//   };

//   const handleClosePopup = (e) => {
//     if (e.target === e.currentTarget || e.target.classList.contains('close-popup-btn')) {
//       setShowLoginPopup(false);
//     }
//   };

//   return (
//     <div className="checkout-container">
//       {/* Login Popup */}
//       {showLoginPopup && (
//         <div className="login-popup-overlay" onClick={handleClosePopup}>
//           <div className="login-popup">
//             <button 
//               className="close-popup-btn"
//               onClick={() => setShowLoginPopup(false)}
//               aria-label="Close login popup"
//             >
//               &times;
//             </button>
            
//             <h2>Please Login to Access Cart</h2>
//             <p>You need to be logged in to proceed with your order</p>
            
//             <form onSubmit={handleLogin}>
//               <div className="form-group">
//                 <label>Email:</label>
//                 <input
//                   type="email"
//                   value={loginCredentials.email}
//                   onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Password:</label>
//                 <input
//                   type="password"
//                   value={loginCredentials.password}
//                   onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
//                   required
//                 />
//               </div>

//               {(loginError || userError) && <div className="error-message">{loginError || userError}</div>}

//               <button type="submit" disabled={isUserLoading}>
//                 {isUserLoading ? 'Logging in...' : 'Login'}
//               </button>
//             </form>

//             <div className="popup-footer">
//               <p>Don't have an account?{' '}
//                 <button 
//                   className="link-button"
//                   onClick={() => navigate('/signup')}
//                 >
//                   Sign Up
//                 </button>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Rest of Checkout Component */}
//       {cartItems.length === 0 ? (
//         <div className="empty-cart-container">
//           <h1 className="empty-cart-heading">Your Cart is Empty</h1>
//           <p className="empty-cart-subheading">Looks like you haven't added anything to your cart yet</p>
//           <button 
//             className="return-home-btn"
//             onClick={() => navigate('/')}
//           >
//             Continue Shopping
//           </button>
//         </div>
//       ) : (
//         <div className="checkout-content">
//           {/* Left Side - Order Type, Address & Payment */}
//           <div className="left-section">
//             {/* ... (keep existing checkout content the same) ... */}
//           </div>

//           {/* Right Side - Cart Items */}
//           <div className="right-section">
//             {/* ... (keep existing cart items section the same) ... */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Checkout;