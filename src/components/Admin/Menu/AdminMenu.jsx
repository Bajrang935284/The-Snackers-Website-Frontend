import React, { useState } from "react";
import { useMenu } from "../../Context/MenuContext";
import { useAdmin } from "../../Context/AdminContext";
import "./adminMenu.css"; // Import the CSS file

const AdminMenu = () => {
  const { adminMenuItems, updateAvailability, addMenuItem, loading, error } = useMenu();
  const { admin } = useAdmin();
  
  // State for the new menu item form
  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    category: "",
    isAvailable: true,
    updatedBy: admin?._id
  });
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const handleToggle = async (itemId, newAvailability) => {
    try {
      // Use the original updateAvailability function from context
      await updateAvailability(itemId, newAvailability);
    } catch (err) {
      console.error("Error toggling availability", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      // Use the original addMenuItem function from context
      await addMenuItem({
        ...newItem,
        updatedBy: admin?._id
      });
      
      // Clear the form after a successful addition
      setNewItem({
        title: "",
        price: "",
        category: "",
        isAvailable: true,
        updatedBy: admin?._id,
      });
    } catch (err) {
      setAddError("Failed to add menu item.");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading)
    return <div className="admin-menu__loading">Loading menu items...</div>;
  if (error)
    return <div className="admin-menu__error">{error}</div>;

  return (
    <div className="admin-menu">
      <div className="admin-menu__header">
        <h2 className="admin-menu__title">Menu</h2>
      </div>

      {/* Form to add a new menu item */}
      <div className="admin-menu__form-container">
        <h3 className="admin-menu__form-title">Add New Menu Item</h3>
        <form className="admin-menu__form" onSubmit={handleSubmit}>
          <div className="admin-menu__form-group">
            <label className="admin-menu__label" htmlFor="title">Item Name:</label>
            <input
              type="text"
              id="title"
              name="title"
              className="admin-menu__input"
              value={newItem.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="admin-menu__form-group">
            <label className="admin-menu__label" htmlFor="price">Price (₹):</label>
            <input
              type="number"
              id="price"
              name="price"
              className="admin-menu__input"
              value={newItem.price}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="admin-menu__form-group">
            <label className="admin-menu__label" htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              className="admin-menu__input"
              value={newItem.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="admin-menu__form-group admin-menu__checkbox-group">
            <label className="admin-menu__label admin-menu__checkbox-label" htmlFor="isAvailable">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                className="admin-menu__checkbox"
                checked={newItem.isAvailable}
                onChange={handleInputChange}
              />
              <span className="admin-menu__checkbox-text">Available</span>
            </label>
          </div>
          <button type="submit" className="admin-menu__button-add" disabled={addLoading}>
            {addLoading ? "Adding..." : "Add Item"}
          </button>
          {addError && <div className="admin-menu__form-error">{addError}</div>}
        </form>
      </div>

      {/* Table displaying existing menu items */}
      <div className="admin-menu__table-container">
        <h3 className="admin-menu__table-title">Current Menu Items</h3>
        <table className="admin-menu__table">
          <thead className="admin-menu__thead">
            <tr>
              <th className="admin-menu__th">Item Name</th>
              <th className="admin-menu__th">Price</th>
              <th className="admin-menu__th">Category</th>
              <th className="admin-menu__th">Availability</th>
            </tr>
          </thead>
          <tbody className="admin-menu__tbody">
            {adminMenuItems && adminMenuItems.map((item) => (
              <tr key={item._id} className="admin-menu__tr">
                <td className="admin-menu__td">{item.title}</td>
                <td className="admin-menu__td">₹{item.price}</td>
                <td className="admin-menu__td">{item.category}</td>
                <td className="admin-menu__td admin-menu__availability-cell">
                  <label className="admin-menu__toggle">
                    <input
                      type="checkbox"
                      className="admin-menu__toggle-input"
                      checked={item.isAvailable}
                      onChange={(e) => handleToggle(item._id, e.target.checked)}
                    />
                    <span className="admin-menu__toggle-slider"></span>
                    <span className="admin-menu__toggle-status">
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMenu;

