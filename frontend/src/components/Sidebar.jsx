import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ closeSidebar }) {
  const location = useLocation();
  const { logout } = useAuth();
   const navigate = useNavigate();


  const handleLinkClick = () => {
    // Only close sidebar on mobile devices
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

    const handleLogout = () => {
    logout();                // clear auth + storage
    navigate("/");      // redirect to login page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Fleet Manager</h2>
        {/* Close button for mobile */}
        {window.innerWidth <= 768 && (
          <button className="close-sidebar" onClick={closeSidebar}>
            ×
          </button>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
          onClick={handleLinkClick}
        >
          <span className="icon">📊</span>
          Dashboard
        </Link>
        
        <Link 
          to="/fuel" 
          className={location.pathname === '/fuel' ? 'active' : ''}
          onClick={handleLinkClick}
        >
          <span className="icon">⛽</span>
          Fuel Management
        </Link>
        
        <Link 
          to="/vehicles" 
          className={location.pathname === '/vehicles' ? 'active' : ''}
          onClick={handleLinkClick}
        >
          <span className="icon">🚗</span>
          Vehicles
        </Link>

        <Link 
          to="/users" 
          className={location.pathname === '/users' ? 'active' : ''}
          onClick={handleLinkClick}
        >
          <span className="icon">👤</span>
          User Management
        </Link>
      </nav>

      <div className="sidebar-footer">
         <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </div>
  );
}

export default Sidebar;