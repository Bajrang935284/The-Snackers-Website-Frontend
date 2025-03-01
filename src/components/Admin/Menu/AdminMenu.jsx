// AdminMenu.jsx
import React, { useState } from "react";
import { useMenu } from "../../Context/MenuContext";
import { useAdmin } from "../../Context/AdminContext";
import "./adminMenu.css"; // Import the CSS file

const AdminMenu = () => {
  const { adminMenuItems, updateAvailability, addMenuItem, loading, error } = useMenu();
  const {admin} = useAdmin();
  // State for the new menu item form.
  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    isAvailable: true,
    updatedBy: admin._id
  });
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const handleToggle = async (item) => {
    try {
      // Toggle the availability status for the given item.
      await updateAvailability(item._id, !item.isAvailable);
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
      await addMenuItem(newItem);
      // Clear the form after a successful addition.
      setNewItem({
        title: "",
        price: "",
        category: "",
        isAvailable: true,
        updatedBy: "admin",
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
      <h2 className="admin-menu__title">Admin Menu Items</h2>

      {/* Form to add a new menu item */}
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
          <label className="admin-menu__label" htmlFor="price">Price:</label>
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
          <label className="admin-menu__label" htmlFor="category">category:</label>
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
        <div className="admin-menu__form-group">
          <label className="admin-menu__label" htmlFor="isAvailable">Available:</label>
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            className="admin-menu__checkbox"
            checked={newItem.isAvailable}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="admin-menu__button-add" disabled={addLoading}>
          {addLoading ? "Adding..." : "Add Item"}
        </button>
        {addError && <div className="admin-menu__form-error">{addError}</div>}
      </form>

      {/* Table displaying existing menu items */}
      <table className="admin-menu__table">
        <thead className="admin-menu__thead">
          <tr>
            <th className="admin-menu__th">Item Name</th>
            <th className="admin-menu__th">Price</th>
            <th className="admin-menu__th">Availability</th>
            <th className="admin-menu__th">Toggle</th>
          </tr>
        </thead>
        <tbody className="admin-menu__tbody">
          {adminMenuItems.map((item) => (
            <tr key={item._id} className="admin-menu__tr">
              <td className="admin-menu__td">{item.title}</td>
              <td className="admin-menu__td">₹{item.price}</td>
              <td className="admin-menu__td">{item.isAvailable ? "Available" : "Not Available"}</td>
              <td className="admin-menu__td">
                <button
                  className="admin-menu__button"
                  onClick={() => handleToggle(item)}
                >
                  {item.isAvailable ? "Make Unavailable" : "Make Available"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMenu;

