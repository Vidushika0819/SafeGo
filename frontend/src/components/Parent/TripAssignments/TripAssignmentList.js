import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './TripAssignments.css';

const TripAssignmentList = ({ onEdit, onCancel }) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAssignments();
    fetchStats();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/api/trip-assignments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const data = await response.json();
      setAssignments(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/api/trip-assignments/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleCancelAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to cancel this trip assignment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/api/trip-assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Cancelled by parent' })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel assignment');
      }

      // Refresh assignments
      fetchAssignments();
      fetchStats();
    } catch (err) {
      alert('Failed to cancel assignment: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      canceled: 'status-canceled',
      completed: 'status-completed'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getAssignmentTypeBadge = (type) => {
    const typeClasses = {
      pickup: 'type-pickup',
      dropoff: 'type-dropoff',
      both: 'type-both'
    };

    const typeLabels = {
      pickup: 'Pickup',
      dropoff: 'Drop-off',
      both: 'Round Trip'
    };

    return (
      <span className={`type-badge ${typeClasses[type] || 'type-default'}`}>
        {typeLabels[type] || type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="trip-assignments-loading">
        <div className="loading-spinner"></div>
        <p>Loading trip assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-assignments-error">
        <h3>Error Loading Assignments</h3>
        <p>{error}</p>
        <button onClick={fetchAssignments} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="trip-assignments-container">
      <div className="assignments-header">
        <h2>Trip Assignments</h2>
        {stats && (
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.canceled}</span>
              <span className="stat-label">Canceled</span>
            </div>
          </div>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="no-assignments">
          <div className="empty-state">
            <div className="empty-icon">🚌</div>
            <h3>No Trip Assignments</h3>
            <p>You haven't assigned any children to trips yet.</p>
            <p>Click "Assign to Trip" to get started.</p>
          </div>
        </div>
      ) : (
        <div className="assignments-grid">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="assignment-card">
              <div className="assignment-header">
                <div className="child-info">
                  <h4>{assignment.child?.firstName} {assignment.child?.lastName}</h4>
                  <p className="child-grade">Grade: {assignment.child?.grade}</p>
                  <p className="child-school">{assignment.child?.schoolName}</p>
                </div>
                <div className="assignment-badges">
                  {getStatusBadge(assignment.status)}
                  {getAssignmentTypeBadge(assignment.assignmentType)}
                </div>
              </div>

              <div className="trip-info">
                <div className="trip-details">
                  <p><strong>Trip ID:</strong> {assignment.trip?.Trip_ID}</p>
                  <p><strong>Date:</strong> {new Date(assignment.trip?.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {assignment.trip?.start_time} - {assignment.trip?.end_time}</p>
                  <p><strong>Route:</strong> {assignment.trip?.route}</p>
                  <p><strong>Status:</strong> {assignment.trip?.status}</p>
                </div>
              </div>

              <div className="assignment-meta">
                <p><strong>Assigned:</strong> {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                {assignment.notes && (
                  <p><strong>Notes:</strong> {assignment.notes}</p>
                )}
              </div>

              {assignment.status === 'active' && (
                <div className="assignment-actions">
                  <button
                    onClick={() => onEdit && onEdit(assignment)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCancelAssignment(assignment._id)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripAssignmentList;
