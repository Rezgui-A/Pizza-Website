import React, { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "../styles/Home.css";

function Home() {
   
  const [orders, setOrders] = useState([]); // Add this line

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/orders/user/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const navigate = useNavigate();
  const handleSurpriseMe = () => {
    const randomMethod = Math.random() > 0.5 ? "CarryOut" : "Delivery";
    const randomSize = ["Small", "Medium", "Large"][
      Math.floor(Math.random() * 3)
    ];
    const randomCrust = ["Thin Crust", "Regular Crust", "Stuffed Crust"][
      Math.floor(Math.random() * 3)
    ];
    const randomQuantity = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5
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
    const randomToppings = availableToppings.filter(() =>
      Math.random() > 0.5
    );

    // Navigate to CraftPizza and pass random values
    navigate("/craftpizza", {
      state: {
        method: randomMethod,
        size: randomSize,
        crust: randomCrust,
        quantity: randomQuantity,
        toppings: randomToppings,
      },
    });
  };


  return (
    <div className="home-container">
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

<div className="home-img">
<img src = "img.jpg" alt= "img "  ></img>

</div>
 
      {/* Main Content */}
      <h2 className="quick-options-title">QUICK OPTIONS</h2>  
      <br></br>
    
      <div className="cards-container">
        {/* Card 1 */}
        <div className="card">
  <div className="card-image">
    <img src="card1.jpg" alt="Card Background" className="card-background" />
    <button
      className="card-button"
      onClick={() => navigate("/craftpizza")} // Navigate on button click
    >
      Get a new Order
    </button>
  </div>
  <p className="card-text">Go to a new order page to build a pizza from scratch</p>
</div>


        {/* Card 2 */}
        <div className="card">
  <div className="card-image">
    <img src="card2.jpg" alt="Card Background" className="card-background" />
    <button 
      className="card-button" 
      onClick={() => navigate("/orders", { state: { showFavorites: true } })}>
      RE-ORDER MY FAVE
      </button>
  </div>
  <p className="card-text">          Let the user save their favorite pizza to their account.
  </p>
</div>



        {/* Card 3 */}


        <div className="card">
  <div className="card-image">
    <img src="card3.jpg" alt="Card Background" className="card-background" />
    <button className="card-button" onClick={handleSurpriseMe}>SURPRISE ME</button>

  </div>
  <p className="card-text">                Build a random pizza.
  </p>
</div>
      </div>
    </div>
  );
}

export default Home;