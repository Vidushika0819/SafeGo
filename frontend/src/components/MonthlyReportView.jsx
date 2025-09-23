import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonthlyReportView = ({ token }) => {
  const [vehicleId, setVehicleId] = useState('');
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/monthly-reports/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      alert('Failed to load reports');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', color: '#2F4F4F', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#1E90FF' }}>Monthly Reports</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          placeholder="Vehicle ID"
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <button
          onClick={fetchReports}
          style={{ padding: '10px', backgroundColor: '#FFD700', color: '#2F4F4F', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Load Reports
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reports.map((r) => (
          <li key={r._id} style={{ marginBottom: '10px', backgroundColor: '#FFD700', padding: '10px', borderRadius: '4px' }}>
            Month: {r.month}/{r.year} - Issues: {r.issues}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyReportView;