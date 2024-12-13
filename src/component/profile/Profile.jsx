import React, { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { clientServer } from "../clientServer";
import Aos from "aos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState({
    img: "",
    name: "",
    proffesion: "",
    skills: "",
  });

  useEffect(() => {
    Aos.init({
      once: false,
    });
    Aos.refresh();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${clientServer}/get_about_user`, {
          params: {
            token: localStorage.getItem("token"),
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.post(`${clientServer}/update_user`, {
        token: localStorage.getItem("token"),
        ...formData,
      });
      toast.success("Profile Updated");
      setEditModal(false);
      const response = await axios.get(`${clientServer}/get_about_user`, {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile."); // Error toast
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Profile</h1>
      <div className="profile-card" data-aos="fade-up" data-aos-duration="2000">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          style={{
            position: "relative",
            top: "0",
            right: "-300",
            width: "30px",
          }}
          onClick={() => {
            setEditModal(true),
              setFormData({
                img: user.img,
                name: user.name,
                proffesion: user.bio,
                skills: user.skills,
              });
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        <img src={user.img} alt={user.name} className="profile-image" />
        <div className="profile-details">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="profile-bio">
            <strong>profession :</strong> {user.bio}
          </p>
          <p className="profile-skills">
            <strong>Skills:</strong> {user.skills}
          </p>
          {user.projectId && (
            <div>
              <h1>Working Project</h1>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <img src={user.projectId.img} alt="" />
                <p style={{ textAlign: "start" }}>
                  {user.projectId.bio.length > 150
                    ? `${user.projectId.bio.substring(0, 150)}...`
                    : user.projectId.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {editModal && (
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
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="proffesion">Profession </label>
                <input
                  type="text"
                  id="proffesion"
                  name="proffesion"
                  value={formData.proffesion}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                />
              </div>
              <div className="form-group">
                <label htmlFor="techStack">Skills</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="Enter tech stack"
                />
              </div>

              <div className="button-group form-group">
                <button className="update-button" onClick={handleUpdate}>
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

export default Profile;
