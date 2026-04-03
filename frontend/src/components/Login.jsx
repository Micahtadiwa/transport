import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      return setError("Email and password are required");
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000
        }
      );

      const token = response.data.token || response.data.data?.token;
      const user = response.data.user || response.data.data?.user;

      if (!token) {
        return setError("Invalid response: no token");
      }

      // ✅ Save email if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // ✅ Login via context
      login(token, user);

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.message ||
          err.response.data?.error ||
          "Login failed"
        );
      } else if (err.request) {
        setError("Cannot connect to server.");
      } else {
        setError("Something went wrong.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
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

        <form onSubmit={handleSubmit} className="login-form">
          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">
              <span className="label-icon">📧</span>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              required
              autoComplete="email"
              className={error.includes('email') ? 'error' : ''}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                required
                autoComplete="current-password"
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

          {/* OPTIONS */}
          <div className="form-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={handleCheckboxChange}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          {/* BUTTON */}
          <button 
            type="submit" 
            className="btn-login" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;