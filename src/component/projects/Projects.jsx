import axios from "axios";
import React, { useEffect, useState } from "react";
import { clientServer, adminId } from "../clientServer";
import "./project.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState([]);
  const [addEmployeeModal, setAddEmployeeModal] = useState(false);
  const [allEmployeeData, setAllEmployeeData] = useState([]);
  const [workingEmployeeModal, setWorkingEmployeeModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [updateForm, setUpdateForm] = useState({
    img: "",
    title: "",
    bio: "",
    techStack: "",
    deadline: "",
  });
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [formData, setformData] = useState({
    img: "",
    title: "",
    bio: "",
    techStack: "",
    deadline: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS
    const fetchData = async () => {
      try {
        const response = await axios.get(`${clientServer}/get_about_user`, {
          params: { token: localStorage.getItem("token") },
        });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${clientServer}/get_all_projects`);
        setProjects(response.data.allProjects);
      } catch (error) {
        console.log("Something Went Wrong", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const getAllEmployee = async () => {
      try {
        const response = await axios.get(`${clientServer}/get_all_user`);
        setAllEmployeeData(response.data.allUsers);
      } catch (error) {
        console.log("Something Went Wrong", error);
      }
    };
    getAllEmployee();
  }, []);

  const allote = async (id) => {
    try {
      await axios.post(`${clientServer}/add_to_user_project`, {
        id: id,
        project_id: projectId,
      });
      const response = await axios.get(`${clientServer}/get_all_user`);
      setAllEmployeeData(response.data.allUsers);
      Toastify({
        text: "Employee allocated successfully",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();
    } catch (error) {
      console.log(error);
      Toastify({
        text: "Failed to allocate employee",
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    }
  };

  const remove = async (id) => {
    try {
      await axios.post(`${clientServer}/delete_from_user_project`, { id: id });
      const response = await axios.get(`${clientServer}/get_all_user`);
      setAllEmployeeData(response.data.allUsers);
      Toastify({
        text: "Employee removed successfully",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();
    } catch (error) {
      console.log(error);
      Toastify({
        text: "Failed to remove employee",
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prevForm) => ({ ...prevForm, [name]: value }));
    setformData((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.post(`${clientServer}/update_project`, {
        project_id: projectId,
        ...updateForm,
      });
      setUpdateModal(false);
      const response = await axios.get(`${clientServer}/get_all_projects`);
      setProjects(response.data.allProjects);
      Toastify({
        text: "Project updated successfully",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();
    } catch (error) {
      console.log(error);
      Toastify({
        text: "Failed to update project",
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.post(`${clientServer}/delete_project`, {
        project_id: projectId,
      });
      const response = await axios.get(`${clientServer}/get_all_projects`);
      setProjects(response.data.allProjects);
      Toastify({
        text: "Project deleted successfully",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();
    } catch (error) {
      console.log(error);
      Toastify({
        text: "Failed to delete project",
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    }
  };

  const addProject = async () => {
    try {
      await axios.post(`${clientServer}/create_project`, formData);
      const response = await axios.get(`${clientServer}/get_all_projects`);
      setProjects(response.data.allProjects);
      setAddProjectModal(false);
      Toastify({
        text: "Project added successfully",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();
    } catch (error) {
      console.log(error);
      Toastify({
        text: "Failed to add project",
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    }
  };

  return (
    <div>
      <div className="dashboard-projects">
        <h2 style={{ textAlign: "center" }} data-aos="fade-up">
          Available Projects
        </h2>
        {adminId === user._id && (
          <button
            className="createProjectBtn"
            onClick={() => setAddProjectModal(true)}
            data-aos="fade-up"
          >
            Create Project
          </button>
        )}
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
                <p className="project-deadline">Deadline: {project.deadline}</p>
              </div>
              {adminId == user._id && (
                <div className="btns">
                  <button
                    onClick={() => {
                      setAddEmployeeModal(true), setProjectId(project._id);
                    }}
                  >
                    Add Employee
                  </button>
                  <button
                    onClick={() => {
                      setWorkingEmployeeModal(true), setProjectId(project._id);
                    }}
                  >
                    Working Employee
                  </button>
                  <button
                    onClick={() => {
                      setUpdateModal(true),
                        setUpdateForm({
                          img: project.img || "",
                          title: project.title || "",
                          bio: project.bio || "",
                          techStack: project.techStack || "",
                          deadline: project.deadline || "",
                        });
                      setProjectId(project._id);
                    }}
                  >
                    Update
                  </button>
                  <button
                    style={{ background: "red" }}
                    onClick={() => {
                      deleteProject(project._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Employee Modal */}
      {addEmployeeModal && (
        <div className="addEmployeeModal">
          <h1>All Available Employees</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            style={{
              width: "30px",
              position: "absolute",
              right: "0",
              top: "0",
              margin: "20px",
              color: "red",
            }}
            onClick={() => {
              setAddEmployeeModal(false), setProjectId("");
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>

          <div className="employee-cards">
            {allEmployeeData.map(
              (employee) =>
                !employee.alloted && (
                  <div className="employee-card" key={employee._id}>
                    <img
                      src={employee.img}
                      alt={employee.name}
                      className="employee-image"
                    />
                    <div className="employee-info">
                      <h3 className="employee-name">{employee.name}</h3>
                      <p className="employee-skills">
                        Skills: {employee.skills}
                      </p>
                      <button
                        className="allote"
                        onClick={() => allote(employee._id)}
                      >
                        Allote
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {workingEmployeeModal && (
        <div className="workingEmployeeModal">
          <h1>Working Employee</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            style={{
              width: "30px",
              position: "absolute",
              right: "0",
              top: "0",
              margin: "20px",
              color: "red",
            }}
            onClick={() => {
              setWorkingEmployeeModal(false), setProjectId("");
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
          <div className="employee-cards">
            {allEmployeeData.map(
              (employee) =>
                employee.projectId &&
                employee.projectId._id === projectId && (
                  <div className="employee-card" key={employee._id}>
                    <img
                      src={employee.img}
                      alt={employee.name}
                      className="employee-image"
                    />
                    <div className="employee-info">
                      <h3 className="employee-name">{employee.name}</h3>
                      <p className="employee-skills">
                        Skills: {employee.skills}
                      </p>
                      <button
                        className="remove"
                        onClick={() => remove(employee._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {updateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h1 className="modal-title">Update Project</h1>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="img">Image URL</label>
                <input
                  type="text"
                  id="img"
                  name="img"
                  value={updateForm.img}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={updateForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={updateForm.bio}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                />
              </div>
              <div className="form-group">
                <label htmlFor="techStack">Tech Stack</label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={updateForm.techStack}
                  onChange={handleInputChange}
                  placeholder="Enter tech stack"
                />
              </div>
              <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="text"
                  id="deadline"
                  name="deadline"
                  value={updateForm.deadline}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group form-group">
                <button className="update-button" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {addProjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h1 className="modal-title">Update Project</h1>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="img">Image URL</label>
                <input
                  type="text"
                  id="img"
                  name="img"
                  value={formData.img}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                />
              </div>
              <div className="form-group">
                <label htmlFor="techStack">Tech Stack</label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="Enter tech stack"
                />
              </div>
              <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="text"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group form-group">
                <button className="update-button" onClick={addProject}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
