import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./components/Dashboard";
import FuelManagement from "./components/FuelManagement";
import Vehicles from "./components/Vehicles";
import Login from "./components/Login";
import Signup from "./components/Signup";
import User from "./components/User";
import UserData from "./components/UserData";
import UserRole from "./components/user_role";
import AddVehicles from "./components/AddVehicles";
import ErrorBoundary from "./components/ErrorBoundary";
import VehiclesList from "./components/VehiclesList";
import AssignVehicle from "./components/assignvehicle";
import EditUser from "./components/EditUser";
import AssignFuel from "./components/AssignFuel";
import AddFuel from "./components/AddFuel";
import RequireAuth from "./components/hooks/RequireAuth.jsx";
import FuelList from "./components/FuelList";
import Unauthorized from "./components/Unauthorized";
import { ROLES } from "./configs/roles.js";
import { useAuth } from "./AuthContext.jsx";
import api from "./api.js";

function App() {
  const { isLoggedIn, auth, login, logout } = useAuth();
  const [roleReady, setRoleReady] = useState(false);

  useEffect(() => {
    let active = true;

    const syncUserRole = async () => {
      if (!isLoggedIn) {
        if (active) setRoleReady(true);
        return;
      }

      setRoleReady(false);

      try {
        const res = await api.get("/auth/me");
        const backendUser = res.data?.user;

        if (backendUser && active) {
          login(auth.token, { ...auth.user, ...backendUser });
        }
      } catch (error) {
        console.error("Role sync failed:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      } finally {
        if (active) setRoleReady(true);
      }
    };

    syncUserRole();

    return () => {
      active = false;
    };
  }, [isLoggedIn, auth?.token]);

  if (!roleReady) {
    return <div>Checking permissions...</div>;
  }

  return (
    <div>
      <ErrorBoundary>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />

          <Route element={<RequireAuth />}>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.ATTENDANT]} />}>
            <Route
              path="/fuel"
              element={
                <DashboardLayout>
                  <FuelManagement />
                </DashboardLayout>
              }
            />
            <Route
              path="/assign-fuel"
              element={
                <DashboardLayout>
                  <AssignFuel />
                </DashboardLayout>
              }
            />
            <Route
              path="/add-fuel"
              element={
                <DashboardLayout>
                  <AddFuel />
                </DashboardLayout>
              }
            />
            <Route
              path="/fuel-list"
              element={
                <DashboardLayout>
                  <FuelList />
                </DashboardLayout>
              }
            />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]} />}>
            <Route
              path="/vehicles"
              element={
                <DashboardLayout>
                  <Vehicles />
                </DashboardLayout>
              }
            />
            <Route
              path="/users"
              element={
                <DashboardLayout>
                  <User />
                </DashboardLayout>
              }
            />
            <Route
              path="/userdata"
              element={
                <DashboardLayout>
                  <UserData />
                </DashboardLayout>
              }
            />
            <Route
              path="/add-vehicle"
              element={
                <DashboardLayout>
                  <AddVehicles />
                </DashboardLayout>
              }
            />
            <Route
              path="/vehicles-list"
              element={
                <DashboardLayout>
                  <VehiclesList />
                </DashboardLayout>
              }
            />
            <Route
              path="/assign-vehicle"
              element={
                <DashboardLayout>
                  <AssignVehicle />
                </DashboardLayout>
              }
            />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route
              path="/user_role"
              element={
                <DashboardLayout>
                  <UserRole />
                </DashboardLayout>
              }
            />
            <Route
              path="/edit-user/:id"
              element={
                <DashboardLayout>
                  <EditUser />
                </DashboardLayout>
              }
            />
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
