import React from 'react';
import { useMenu } from '../Context/MenuContext';
import { useCart } from '../Context/CartContext';
import "../Menu/menu.css";

const Menu = () => {
  const { userMenuItems, loading, error } = useMenu();
  const { addToCart, increaseQuantity, decreaseQuantity, isInCart, getItemQuantity } = useCart();

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error loading menu: {error}</p>;

  // Group items by category
  const groupedItems = userMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-container">
      <h2>Menu</h2>
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <div className="menu-grid">
            {items.map(item => (
              <div key={item._id} className="menu-item">
                <h4>{item.title}</h4>
                <p className="item-price">₹{item.price}</p>
                <div className="cart-wrapper">
  {isInCart(item._id) ? (
    <div className="cart-controls">
      <button className="decrease-btn" onClick={() => decreaseQuantity(item._id)}>-</button>
      <span className="item-quantity">{getItemQuantity(item._id)}</span>
      <button className="increase-btn" onClick={() => increaseQuantity(item._id)}>+</button>
    </div>
  ) : (
    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
      Add
    </button>
  )}
</div>



              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;

