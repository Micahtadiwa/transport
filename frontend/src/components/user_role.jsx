import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './user_role.css';  // Add this import
import { useParams } from "react-router-dom";
import API from "../api";


const UserRole = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEditUser = (id) => {
  navigate(`/edit-user/${id}`);
};

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await API.get("/auth/userslist");

      setUsers(response.data.users || response.data);
      console.log(response.data.users);

    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);


  return (
    <div className="container">
      <h1>User Role Management</h1>
      <div className="table-wrapper">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.UserID || index}>
                  <td>{user.Username}</td>
                  <td>{user.Email}</td>
                  <td>{user.Role}</td>
                  <td>{user.IsActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button
                      className="btn edit-btn"
                      onClick={() => handleEditUser(user.UserID)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn delete-btn"
                      //onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserRole;