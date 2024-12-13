import React, { useState } from "react";
import axios from "axios";
import "./styles.css";
import { clientServer } from "./../clientServer";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(true); // Toggle between Register and Login
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const { name, email, password } = formData;
    try {
      await axios.post(`${clientServer}/register`, { name, email, password });
      toast.success("Registration Successful!");
      setIsRegister(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    try {
      const response = await axios.post(`${clientServer}/login`, {
        email,
        password,
      });
      toast.success("Loggedin  Successful");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
      toast.success("Login Successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isRegister ? handleRegister() : handleLogin();
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <h1>{isRegister ? "Create an Account" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="toggle-btn"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
