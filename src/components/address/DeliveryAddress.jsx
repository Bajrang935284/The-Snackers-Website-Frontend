
import React, { useState, useEffect } from 'react';
import '../address/deliveryAddress.css';
import { useAddress } from '../Context/AddressContext';

const hostelNames = [
  'MBH-A',
  'MBH-B',
  'MBH-F',
  'BH-1',
  'BH-2',
  'BH-3',
  'BH-4',
  'BH-5',
  'BH-6',
  'BH-7',
  'BH-7E',
  'GH-1',
  'GH-2',
   'MGH'
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
