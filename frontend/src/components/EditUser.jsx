import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./editUser.css";

const API_URL = import.meta.env.VITE_API_URL;

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);

  // Fetch user by ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/user/${id}`);
        
        const user = res.data.user || res.data;

        setFormData({
          username: user.Username,
          email: user.Email,
          role: user.Role,
          isActive: user.IsActive === 1 || user.IsActive === true,
        });

      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/auth/update-user/${id}`, formData);
      alert("User updated successfully!");
      

    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-container">
      <h2>Edit User</h2>

      <form className="edit-form" onSubmit={handleSubmit}>

        {/* Username */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        {/* Role Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Upper Admin</option>
          <option value="Manager">Manager</option>
          <option value="Attendant">Attendant</option>
          <option value="Driver">Driver</option>
        </select>

        {/* Status Toggle */}
        <div className="status-toggle">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            {formData.isActive ? "Active" : "Inactive"}
          </label>
        </div>

        {/* Submit */}
        <button type="submit">Update User</button>

      </form>
    </div>
  );
};

export default EditUser;