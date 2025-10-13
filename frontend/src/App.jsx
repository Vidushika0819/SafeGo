import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { isAuthenticated } from './utils/auth';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DailyCheckForm from './components/DailyCheckForm';
import DailyCheckList from './components/DailyCheckList';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import MonthlyReportForm from './components/MonthlyReportForm';
import MonthlyReportList from './components/MonthlyReportList';
import VehicleManagement from './components/VehicleManagement';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import AdminDashboard from './components/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Root Route Component - check auth and redirect appropriately
const RootRoute = () => {
  return <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          {/* Root route - redirect based on auth status */}
          <Route path="/" element={<RootRoute />} />
          
          {/* Public Routes - no sidebar/navbar, colored background */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #FFD700 0%, #1E90FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 32px', minWidth: 350, maxWidth: 420, width: '100%'}}>
                    <Login />
                  </div>
                </div>
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #FFD700 0%, #1E90FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '40px 32px', minWidth: 350, maxWidth: 520, width: '100%'}}>
                    <Register />
                  </div>
                </div>
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - with sidebar/navbar */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <Dashboard />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/daily-checks" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <DailyCheckList />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/daily-checks/new" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <DailyCheckForm />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/daily-checks/:id/edit" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <DailyCheckForm />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/maintenance" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <MaintenanceList />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/maintenance/new" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <MaintenanceForm />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/maintenance/:id/edit" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <MaintenanceForm />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/monthly-reports" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <MonthlyReportList />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/monthly-reports/new" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <MonthlyReportForm />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/monthly-reports/:id/edit" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <MonthlyReportForm />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/vehicles" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <VehicleManagement />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <UserManagement />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <Reports />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <Navbar />
              <Sidebar />
              <div style={{marginLeft: 220, minHeight: '100vh', background: '#fafbfc', padding: '32px 24px 24px 24px'}}>
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
