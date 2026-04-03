import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaCar,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaGasPump,
  FaPaperPlane
} from 'react-icons/fa';
import './AddFuel.css';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";  

const AddFuel = () => {
  const [formData, setFormData] = useState({
    vehicle_id: '',
    user_id: '',
    amount: '',
    date: '',
    notes: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ Fetch vehicles & users
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/vehicles`),
        axios.get(`${API_URL}/users`)
      ]);

      
      setVehicles(vehRes.data);
      setUsers(userRes.data);
    } catch (err) {
      toast.error("Error loading data");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ✅ Validation
    if (!formData.vehicle_id || !formData.user_id || !formData.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Saving fuel record...");

    try {
      const res = await axios.post(`${API_URL}/fuel`, formData);

      toast.dismiss(loadingToast);

      if (res.data.success) {
        toast.success("Fuel added successfully!");

        setFormData({
          vehicle_id: '',
          user_id: '',
          amount: '',
          date: '',
          notes: ''
        });
      } else {
        toast.error(res.data.message || "Failed to save");
      }

    } catch (err) {
      toast.dismiss(loadingToast);

      if (err.response) {
        toast.error(err.response.data?.message || "Server error");
      } else {
        toast.error("Network error");
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fuel-containers">
      <Toaster position="top-center" />
      <div className="fuel-wrappers">

        <h1>Add Fuel Record</h1>

        <form onSubmit={handleSubmit} className="fuel-form">

          {/* Vehicle */}
          <div className="form-group">
            <label>
              <FaCar /> Vehicle *
            </label>
            <select
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.regNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Driver */}
          <div className="form-group">
            <label>
              <FaUser /> Driver *
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Driver</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.Username}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Amount */}
          <div className="form-group">
            <label>
              <FaGasPump /> Fuel Amount (Litres) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter litres"
              required
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label>
              <FaCalendarAlt /> Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>
              <FaFileAlt /> Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional notes..."
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : (
              <>
                <FaPaperPlane /> Add Fuel
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddFuel;