import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignFuel.css";
const API_URL = import.meta.env.VITE_API_URL;


const AssignFuel = () => {
  const [assignedFuel, setAssignedFuel] = useState([]);

  useEffect(() => {
    fetchAssignedFuel();
  }, []);

  const fetchAssignedFuel = async () => {
    try {
      const res = await axios.get(`${API_URL}/assign/getAssignedVehicle`);
      setAssignedFuel(res.data);
    } catch (error) {
      console.error("Error fetching assigned fuel:", error);
    }
  };

  const handleUnassign = async (id) => {
    try {
      await axios.put(`${API_URL}/assign/assigned-fuel/${id}`, {
        assigned: false
      });
      fetchAssignedFuel();
    } catch (error) {
      console.error("Error unassigning fuel:", error);
    }
  };

  return (
    <div className="fuel-container">
      {/* Header */}
      <div className="fuel-header">
        <h1>Assigned Fuel</h1>
        <p>Manage fuel assigned to vehicles and drivers</p>
      </div>
      <div className="table-wrapper">
        <table className="fuel-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Notes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assignedFuel.length > 0 ? (
              assignedFuel.map((item) => (
                <tr key={item.id}>

                  {/* Vehicle with make + model */}
                  <td>
                    {item.vehicle} <br />
                    <small>{item.make} {item.model}</small>
                  </td>

                  <td>{item.user}</td>

                  <td>{item.notes}</td>

                  {/* Format date */}
                  <td>
                    {new Date(item.created_at).toLocaleString()}
                  </td>

                  <td>
                    <button>View</button>

                    {/* Show only if assigned */}
                    {item.assigned === 1 && (
                      <button onClick={() => handleUnassign(item.id)}>
                        Unassign
                      </button>
                    )}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No assigned vehicles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignFuel;