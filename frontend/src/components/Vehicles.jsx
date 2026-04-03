import React from "react";
import "./Vehicles.css";
import { useNavigate } from "react-router-dom";

const Vehicles = () => {

  const navigate = useNavigate();

  const handleAddVehicle = () => {
    navigate("/add-vehicle");
  };

  const handleViewVehicles = () => {
    navigate("/vehicles-list");
  };
  const handleAssignVehicle=()=>{
    navigate("/assign-vehicle")
  }

  return (
    <div className="vehicles-container">

      <div className="vehicles-header">
        <h1>Vehicles Section</h1>
        <p>Manage vehicle records in the system</p>
      </div>

      <div className="vehicles-actions">
        <button className="add-btn" onClick={handleAddVehicle}>
          Add Vehicle
        </button>

        <button className="view-btn" onClick={handleViewVehicles}>
          View Vehicles
        </button>
        <button className="view-btn " onClick={handleAssignVehicle}>
          Assign Vehicle
        </button>
      </div>

    </div>
  );
};

export default Vehicles;