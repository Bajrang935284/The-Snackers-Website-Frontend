// import React, { useState, useEffect } from 'react';
// import '../address/deliveryAddress.css';
// import { useAddress } from '../Context/AddressContext';
// import { useUser } from '../Context/UserContext';

// const hostelNames = [
//   'Krishna Hostel', 'Ganga Hostel', 'Narmada Hostel', 
//   'Yamuna Hostel', 'Godavari Hostel', 'Brahmaputra Hostel', 
//   'Kaveri Hostel'
// ];

// const DeliveryAddressSelector = () => {
//   // Retrieve saved address from localStorage (if available)
//   const savedAddress = localStorage.getItem('selectedAddress') || '';
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(savedAddress);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const { setAddress } = useAddress();
 

//   // Update localStorage and context whenever selectedAddress changes
//   useEffect(() => {
//     if (selectedAddress) {
//       localStorage.setItem('selectedAddress', selectedAddress);
//       setAddress(selectedAddress);
//     }
//   }, [selectedAddress, setAddress]);

//   const handleSearchChange = (e) => {
//     const inputValue = e.target.value;
//     setSearchTerm(inputValue);
    
//     if (inputValue.length > 0) {
//       const filteredSuggestions = hostelNames.filter(hostel => 
//         hostel.toLowerCase().startsWith(inputValue.toLowerCase())
//       );
//       setSuggestions(filteredSuggestions);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSelectedAddress(suggestion);
//     setSearchTerm(suggestion);
//     setSuggestions([]);
//     setIsOpen(false);
//     // No need to call setAddress here since it's handled in the useEffect
//   };

//   return (
//     <div 
    
//     className="delivery-address-selector" >
//       <button 
//          onClick={() => setIsOpen(true)}
//         className="delivery-address-trigger"
//       >
//         {selectedAddress || 'Select Delivery Address'}
//       </button>

//       {isOpen && (
//         <div className="delivery-address-overlay">
//           <div className="delivery-address-panel">
//             <div className="delivery-address-header">
//               <h2>Select hostel </h2>
//               <button 
//                 onClick={() => setIsOpen(false)} 
//                 className="delivery-address-close"
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="delivery-address-content">
//               <input 
//                 type="text" 
//                 placeholder="Search hostel"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 className="delivery-address-search"
//               />

//               {suggestions.length > 0 && (
//                 <ul className="delivery-address-suggestions">
//                   {suggestions.map((suggestion) => (
//                     <li 
//                       key={suggestion}
//                       onClick={() => handleSuggestionClick(suggestion)}
//                       className="delivery-address-suggestion-item"
//                     >
//                       {suggestion}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryAddressSelector;
import React, { useState, useEffect } from 'react';
import '../address/deliveryAddress.css';
import { useAddress } from '../Context/AddressContext';

const hostelNames = [
  'MBH-A',
  'Ganga Hostel',
  'Narmada Hostel',
  'Yamuna Hostel',
  'Godavari Hostel',
  'Brahmaputra Hostel',
  'Kaveri Hostel'
];

const DeliveryAddressSelector = ({ isOpen, setIsOpen }) => {
  const savedAddress = localStorage.getItem('selectedAddress') || '';
  const [selectedAddress, setSelectedAddress] = useState(savedAddress);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { setAddress } = useAddress();

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem('selectedAddress', selectedAddress);
      setAddress(selectedAddress);
    }
  }, [selectedAddress, setAddress]);

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue.length > 0) {
      const filteredSuggestions = hostelNames.filter((hostel) =>
        hostel.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedAddress(suggestion);
    setSearchTerm(suggestion);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="delivery-address-selector">
      <div className="delivery-address-trigger">
        {selectedAddress || 'Select Delivery Address'}
      </div>

      {isOpen && (
        <div
          className="delivery-address-overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="delivery-address-panel">
            <div className="delivery-address-header">
              <h2>Select Hostel</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="delivery-address-close"
              >
                &times;
              </button>
            </div>

            <div className="delivery-address-content">
              <input
                type="text"
                placeholder="Search hostel"
                value={searchTerm}
                onChange={handleSearchChange}
                className="delivery-address-search"
              />

              {suggestions.length > 0 && (
                <ul className="delivery-address-suggestions">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="delivery-address-suggestion-item"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressSelector;
