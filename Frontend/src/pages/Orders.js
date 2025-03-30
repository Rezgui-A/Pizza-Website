import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import "../styles/Orders.css";


function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); 
  const navigate = useNavigate();
  const showFavorites = location.state?.showFavorites || false;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to log in to view your orders.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/orders/user/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredOrders = showFavorites
          ? response.data.filter(order => order.favorite)
          : response.data;

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert(error.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

     fetchOrders();
   }, [showFavorites]); 
  

  const handleStartOver = (order) => {
    navigate("/craftpizza", { state: order });
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order.");
    }
  };

  const handleFavorite = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/favorite/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, favorite: !order.favorite } : order
        )
      );
      alert("Order favorite status updated!");
    } catch (error) {
      console.error("Error marking favorite:", error);
      alert("Failed to mark as favorite.");
    }
  };

  const handlePurchaseOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/purchase/${orderId}`, // Backend API endpoint
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order has been purchased successfully!");
      setOrders(orders.filter((order) => order._id !== orderId)); // Remove from current list
    } catch (error) {
      console.error("Error purchasing order:", error);
      alert("Failed to purchase the order.");
    }
  };
  
  


  return (
    <div className="orders-page">
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

      <div className="orders-container">
        <h2>Your Orders</h2>
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order._id} className="order-item">
                <div className="order-header">
                  <img
                    src={require('../assets/delete.png')}
                    alt="Delete"
                    className="delete-icon"
                    onClick={() => handleDeleteOrder(order._id)}
                  />
                  <img
                    src={require('../assets/images.png')}
                    alt="Favorite"
                    className="favorite-icon"
                    onClick={() => handleFavorite(order._id)}
                  />
                </div>
                <p>
                  <strong>Method:</strong> {order.method}
                </p>
                <p>
                  <strong>Size:</strong> {order.size}
                </p>
                <p>
                  <strong>Crust:</strong> {order.crust}
                </p>
                <p>
                  <strong>Toppings:</strong> {order.toppings.join(", ") || "None"}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Price:</strong> ${order.totalPrice.toFixed(2)}
                </p>
                <div className="order-actions">
                  <button
                    className="start-over-button"
                    onClick={() => handleStartOver(order)}
                  >
                    Start Over
                  </button>
                  <button
     className="purchase-button"
     onClick={() => handlePurchaseOrder(order._id)}
  >
     Purchase
    </button>


                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Orders;
