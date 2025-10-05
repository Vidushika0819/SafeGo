import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    busId: '',
    busNumber: '',
    busType: '',
    capacity: '',
    status: 'active'
  });

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5005/buses');
      setBuses(response.data.buses || []);
    } catch (error) {
      console.error('Error loading buses:', error);
      alert('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      busId: '',
      busNumber: '',
      busType: '',
      capacity: '',
      status: 'active'
    });
    setEditingBus(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        // Update existing bus
        await axios.put(`http://localhost:5005/buses/${editingBus._id}`, formData);
        alert('Bus updated successfully!');
      } else {
        // Create new bus
        await axios.post('http://localhost:5005/buses', formData);
        alert('Bus created successfully!');
      }
      resetForm();
      loadBuses();
    } catch (error) {
      console.error('Error saving bus:', error);
      alert('Failed to save bus: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (bus) => {
    setFormData({
      busId: bus.busId,
      busNumber: bus.busNumber,
      busType: bus.busType,
      capacity: bus.capacity,
      status: bus.status
    });
    setEditingBus(bus);
    setShowForm(true);
  };

  const handleDelete = async (busId) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) return;

    try {
      await axios.delete(`http://localhost:5005/buses/${busId}`);
      alert('Bus deleted successfully!');
      loadBuses();
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Failed to delete bus: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'under maintenance': return '#ffc107';
      case 'inactive': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px' }}>Loading bus management...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>🚐 Bus Management</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ➕ Add New Bus
        </button>
      </div>

      {/* Bus Form */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
            {editingBus ? '✏️ Edit Bus' : '➕ Add New Bus'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Bus ID:
                </label>
                <input
                  type="text"
                  name="busId"
                  value={formData.busId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Bus Number:
                </label>
                <input
                  type="text"
                  name="busNumber"
                  value={formData.busNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Bus Type:
                </label>
                <select
                  name="busType"
                  value={formData.busType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Bus Type</option>
                  <option value="Mini Bus">Mini Bus</option>
                  <option value="Standard Bus">Standard Bus</option>
                  <option value="Luxury Bus">Luxury Bus</option>
                  <option value="Double Decker">Double Decker</option>
                  <option value="Articulated Bus">Articulated Bus</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Capacity:
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Status:
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="under maintenance">Under Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                💾 {editingBus ? 'Update Bus' : 'Create Bus'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Buses List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ margin: 0, color: '#2c3e50' }}>📋 All Buses ({buses.length})</h3>
        </div>

        {buses.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚐</div>
            <p>No buses found. Create your first bus!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Bus ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Bus Number</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Capacity</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map(bus => (
                  <tr key={bus._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{bus.busId}</td>
                    <td style={{ padding: '12px' }}>{bus.busNumber}</td>
                    <td style={{ padding: '12px' }}>{bus.busType}</td>
                    <td style={{ padding: '12px' }}>{bus.capacity} seats</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: getStatusColor(bus.status)
                      }}>
                        {bus.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(bus)}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#ffc107',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '5px'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bus._id)}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusManagement;
