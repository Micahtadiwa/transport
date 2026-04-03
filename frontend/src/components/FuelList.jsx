import React, { useEffect, useState } from "react";
import axios from "axios";
import './FuelList.css'

const FuelList = () => {
    const [fuelRecords, setFuelRecords] = useState([]);

    useEffect(() => {
        fetchFuelRecords();
    }, []);

    const fetchFuelRecords = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/fuel");
            setFuelRecords(res.data);
        } catch (error) {
            console.error("Error fetching fuel records:", error);
        }
    };

    return (
        <div className="fuel-container">
            <h1>Fuel Records</h1>
            <div className="table-wrapper">
                <table className="fuel-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Vehicle</th>
                            <th>Fuel Type</th>
                            <th>Litres</th>
                            <th>Price/L</th>
                            <th>Total</th>
                            <th>Driver</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {fuelRecords.length > 0 ? (
                            fuelRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.date}</td>
                                    <td>{record.vehicle}</td>
                                    <td>{record.fuel_type}</td>
                                    <td>{record.litres}</td>
                                    <td>${record.price_per_litre}</td>
                                    <td>${record.total}</td>
                                    <td>{record.driver_name}</td>

                                    <td>
                                        <button>View</button>
                                        <button>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No fuel records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

        </div>
    );
};

export default FuelList;