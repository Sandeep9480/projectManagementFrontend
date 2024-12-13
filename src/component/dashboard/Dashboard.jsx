import React, { useEffect, useState } from "react";
import { clientServer } from "./../clientServer";
import axios from "axios";
import "./styles.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [techStackAnalysis, setTechStackAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ once: false }); // Initialize AOS with once: false
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${clientServer}/get_all_projects`);
        const allProjects = response.data.allProjects;

        // Analyze tech stack
        const stackCount = {};
        allProjects.forEach((project) => {
          project.techStack.split(",").forEach((tech) => {
            const trimmedTech = tech.trim();
            stackCount[trimmedTech] = (stackCount[trimmedTech] || 0) + 1;
          });
        });

        setProjects(allProjects);
        setTechStackAnalysis(stackCount);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
      }
    };

    fetchProjects();
  }, []);

  const generateColors = (count) =>
    Array.from(
      { length: count },
      () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );

  const techStackChartData = {
    labels: Object.keys(techStackAnalysis),
    datasets: [
      {
        label: "Tech Stack Usage",
        data: Object.values(techStackAnalysis),
        backgroundColor: generateColors(Object.keys(techStackAnalysis).length),
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Remove loading after 7 seconds
    }, 5000); // Simulate loading delay
  }, []);

  return (
    <div className="dashboard-container">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <video autoPlay muted loop width="1600">
            <source src="./1050990925-preview.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="dashboard-projects">
            <h2
              style={{ textAlign: "center" }}
              data-aos="fade-up"
              data-aos-duration="2000"
            >
              Projects
            </h2>
            <div className="projects-list">
              {projects.map((project) => (
                <div
                  className="project-card"
                  key={project._id}
                  data-aos="fade-up"
                  data-aos-duration="2000"
                >
                  <img
                    src={project.img}
                    alt={project.title}
                    className="project-image"
                  />
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-bio">
                      {project.bio.length > 150
                        ? `${project.bio.substring(0, 150)}...`
                        : project.bio}
                    </p>
                    <div className="tech-stack">
                      {project.techStack.split(",").map((tech, index) => (
                        <span className="tech-chip" key={index}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <p className="project-deadline">
                      Deadline: {project.deadline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-analysis">
            <h2 style={{ textAlign: "center" }}>Tech Stack Analysis</h2>
            <div
              className="chart-container"
              data-aos="fade-up"
              data-aos-duration="2000"
            >
              <Doughnut data={techStackChartData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
