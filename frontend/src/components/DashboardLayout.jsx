import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

function DashboardLayout({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Auto close sidebar on mobile, open on desktop
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile menu button - only visible on mobile */}
      {isMobile && (
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      {/* Sidebar with conditional classes */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className={`main-content ${sidebarOpen && !isMobile ? 'sidebar-open' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;