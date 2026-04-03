import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";

const RequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn
    ? <Outlet />
    : <Navigate to="/" state={{ from: location }} replace />;
};

export default RequireAuth;