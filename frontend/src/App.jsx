import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Import for decoding token
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import VehicleList from './components/VehicleList.jsx';
import DailyCheckForm from './components/DailyCheckForm.jsx';
import MaintenanceLogForm from './components/MaintenanceLogForm.jsx';
import MonthlyReportView from './components/MonthlyReportView.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import DriverDashboard from './components/DriverDashboard.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const Dashboard = () => {
    if (!token) return <Login setToken={setToken} />;
    const decoded = jwtDecode(token);
    return decoded.role === 'admin' ? <AdminDashboard token={token} /> : <DriverDashboard token={token} />;
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#2F4F4F' }}>
        <header style={{ backgroundColor: '#1E90FF', color: '#FFFFFF', padding: '10px', textAlign: 'center' }}>
          <h1>Vehicle Maintenance Tracker</h1>
        </header>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={token ? <VehicleList token={token} /> : <Login setToken={setToken} />} />
          <Route path="/daily-check" element={token ? <DailyCheckForm token={token} /> : <Login setToken={setToken} />} />
          <Route path="/maintenance-log" element={token ? <MaintenanceLogForm token={token} /> : <Login setToken={setToken} />} />
          <Route path="/monthly-report" element={token ? <MonthlyReportView token={token} /> : <Login setToken={setToken} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;