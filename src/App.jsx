import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar/Navbar";
import LoginPage from "./component/login/LoginPage";
import Dashboard from "./component/dashboard/Dashboard";
import Projects from "./component/projects/Projects";
import AllEmployee from "./component/employee/AllEmployee";
import Profile from "./component/profile/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/allEmployee" element={<AllEmployee />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          background: "#f8f9fa",
          marginTop: "auto",
        }}
      >
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} ProgMan. All rights reserved.
        </p>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6c757d" }}>
          Built with ❤️ by ProgMan Developers.
        </p>
      </footer>
    </BrowserRouter>
  );
};

export default App;
