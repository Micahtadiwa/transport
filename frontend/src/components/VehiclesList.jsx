import React, { useEffect, useState } from "react";
import axios from "axios";
import './VehiclesList.css'

function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [sort, setSort] = useState({ key: "", dir: "asc" });

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (!sort.key) return 0;
    const aVal = a[sort.key]?.toString().toLowerCase();
    const bVal = b[sort.key]?.toString().toLowerCase();
    if (aVal < bVal) return sort.dir === "asc" ? -1 : 1;
    if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSort({
      key,
      dir: sort.key === key && sort.dir === "asc" ? "desc" : "asc"
    });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/vehicles/get-vehicles");
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="vehicles-container">
      <div></div>
      <h1 className="vehicles-title">Vehicles</h1>

      <div className="vehicles-table-wrapper">
        <table className="vehicles-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("number_plate")}>Number Plate</th>
              <th onClick={() => handleSort("make")}>Make</th>
              <th onClick={() => handleSort("model")}>Model</th>
              <th>Chassis Number</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.number_plate}</td>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.chassis_number}</td>
                <td>
                  <button className="btns edit-btn">Edit</button>
                  <button className="btns delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VehiclesList;