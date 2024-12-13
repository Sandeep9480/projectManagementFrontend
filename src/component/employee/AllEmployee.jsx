import axios from "axios";
import React, { useEffect, useState } from "react";
import { clientServer } from "../clientServer";
import "./allemployee.css";
import AOS from "aos";
import "aos/dist/aos.css";

const AllEmployee = () => {
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${clientServer}/get_all_user`);
        setEmployeeData(response.data.allUsers);
      } catch (error) {
        console.log(error);
      }

      AOS.init(); // Initialize AOS
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>All Employees</h2>
      <div className="employee-cards">
        {employeeData.map((employee) => (
          <div
            className="employee-card1"
            key={employee._id}
            data-aos="fade-up" // Add AOS animation
            data-aos-duration="2000" // Set duration for the animation
          >
            <img
              src={employee.img}
              alt={employee.name}
              className="employee-image"
            />
            <div className="employee-info">
              <h3 className="employee-name">{employee.name}</h3>
              <p className="employee-skills">Skills: {employee.skills}</p>
              <p style={{ opacity: "0.6" }}>
                Working in: {employee.projectId && employee.projectId.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEmployee;
