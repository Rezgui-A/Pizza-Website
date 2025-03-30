import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Error state for handling errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Basic password validation (for example: at least 6 characters)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }
      );

      console.log("Login Successful:", response.data);
      localStorage.setItem('token', response.data.token); // Store JWT in localStorage

      // Redirect to the home page after successful login
      navigate("/home"); // Adjust the route as per your app structure
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      // Set specific error message for display
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };
  return (
    <div className="login-container">
      <div className="left-panel">

      </div>
      <div className="right-panel">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn submit">Log In</button>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <a href="/" className="forgot-password">Forgot password?</a>
          </form>
          <div>
            <Link to="/register">
              <p className="create-account">Create Your Account →</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
