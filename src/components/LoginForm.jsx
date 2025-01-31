import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from "../assets/hospital-img.avif";
import { PiWarningOctagonBold } from "react-icons/pi";
import logo from "../assets/logo.png";

const LoginForm = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      if (response.status === 200) {
        const { user, hospital } = response.data;
        setIsLoggedIn(true);

        // Save login state and hospital ID to localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("hospitalId", hospital._id);

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="left-container">
        <img src={image} alt="loading" />
      </div>
      <div className="right-container">
        <h1 className="web-name">HealthEquip Tracker</h1>
        <img src={logo} alt="image" className="logo" />
        <h2>Login</h2>
        <label className="la">
          {error && (
            <p className="error-message">
              {error} <PiWarningOctagonBold style={{ fontSize: "1rem" }} />
            </p>
          )}
        </label>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </label>
          <label>
            <button type="submit" className="btn">
              Login
            </button>
          </label>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
