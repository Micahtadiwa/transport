import React, { useState } from "react";
import "./AddVehicles.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AddVehicles = () => {

  const [vehicle, setVehicle] = useState({
    NumberPlate: "",
    make: "",
    model: "",
    ChassisNumber: ""
  });

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Vehicle data:", vehicle);

  try {

    const response = await axios.post(
      `${API_URL}/vehicles/add-vehicle`,
      vehicle
    );

    alert("Vehicle added successfully");

    // reset form
    setVehicle({
      NumberPlate: "",
      make: "",
      model: "",
      ChassisNumber: ""
    });

  } catch (error) {

    console.error(error.response?.data);

  }
};
  return (
    <div className="add-vehicle-container">

      <h2>Add New Vehicle</h2>

      <form className="vehicle-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Vehicle Number Plate</label>
          <input
            type="text"
            name="NumberPlate"
            value={vehicle.NumberPlate}
            onChange={handleChange}
            placeholder="Enter vehicle number plate"
            required
          />
        </div>

        <div className="form-group">
          <label>Vehicle Make</label>
          <input
            type="text"
            name="make"
            value={vehicle.make}
            onChange={handleChange}
            placeholder="Enter vehicle make"
            required
          />
        </div>

        <div className="form-group">
          <label>Vehicle Model</label>
          <input
            type="text"
            name="model"
            value={vehicle.model}
            onChange={handleChange}
            placeholder="Enter vehicle model"
            required
          />
        </div>

        <div className="form-group">
          <label>Chase Number</label>
          <input
            type="text"
            name="ChassisNumber"
            value={vehicle.ChassisNumber}
            onChange={handleChange}
            placeholder="Enter chase number"
            required
          />
        </div>

        <button type="submit" className="submit-btn" >
          Add Vehicle
        </button>

      </form>

    </div>
  );
};

export default AddVehicles;