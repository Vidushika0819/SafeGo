import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const DriverDashboard = ({ token }) => {
  const [data, setData] = useState({ checkStats: [], recentChecks: [], assignedVehicles: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/driver`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const checkStats = res.data.checkStats.map(stat => ({ name: stat._id, count: stat.count }));
        setData({ ...res.data, checkStats });
      } catch (err) {
        alert('Failed to load dashboard');
      }
    };
    fetchData();
  }, [token]);

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', color: '#2F4F4F' }}>
      <h2 style={{ color: '#1E90FF' }}>Driver Dashboard</h2>
      
      <h3>Daily Check Decisions</h3>
      <BarChart width={600} height={300} data={data.checkStats}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#1E90FF" />
      </BarChart>
      
      <h3>Recent Daily Checks</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#1E90FF', color: '#FFFFFF' }}>
            <th>Vehicle ID</th>
            <th>Date</th>
            <th>Final Decision</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {data.recentChecks.map((check) => (
            <tr key={check._id} style={{ backgroundColor: '#FFD700', marginBottom: '5px' }}>
              <td>{check.vehicleId}</td>
              <td>{new Date(check.date).toLocaleDateString()}</td>
              <td>{check.finalDecision}</td>
              <td>{check.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h3>Assigned Vehicles</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.assignedVehicles.map((v) => (
          <li key={v._id} style={{ marginBottom: '10px', backgroundColor: '#FFD700', padding: '10px', borderRadius: '4px' }}>
            {v.vehicleId} - {v.model} ({v.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverDashboard;