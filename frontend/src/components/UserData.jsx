import React, { useState } from 'react';
import './UserData.css'; // We'll create this file next

const UserData = () => {
  // Sample user data
  const [users, setUsers] = useState([

  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'Active').length,
    drivers: users.filter(u => u.role === 'Driver').length,
    stationStaff: users.filter(u => u.role.includes('Station')).length
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user actions
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowAddModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleStatusToggle = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="header">
        <h1>
          <i className="fas fa-users-cog"></i>
          User Management
        </h1>
        <button className="btn-primary" onClick={() => {
          setSelectedUser(null);
          setShowAddModal(true);
        }}>
          <i className="fas fa-plus"></i>
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.activeUsers}</span>
            <span className="stat-label">Active Now</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-truck"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.drivers}</span>
            <span className="stat-label">Drivers</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fas fa-gas-pump"></i>
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.stationStaff}</span>
            <span className="stat-label">Station Staff</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="driver">Driver</option>
            <option value="station_operator">Station Operator</option>
            <option value="station_manager">Station Manager</option>
            <option value="admin">System Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="btn-export">
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Employee ID</th>
              <th>Access & Assignment</th>
              <th>Quota</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="user-cell">
                  <div className="user-avatar">{user.avatar}</div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase().replace(' ', '-')}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.employeeId}</td>
                <td>
                  <div className="access-info">
                    {user.fuelCard && (
                      <span className="access-item">
                        <i className="fas fa-id-card"></i> {user.fuelCard}
                      </span>
                    )}
                    {user.vehicleAssigned && (
                      <span className="access-item">
                        <i className="fas fa-truck"></i> {user.vehicleAssigned}
                      </span>
                    )}
                    {user.stationAssigned && (
                      <span className="access-item">
                        <i className="fas fa-gas-pump"></i> {user.stationAssigned}
                      </span>
                    )}
                    {user.mfaEnabled && (
                      <span className="access-item mfa">
                        <i className="fas fa-shield-alt"></i> 2FA
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  {user.fuelQuota ? (
                    <span className="quota-badge">
                      {user.fuelQuota} L
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge status-${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.lastActive}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditUser(user)}
                    title="Edit User"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="action-btn status"
                    onClick={() => handleStatusToggle(user.id)}
                    title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  >
                    <i className={`fas fa-user-${user.status === 'Active' ? 'slash' : 'check'}`}></i>
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteClick(user)}
                    title="Delete User"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              setShowAddModal(false);
            }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.name || ''}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    defaultValue={selectedUser?.email || ''}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.employeeId || ''}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select defaultValue={selectedUser?.role || 'Driver'}>
                    <option value="Driver">Driver</option>
                    <option value="Station Operator">Station Operator</option>
                    <option value="Station Manager">Station Manager</option>
                    <option value="System Admin">System Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fuel Card Number</label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.fuelCard || ''}
                    placeholder="Enter fuel card number"
                  />
                </div>
                <div className="form-group">
                  <label>Fuel Quota (Liters)</label>
                  <input
                    type="number"
                    defaultValue={selectedUser?.fuelQuota || ''}
                    placeholder="Enter monthly quota"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Assignment</label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.vehicleAssigned || selectedUser?.stationAssigned || ''}
                    placeholder="Vehicle or Station assignment"
                  />
                </div>
                <div className="form-group full-width">
                  <label>
                    <input type="checkbox" defaultChecked={selectedUser?.mfaEnabled} />
                    Enable Two-Factor Authentication
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="delete-content">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserData;