import React, { useState } from 'react';
import axios from 'axios';

const DailyCheckForm = ({ token }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    checklist: { brakes: false, tires: false, lights: false, fuel: false, firstAidKit: false },
    finalDecision: 'Ready',
    remarks: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/daily-checks`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Check submitted');
    } catch (err) {
      alert('Submit failed');
    }
  };

  const handleChecklistChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, checklist: { ...formData.checklist, [name]: checked } });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', color: '#2F4F4F', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#1E90FF' }}>Daily Check</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          value={formData.vehicleId}
          onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
          placeholder="Vehicle ID"
          required
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <label style={{ color: '#2F4F4F' }}>
          Brakes: <input type="checkbox" name="brakes" checked={formData.checklist.brakes} onChange={handleChecklistChange} />
        </label>
        <label style={{ color: '#2F4F4F' }}>
          Tires: <input type="checkbox" name="tires" checked={formData.checklist.tires} onChange={handleChecklistChange} />
        </label>
        <label style={{ color: '#2F4F4F' }}>
          Lights: <input type="checkbox" name="lights" checked={formData.checklist.lights} onChange={handleChecklistChange} />
        </label>
        <label style={{ color: '#2F4F4F' }}>
          Fuel: <input type="checkbox" name="fuel" checked={formData.checklist.fuel} onChange={handleChecklistChange} />
        </label>
        <label style={{ color: '#2F4F4F' }}>
          First Aid Kit: <input type="checkbox" name="firstAidKit" checked={formData.checklist.firstAidKit} onChange={handleChecklistChange} />
        </label>
        <select
          value={formData.finalDecision}
          onChange={(e) => setFormData({ ...formData, finalDecision: e.target.value })}
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        >
          <option>Ready</option>
          <option>Not Ready</option>
          <option>Needs Service</option>
          <option>Unsafe</option>
        </select>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Remarks"
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#FFD700', color: '#2F4F4F', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DailyCheckForm;