import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';

// Use environment variable for API URL or fallback to localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Signup() {
  const [formData, setFormData] = useState({
    Username: '',        // Keep capitalized to match backend
    Email: '',           // Keep capitalized to match backend
    Password: '',        // Keep capitalized to match backend
    confirmPassword: '', // Keep as is
    AgreeTerms: false    // Keep capitalized
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get values from formData - using correct capitalized names
    const username = formData.Username.trim();
    const rawEmail = formData.Email;
    const password = formData.Password;
    const confirmPassword = formData.confirmPassword;
    const agreeTerms = formData.AgreeTerms;

    // Email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Password validation (min 8 chars, at least one number and one letter, can include special chars)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

    // Check if fields are empty
    if (!username || !rawEmail || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Validate email format
    if (!emailRegex.test(rawEmail)) {
      setError("Please enter a valid email address (e.g., name@example.com)");
      return;
    }

    // Validate password strength
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and contain at least one letter and one number");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check terms agreement
    if (!agreeTerms) {
      setError("You must agree to the Terms and Conditions");
      return;
    }

    // Now trim and lowercase email for sending to server
    const email = rawEmail.trim().toLowerCase();

    console.log("Attempting signup with:", { username, email, password: "***", agreeTerms });

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Sending request to:", `${API_URL}/auth/signup`);
      
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        { 
          Username: username,
          Email: email, 
          Password: password,
          TermsAccepted: agreeTerms
        },
        {
          headers: { 
            "Content-Type": "application/json" 
          },
          timeout: 10000
        }
      );

      console.log("Full response:", response);
      console.log("Response data:", response.data);

      // Check if signup was successful
      if (response.status === 200 || response.status === 201) {
        setSuccess("Account created successfully! Redirecting to login...");
        
        // Store email for auto-fill on login (optional)
        localStorage.setItem("registeredEmail", email);
        
        // Clear form
        setFormData({
          Username: '',
          Email: '',
          Password: '',
          confirmPassword: '',
          AgreeTerms: false
        });
        
        // Redirect to login page
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.data?.message || "Signup failed. Please try again.");
      }

    } catch (err) {
      console.error("Full error object:", err);
      
      if (err.response) {
        // Server responded with an error
        console.log("Error response status:", err.response.status);
        console.log("Error response data:", err.response.data);
        
        // Get the error message from the server response
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            err.response.data?.msg ||
                            `Signup failed (${err.response.status})`;
        setError(errorMessage);
        
      } else if (err.request) {
        // Request was made but no response received
        console.log("No response received:", err.request);
        setError("Cannot connect to server. Please check if backend is running on port 5000.");
      } else {
        // Something else happened
        console.log("Error setting up request:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join us today</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={() => setError('')} className="close-btn">×</button>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="Username">
              <span className="label-icon">👤</span>
              Username
            </label>
            <input
              type="text"
              id="Username"
              name="Username"  // Capital U to match state
              value={formData.Username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={loading}
              required
              autoComplete="username"
              className={error.includes('username') ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="Email">
              <span className="label-icon">📧</span>
              Email Address
            </label>
            <input
              type="email"
              id="Email"
              name="Email"  // Capital E to match state
              value={formData.Email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              required
              autoComplete="email"
              className={error.includes('email') ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="Password">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="Password"
                name="Password"  // Capital P to match state
                value={formData.Password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={loading}
                required
                autoComplete="new-password"
                className={error.includes('password') ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <span className="label-icon">✓</span>
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
                required
                autoComplete="new-password"
                className={error.includes('match') || error.includes('password') ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="agree-terms">
              <input 
                type="checkbox" 
                name="AgreeTerms"  // Capital A to match state
                checked={formData.AgreeTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <span>I agree to the <Link to="/terms" target="_blank">Terms and Conditions</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link></span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-signup" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;