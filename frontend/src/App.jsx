import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./components/Dashboard";
import FuelManagement from "./components/FuelManagement";
import Vehicles from "./components/Vehicles";
import Login from "./components/Login";
import Signup from "./components/Signup"; // Add this import
import User from "./components/User";
import UserData from "./components/UserData"; // Add this import
import UserRole from "./components/user_role"; // Add this import
import AddVehicles from "./components/AddVehicles"; // Add this import
import ErrorBoundary from "./components/ErrorBoundary"; // Add this import
import VehiclesList from "./components/VehiclesList";
import AssignVehicle from "./components/assignvehicle"
import EditUser from "./components/EditUser";
import AssignFuel from "./components/AssignFuel";
import AddFuel from "./components/AddFuel";
import RequireAuth from "./components/hooks/RequireAuth.jsx"
import FuelList from "./components/FuelList";
function App() {
  return (
    <div>
      <ErrorBoundary>
        <Routes>

          <Route path="/signup" element={<Signup />} /> {/* Fixed capitalization */}
          <Route path="/" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />

            <Route
              path="/fuel"
              element={
                <DashboardLayout>
                  <FuelManagement />
                </DashboardLayout>
              }
            />

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
              path="/user_role"
              element={
                <DashboardLayout>
                  <UserRole />
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
            <Route path="/vehicles-list"
              element={
                <DashboardLayout>
                  <VehiclesList />
                </DashboardLayout>
              }
            />
            <Route path="/assign-vehicle"
              element={
                <DashboardLayout>
                  <AssignVehicle />
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

        </Routes>



      </ErrorBoundary>
    </div>
  );
}

export default App;