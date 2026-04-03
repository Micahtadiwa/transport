import React from 'react';
import './User.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import api from "../api.js";
const API_URL = import.meta.env.VITE_API_URL;

const User = () => {
    const [stats, setStats] = useState({
        user: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        declined: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(`${API_URL}/auth/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(res.data);

            } catch (err) {
                console.error(err);

                if (err.response?.status === 401) {
                    console.log("Session expired");
                }
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="user-dashboard">
            <div className='title-section'>
                <h1 className="dashboard-title">User Management</h1>
                <p className="dashboard-subtitle">This is the user management section.</p>

            </div>

            {/* Top Section - Small Stats Cards */}
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

            {/* Bottom Section - Large 2x2 Buttons */}
            <div className="bottom-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="buttons-grid">
                    <Link to="/userdata">
                        <button className="action-card btn-users">
                            <span className="action-icon">👥</span>
                            <span className="action-title">Users</span>
                            <span className="action-desc">Manage all system users</span>
                        </button>
                    </Link>
                    <Link to="/user_role">
                        <button className="action-card btn-roles">
                            <span className="action-icon">✏️</span>
                            <span className="action-title">Edit User Role</span>
                            <span className="action-desc">Modify user permissions</span>
                        </button>
                    </Link>

                    <button className="action-card btn-chart">
                        <span className="action-icon">📊</span>
                        <span className="action-title">View Chart</span>
                        <span className="action-desc">Analytics and reports</span>
                    </button>

                    <button className="action-card btn-declined">
                        <span className="action-icon">🚫</span>
                        <span className="action-title">Declined Users</span>
                        <span className="action-desc">Users with declined access</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default User;