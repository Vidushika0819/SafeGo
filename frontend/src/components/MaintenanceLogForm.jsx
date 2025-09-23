import React, { useState } from 'react';
import axios from 'axios';

const MaintenanceLogForm = ({ token }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    description: '',
    priority: 'Medium',
    status: 'Planned',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/maintenance-logs`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Log created');
    } catch (err) {
      alert('Failed');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', color: '#2F4F4F', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#1E90FF' }}>Maintenance Log</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          value={formData.vehicleId}
          onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
          placeholder="Vehicle ID"
          required
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <input
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
          placeholder="Service Type"
          required
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value})}
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        >
          <option>Planned</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#FFD700',color: '#2F4F4F', 
             border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Create Log
        </button>
      </form>
    </div>
  );
};

export default MaintenanceLogForm;