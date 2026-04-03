import React, { useState, useEffect } from "react";
import axios from "axios";
import "./assignvehicle.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AssignVehicle = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

 const [formData, setFormData] = useState({
  userId: "",
  vehicleId: "",
  notes: "",
  regNumber:""
});

  // ✅ Fetch users
  useEffect(() => {
    axios.get(`${API_URL}/auth/userSelect`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Fetch vehicles
  useEffect(() => {
    axios.get(`${API_URL}/vehicles/vehicle-select`)
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "vehicleId") {
      const selectedVehicle = vehicles.find(
        (v) => v.id === parseInt(value)
      );

      setFormData({
        ...formData,
        vehicleId: value,
        regNumber: selectedVehicle ? selectedVehicle.regNumber : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${API_URL}/assign/assingvehicle`, formData)
      .then((res) => {
        alert("Vehicle Assigned Successfully!");
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="assign-container">
      <h1>Assign Vehicle</h1>

      <form className="assign-form" onSubmit={handleSubmit}>

        {/* Users */}
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Vehicles */}
        <select
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          required
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.regNumber}
            </option>
          ))}
        </select>

        {/* Auto-filled Reg Number */}
        <input
          type="text"
          name="regNumber"
          value={formData.regNumber}
          readOnly
        />

        {/* Notes */}
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">Assign Vehicle</button>
      </form>
    </div>
  );
};

export default AssignVehicle;