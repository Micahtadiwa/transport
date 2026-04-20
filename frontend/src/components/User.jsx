import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./User.css";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";
import { getUserRole, ROLES } from "../configs/roles.js";

const API_URL = import.meta.env.VITE_API_URL;

const User = () => {
  const { auth } = useAuth();
  const role = getUserRole(auth?.user);

  const [stats, setStats] = useState({
    user: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    declined: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const users = res.data?.users || res.data || [];
        if (Array.isArray(users)) {
          const activeCount = users.filter((u) => u.IsActive === 1 || u.IsActive === true).length;
          const inactiveCount = users.length - activeCount;

          setStats((prev) => ({
            ...prev,
            user: users.length,
            active: activeCount,
            inactive: inactiveCount,
          }));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("Session expired");
        } else {
          console.error(err);
        }
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="user-dashboard">
      <div className="title-section">
        <h1 className="dashboard-title">User Management</h1>
        <p className="dashboard-subtitle">This is the user management section.</p>
      </div>

      <div className="top-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>User Overview</h3>
            <div className="stat-number">{stats.user}</div>
            <span className="stat-label">Total Users</span>
          </div>

          <div className="stat-card">
            <h3>All Users</h3>
            <div className="stat-number">{stats.user}</div>
            <span className="stat-label">Registered</span>
          </div>

          <div className="stat-card active">
            <h3>Active Users</h3>
            <div className="stat-number">{stats.active}</div>
            <span className="stat-label">Currently Active</span>
          </div>

          <div className="stat-card inactive">
            <h3>Inactive Users</h3>
            <div className="stat-number">{stats.inactive}</div>
            <span className="stat-label">Not Active</span>
          </div>

          <div className="stat-card pending">
            <h3>Pending Auth</h3>
            <div className="stat-number">{stats.pending}</div>
            <span className="stat-label">Awaiting Approval</span>
          </div>

          <div className="stat-card declined">
            <h3>Declined Auth</h3>
            <div className="stat-number">{stats.declined}</div>
            <span className="stat-label">Access Denied</span>
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="buttons-grid">
          <Link to="/userdata">
            <button className="action-card btn-users">
              <span className="action-icon">U</span>
              <span className="action-title">Users</span>
              <span className="action-desc">Manage all system users</span>
            </button>
          </Link>

          {role === ROLES.ADMIN && (
            <Link to="/user_role">
              <button className="action-card btn-roles">
                <span className="action-icon">R</span>
                <span className="action-title">Edit User Role</span>
                <span className="action-desc">Modify user permissions</span>
              </button>
            </Link>
          )}

          <button className="action-card btn-chart">
            <span className="action-icon">C</span>
            <span className="action-title">View Chart</span>
            <span className="action-desc">Analytics and reports</span>
          </button>

          <button className="action-card btn-declined">
            <span className="action-icon">X</span>
            <span className="action-title">Declined Users</span>
            <span className="action-desc">Users with declined access</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
