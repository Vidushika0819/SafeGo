import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Trip_ID: '',
    date: '',
    start_time: '',
    end_time: '',
    start_location: '',
    route: '',
    status: 'scheduled',
    busId: '',
    driverId: '',
    coordinatorId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tripsRes, busesRes, driversRes, coordinatorsRes] = await Promise.all([
        axios.get('http://localhost:5005/trips'),
        axios.get('http://localhost:5005/buses'),
        axios.get('http://localhost:5005/drivers'),
        axios.get('http://localhost:5005/coordinators')
      ]);

      setTrips(tripsRes.data.trips || []);
      setBuses(busesRes.data.buses || []);
      setDrivers(driversRes.data.drivers || []);
      setCoordinators(coordinatorsRes.data.coordinators || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
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
      Trip_ID: '',
      date: '',
      start_time: '',
      end_time: '',
      start_location: '',
      route: '',
      status: 'scheduled',
      busId: '',
      driverId: '',
      coordinatorId: ''
    });
    setEditingTrip(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrip) {
        // Update existing trip
        await axios.put(`http://localhost:5005/trips/${editingTrip._id}`, formData);
        alert('Trip updated successfully!');
      } else {
        // Create new trip
        await axios.post('http://localhost:5005/trips', formData);
        alert('Trip created successfully!');
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (trip) => {
    setFormData({
      Trip_ID: trip.Trip_ID,
      date: trip.date ? new Date(trip.date).toISOString().split('T')[0] : '',
      start_time: trip.start_time,
      end_time: trip.end_time,
      start_location: trip.start_location,
      route: trip.route,
      status: trip.status,
      busId: trip.busId?._id || trip.busId,
      driverId: trip.driverId?._id || trip.driverId,
      coordinatorId: trip.coordinatorId?._id || trip.coordinatorId
    });
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await axios.delete(`http://localhost:5005/trips/${tripId}`);
      alert('Trip deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#17a2b8';
      case 'ongoing': return '#ffc107';
      case 'completed': return '#28a745';
      case 'canceled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px' }}>Loading trip management...</div>
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
        <h2 style={{ margin: 0, color: '#2c3e50' }}>🚌 Trip Management</h2>
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
          ➕ Add New Trip
        </button>
      </div>

      {/* Trip Form */}
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
            {editingTrip ? '✏️ Edit Trip' : '➕ Add New Trip'}
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
                  Trip ID:
                </label>
                <input
                  type="text"
                  name="Trip_ID"
                  value={formData.Trip_ID}
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
                  Date:
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
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
                  Start Time:
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
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
                  End Time:
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
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
                  Start Location:
                </label>
                <input
                  type="text"
                  name="start_location"
                  value={formData.start_location}
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
                  Route:
                </label>
                <input
                  type="text"
                  name="route"
                  value={formData.route}
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
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Bus:
                </label>
                <select
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
                >
                  <option value="">Select Bus</option>
                  {buses.map(bus => (
                    <option key={bus._id} value={bus._id}>
                      {bus.busNumber} - {bus.capacity} seats
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Driver:
                </label>
                <select
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} - {driver.licenseNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Coordinator:
                </label>
                <select
                  name="coordinatorId"
                  value={formData.coordinatorId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select Coordinator</option>
                  {coordinators.map(coordinator => (
                    <option key={coordinator._id} value={coordinator._id}>
                      {coordinator.name} - {coordinator.employeeId}
                    </option>
                  ))}
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
                💾 {editingTrip ? 'Update Trip' : 'Create Trip'}
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

      {/* Trips List */}
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
          <h3 style={{ margin: 0, color: '#2c3e50' }}>📋 All Trips ({trips.length})</h3>
        </div>

        {trips.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚌</div>
            <p>No trips found. Create your first trip!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trip ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Route</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Bus</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Driver</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Coordinator</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(trip => (
                  <tr key={trip._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{trip.Trip_ID}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(trip.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {trip.start_time} - {trip.end_time}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {trip.start_location} → {trip.route}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: getStatusColor(trip.status)
                      }}>
                        {trip.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {trip.busId?.busNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {trip.driverId?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {trip.coordinatorId?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(trip)}
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
                        onClick={() => handleDelete(trip._id)}
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

export default TripManagement;
