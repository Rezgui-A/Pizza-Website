import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Craftapizza.css";

function CraftPizza() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state || {}; // Retrieve order data from state

  // Track the existing order ID and form inputs
  const [orderId,] = useState(initialData._id || null); 
  const [method, setMethod] = useState(initialData.method || "CarryOut");
  const [size, setSize] = useState(initialData.size || "Large");
  const [crust, setCrust] = useState(initialData.crust || "Thin Crust");
  const [quantity, setQuantity] = useState(initialData.quantity || 1);
  const [toppings, setToppings] = useState(initialData.toppings || []);
  const [loading, setLoading] = useState(false);

  const availableToppings = [
    "Pepperoni",
    "Mushrooms",
    "Onions",
    "Sausage",
    "Bacon",
    "Extra Cheese",
    "Black Olives",
    "Green Peppers",
  ];

  // Calculate the total price
  const calculatePrice = (size, crust, toppings, quantity) => {
    let basePrice = size === "Small" ? 8 : size === "Medium" ? 10 : 12;
    let crustPrice = crust === "Stuffed Crust" ? 2 : 0;
    let toppingsPrice = toppings.length * 1; // $1 per topping
    return (basePrice + crustPrice + toppingsPrice) * quantity;
  };

  // Handle topping selection
  const handleToppingChange = (topping) => {
    setToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  // Handle Add to Order button (dual functionality)
  const handleAddToOrder = async () => {
    const totalPrice = calculatePrice(size, crust, toppings, quantity);
    const orderData = { method, size, crust, toppings, quantity, totalPrice };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You need to be logged in to place an order.");
        setLoading(false);
        return;
      }

      if (orderId) {
        // Update existing order
        const response = await axios.put(
          `http://localhost:5000/api/orders/update/${orderId}`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          alert("Order updated successfully!");
          navigate("/orders"); // Redirect to the orders page
        } else {
          alert("Failed to update order. Please try again.");
        }
      } else {
        // Create a new order
        const response = await axios.post("http://localhost:5000/api/orders/create", orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 201) {
          alert("Order added successfully!");
          setMethod("CarryOut");
          setSize("Large");
          setCrust("Thin Crust");
          setQuantity(1);
          setToppings([]);
        } else {
          alert("Failed to add order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error adding/updating order:", error);
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="craft-pizza-page">
<nav className="navbar">
  {/* Left Section: Logo */}
  <div className="navbar-left">
    <div className="navbar-logo">
      <img src="icon.svg" alt="pizza" width="50" height="60" />
    </div>
  </div>

  {/* Right Section: Links (Home, Orders, Account, LogOut) */}
  <div className="navbar-right">
    <ul className="navbar-links">
      <li>
        <Link to="/home" className="nav-link">Home</Link>
      </li>
      <li>
        <Link to="/orders" className="nav-link">
          Orders 
        </Link>
      </li>
      <li>
        <Link to="/account" className="nav-link">Account</Link>
      </li>
      <li>
        <Link to="/" className="nav-link">LogOut</Link>
      </li>
    </ul>
  </div>
</nav>


      <div className="craft-pizza-container">
        <h2>Craft-A-Pizza</h2>
        <form className="pizza-form">
          <div className="form-group">
            <label>Method:</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="CarryOut">CarryOut</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          <div className="form-group">
            <label>Size:</label>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div className="form-group">
            <label>Crust:</label>
            <select value={crust} onChange={(e) => setCrust(e.target.value)}>
              <option value="Thin Crust">Thin Crust</option>
              <option value="Regular Crust">Regular Crust</option>
              <option value="Stuffed Crust">Stuffed Crust</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Toppings:</label>
            <div className="toppings-container">
              {availableToppings.map((topping) => (
                <div key={topping} className="topping-item">
                  <input
                    type="checkbox"
                    id={topping}
                    checked={toppings.includes(topping)}
                    onChange={() => handleToppingChange(topping)}
                  />
                  <label htmlFor={topping}>{topping}</label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="add-to-order-button"
            onClick={handleAddToOrder}
            disabled={loading}
          >
            {loading ? "Processing..." : "ADD TO ORDER"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CraftPizza;
