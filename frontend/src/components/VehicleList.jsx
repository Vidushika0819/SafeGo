import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleList = ({ token }) => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(res.data);
      } catch (err) {
        alert('Failed to load vehicles');
      }
    };
    fetchVehicles();
  }, [token]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', color: '#2F4F4F' }}>
      <h2 style={{ color: '#1E90FF' }}>Vehicles</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {vehicles.map((v) => (
          <li key={v._id} style={{ marginBottom: '10px', backgroundColor: '#FFD700', padding: '10px', borderRadius: '4px' }}>
            {v.vehicleId} - {v.model} ({v.status})
          </li>
        ))}
      </ul>
      <div>
        <a href="/daily-check" style={{ color: '#1E90FF', marginRight: '10px', textDecoration: 'none' }}>Submit Daily Check</a> |
        <a href="/maintenance-log" style={{ color: '#1E90FF', marginLeft: '10px', textDecoration: 'none' }}>Log Maintenance</a> |
        <a href="/monthly-report" style={{ color: '#1E90FF', marginLeft: '10px', textDecoration: 'none' }}>View Reports</a>
      </div>
    </div>
  );
};

export default VehicleList;