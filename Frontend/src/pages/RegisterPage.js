import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";
import axios from "axios";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Step 1: Register the user
      await axios.post("http://localhost:5000/api/user/register", {
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        password,
      });

      // Step 2: Log in the user
      const loginResponse = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem("token", loginResponse.data.token);

      setMessage({ text: "User registered and logged in successfully!", type: "success" });

      // Clear form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setAddress("");
      setCity("");
      setState("");
      setPassword("");

      // Redirect to home page
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "An error occurred!",
        type: "error",
      });
    }
  };

  return (
    <div className="register-container">
      {message && <div className={`message ${message.type}`}>{message.text}</div>}



      <div className="form-container">
        <h2>REGISTER</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">CREATE</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
