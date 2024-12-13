import React, { useEffect, useState } from "react";
import { clientServer } from "./../clientServer";
import axios from "axios";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${clientServer}/get_about_user`, {
          params: {
            token: localStorage.getItem("token"),
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);
  const logout = () => {
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" style={{ textDecoration: "none" }}>
          <a href="/dashboard">
            {" "}
            <h1>
              <span style={{ color: "blue" }}>Prog</span>
              Man
            </h1>
          </a>
        </div>
        <ul className="navbar-menu" style={{ marginLeft: "40px" }}>
          <li>
            <a href="/projects">Projects</a>
          </li>
          <li>
            <a href="allEmployee">Employee</a>
          </li>
        </ul>
        <div className="navbar-user">
          {userData.name && (
            <p>
              Welcome{" "}
              <span style={{ color: "blue", fontWeight: "700" }}>
                {userData.name}
              </span>
            </p>
          )}
          {userData.img ? (
            <a href="/profile">
              <img
                src={userData.img}
                alt={userData.name || "User"}
                className="navbar-user-image"
              />
            </a>
          ) : (
            <div className="navbar-user-icon">U</div>
          )}
          <p
            onClick={logout}
            style={{ marginLeft: "20px", fontWeight: "700", cursor: "pointer" }}
          >
            Logout
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
