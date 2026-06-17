import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Events from "../pages/Events";
import MyApplications from "../pages/MyApplications";
import Volunteers from "../pages/Volunteers";
import Reports from "../pages/admin/Reports";
import EventDetails from "../pages/EventDetails";
import CreateEvent from "../admin/CreateEvent";
import AdminApplications from "../pages/admin/AdminApplications";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Profile from "../pages/Profile";
import SecurityLogs from "../pages/admin/SecurityLogs";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/admin/security-logs"
        element={
          <ProtectedRoute>
            <SecurityLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/events/create"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute>
            <AdminApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteers"
        element={
          <ProtectedRoute>
            <Volunteers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;