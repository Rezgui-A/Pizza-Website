import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Accountinfo.css";

function Account() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
  }); // State for user info
  const [orders, setOrders] = useState([]); // State for orders

  // Fetch user info on page load
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(response.data); // Populate user info state
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch user's past orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const response = await axios.get("http://localhost:5000/api/orders/user/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Only fetch purchased orders
        const purchasedOrders = response.data.filter((order) => order.purchased);
        setOrders(purchasedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  // Handle form submission to update user info
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put("http://localhost:5000/api/user/me", userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Account updated successfully!");
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Failed to update account. Please try again.");
    }
  };

  return (
    <div className="account-container">
      {/* Navbar */}
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
          Orders ({orders.length})
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

      {/* Account Info Section */}
      <div className="account-info">
        <h2>Account Info</h2>
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={userInfo.address}
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
            />
          </div>
          <div className="form-group-inline">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={userInfo.city}
              onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
            />
            <label>State</label>
            <select
              value={userInfo.state}
              onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })}
            >
              <option>TUNIS</option>
              <option>ARIANA</option>
              <option>BIZERTE</option>
              <option>KEF</option>
            </select>
          </div>
          <button type="submit" className="update-button">UPDATE</button>
        </form>
      </div>

      {/* Past Orders Section */}
      <div className="past-orders">
  <h2>Past Orders</h2>
  <ul className="orders-list">
    {orders.map((order) => (
      <li key={order._id}>
        <strong>Order #{order._id}</strong>
        <p>Method: {order.method}</p>
        <p>Size: {order.size}</p>
        <p>Crust: {order.crust}</p>
        <p>Toppings: {order.toppings.join(", ") || "None"}</p>
        <p>Quantity: {order.quantity}</p>
        <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
}

export default Account;
