

import React, { useState,useEffect, useCallback } from 'react';
import { ImageOff, SearchIcon, Plus, Minus } from 'lucide-react';
import CrossIcon from '../CrossIcon';
import "../Search/search.css";
import axios from 'axios';
import { useMenu } from '../Context/MenuContext';
import { useCart } from '../Context/CartContext';

const ENV = {
    development: 'http://localhost:3000',
    production: 'https://your-production-domain.com'
  };


const Search = () => {

  const{ userMenuItems, loading, error } = useMenu();
  const { addToCart, increaseQuantity, decreaseQuantity,isInCart,getItemQuantity } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);


  useEffect(() => {
   
    if (userMenuItems.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryFromUrl = urlParams.get('query');
      
      if (queryFromUrl) {
        const matchedItem = userMenuItems.find(item => 
          item.title.toLowerCase() === queryFromUrl.toLowerCase()
        );
        
        if (matchedItem) {
          setSelectedItem(matchedItem);
          setSearchQuery(matchedItem.title);
        }
      }
    }
  }, [userMenuItems]);
  
  const BASE_URL = process.env.NODE_ENV === 'production' 
    ? ENV.production 
    : ENV.development;



    
  useEffect(() => {
    const savedRecentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedRecentSearches);
  }, []);

  // Autocomplete handler
  const handleAutoComplete = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/menu/searchedItem`, {
        params: { query }
      });
      console.log(response.data.results);
      setSuggestions(response.data.results);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
    }
  }, [BASE_URL]);
  
      

  // Input change handler
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // handleAutoComplete(query);
    setSelectedItem(null);
    if (query === '') {
      setSelectedItem(null);
      // Remove query from URL
      window.history.pushState({}, '', window.location.pathname);
    } else {
      handleAutoComplete(query);
    }
    
  };
  

  // Suggestion click handler
  const handleSuggestionClick = (suggestion) => {
    // Update URL without page reload
    window.history.pushState(
      {}, 
      '', 
      `/search?query=${encodeURIComponent(suggestion.title)}`
    );


     // Update recent searches
     const updatedRecentSearches = [
      suggestion,
      ...recentSearches.filter(search => search !== suggestion)
    ].slice(0, 5); 
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));

    // Set selected item
    setSelectedItem(suggestion);
    setSearchQuery(suggestion.title)

    
    // Clear suggestions
    setSuggestions([]);
  };

  const handleRecentClick = (recentSearch) => {
    setSearchQuery(recentSearch.title)
    setSelectedItem(recentSearch);
  }

  const handleCrossClick = () => {
    setSelectedItem('');
    setSearchQuery('')
  }

  // Add to cart handler
  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-bar">
          <div className="search-input">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search food items"
            />
            
            
          </div>
          <div className="search-icon" onClick={handleCrossClick} >
            { searchQuery === '' ? <SearchIcon/> : <CrossIcon/>}
          </div>
        </div>
        
        </div>

        <div>

          { !searchQuery && (
            <div className='recent-search'>
              <h3> Recent Searches</h3>
                
                  {recentSearches.length >0 && (
                    <div className='recentSearches' > 
                    {recentSearches.map((recentSearch,index) => (
                      <div key={`${recentSearch._id}-${index}`} 
                      className="recentSearch-item"
                      onClick={() => handleRecentClick(recentSearch)}>
                        {recentSearch.title}
                      </div>
                    )
                    )}
                    </div>
                  )}
                
            </div>
          )}
        {suggestions.length > 0 && !selectedItem && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion,index) => (
                  <div 
                    key={`${suggestion._id}-${index}`} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.title} 
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Selected Item Details */}
        {selectedItem && (
  <div className="selected-item-details">
    <div className="item-info">
      <div className="text-content">
        <h2>{selectedItem.title}</h2>
        <p className="description">{selectedItem.description}</p>
        <div className="price-section">
          <span className="price">₹{selectedItem.price}</span>
        </div>
      </div>
    </div>

    {/* Action Controls positioned at the bottom right */}
    <div className="action-controls">
      {!isInCart(selectedItem._id) ? (
        <button 
          className="add-to-cart-btn"
          onClick={() => handleAddToCart(selectedItem)}
        >
          Add
        </button>
      ) : (
        <div className="quantity-controls">
          <button
            onClick={() => decreaseQuantity(selectedItem._id)}
            className="quantity-btn"
          >
            <Minus size={18} />
          </button>
          <span className="quantity">
            {getItemQuantity(selectedItem._id)}
          </span>
          <button
            onClick={() => increaseQuantity(selectedItem._id)}
            className="quantity-btn"
          >
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  </div>
)}


      
    </div>
  );
};

export default Search;
