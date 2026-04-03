import React from "react";
import "./FuelManagement.css";
import { useNavigate } from "react-router-dom";

const FuelManagement = () => {
  const navigate = useNavigate();

  const handleAddFuel = () => {
    navigate("/add-fuel");
  };

  const handleViewFuel = () => {
    navigate("/fuel-list");
  };

  const handleAssignFuel = () => {
    navigate("/assign-fuel");
  };

  return (
    <div className="vehicles-container">
      <div className="vehicles-header">
        <h1>Fuel Section</h1>
        <p>Manage fuel records in the system</p>
      </div>

      <div className="vehicles-actions">
        <button className="add-btn" onClick={handleAddFuel}>
          Add Fuel
        </button>

        <button className="view-btn" onClick={handleViewFuel}>
          View Fuel Records
        </button>

        <button className="view-btn" onClick={handleAssignFuel}>
          Assigned Fuel
        </button>
      </div>
    </div>
  );
};

export default FuelManagement;