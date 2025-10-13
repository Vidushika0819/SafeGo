import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import AddDriver from "./components/Driver/AddDriver";
import Drivers from "./components/Driver/Drivers";
import UpdateDriver from "./components/Driver/updateDriver";
import CreateTrip from "./components/Trip/CreateTrip";
import ViewTrips from "./components/Trip/ViewTrips";
import UpdateTrip from "./components/Trip/UpdateTrip";
import AddCoordinator from "./components/Coordinator/AddCoordinator";
import Coordinators from "./components/Coordinator/Coordinators";
import UpdateCoordinator from "./components/Coordinator/updateCoordinator";
import AddBus from "./components/Bus/AddBus";
import ViewBus from "./components/Bus/ViewBus";
import UpdateBus from "./components/Bus/updateBus";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import ParentRegister from "./components/Auth/ParentRegister";
import ParentLogin from "./components/Auth/ParentLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserManagement from "./components/Admin/UserManagement/UserManagement";
import ParentDashboard from "./components/Parent/ParentDashboard";
import NotificationsCenter from "./components/Parent/NotificationsCenter";
import OperationalDashboard from "./components/Operational/OperationalDashboard";
import CoordinatorDashboard from "./components/Coordinator/CoordinatorDashboard";
import CoordinatorProfileSettings from "./components/Coordinator/CoordinatorProfileSettings";
import DriverDashboard from "./components/Driver/DriverDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false, requireParent = false, requireCoordinator = false, requireDriver = false }) => {
  const { isAuthenticated, isAdmin, isParent, isCoordinator, isDriver, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (requireParent && !isParent()) {
    return <Navigate to="/parent/login" replace />;
  }

  if (requireCoordinator && !isCoordinator()) {
    return <Navigate to="/" replace />;
  }

  if (requireDriver && !isDriver()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/parent/register" element={<ParentRegister />} />
          <Route path="/parent/login" element={<ParentLogin />} />
          <Route path="/parent/dashboard" element={
            <ProtectedRoute requireParent={true}>
              <ParentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/parent/dashboard/notifications" element={
            <ProtectedRoute requireParent={true}>
              <NotificationsCenter />
            </ProtectedRoute>
          } />
          <Route path="/operational/dashboard" element={
            <ProtectedRoute>
              <OperationalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/coordinator/dashboard" element={
            <ProtectedRoute requireCoordinator={true}>
              <CoordinatorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/coordinator/profile" element={
            <ProtectedRoute requireCoordinator={true}>
              <CoordinatorProfileSettings />
            </ProtectedRoute>
          } />
          <Route path="/driver/dashboard" element={
            <ProtectedRoute requireDriver={true}>
              <DriverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/adddriver" element={<AddDriver />} />
        <Route path="/viewdriver" element={<Drivers />} />
        <Route path="/viewdriver/:id" element={<UpdateDriver />} />
        <Route path="/createtrip" element={<CreateTrip />} />
        <Route path="/viewtrips" element={<ViewTrips />} />
        <Route path="/updatetrip/:id" element={<UpdateTrip />} />
        <Route path="/addcoordinator" element={<AddCoordinator />} />
        <Route path="/viewcoordinator" element={<Coordinators />} />
        <Route path="/viewcoordinator/:id" element={<UpdateCoordinator />} />
        <Route path="/addbus" element={<AddBus />} />
        <Route path="/viewbus" element={<ViewBus />} />
        <Route path="/viewbus/:id" element={<UpdateBus />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
