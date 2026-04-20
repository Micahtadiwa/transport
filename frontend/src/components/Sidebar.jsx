import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./Sidebar.css";
import { getUserRole, ROLES } from "../configs/roles.js";

function Sidebar({ closeSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, auth } = useAuth();
  const role = getUserRole(auth?.user);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Fleet Manager</h2>
        {window.innerWidth <= 768 && (
          <button className="close-sidebar" onClick={closeSidebar}>
            x
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={handleLinkClick}
        >
          <span className="icon">D</span>
          Dashboard
        </Link>

        {[ROLES.ADMIN, ROLES.MANAGER, ROLES.ATTENDANT].includes(role) && (
          <Link
            to="/fuel"
            className={location.pathname === "/fuel" ? "active" : ""}
            onClick={handleLinkClick}
          >
            <span className="icon">F</span>
            Fuel Management
          </Link>
        )}

        {[ROLES.ADMIN, ROLES.MANAGER].includes(role) && (
          <Link
            to="/vehicles"
            className={location.pathname === "/vehicles" ? "active" : ""}
            onClick={handleLinkClick}
          >
            <span className="icon">V</span>
            Vehicles
          </Link>
        )}

        {[ROLES.ADMIN, ROLES.MANAGER].includes(role) && (
          <Link
            to="/users"
            className={location.pathname === "/users" ? "active" : ""}
            onClick={handleLinkClick}
          >
            <span className="icon">U</span>
            User Management
          </Link>
        )}
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
