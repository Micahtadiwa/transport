import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";
import { getUserRole, hasRequiredRole } from "../../configs/roles.js";

const RequireAuth = ({ allowedRoles = [] }) => {
  const { isLoggedIn, auth } = useAuth();
  const location = useLocation();
  const userRole = getUserRole(auth?.user);

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole(userRole, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
