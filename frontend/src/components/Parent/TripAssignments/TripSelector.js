import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const TripSelector = ({ selectedChild, onTripSelect, onCancel }) => {
  const { user } = useAuth();
  const [availableTrips, setAvailableTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [assignmentType, setAssignmentType] = useState('both');

  useEffect(() => {
    if (selectedChild?.schoolName) {
      fetchAvailableTrips(selectedChild.schoolName);
    }
  }, [selectedChild]);

  const fetchAvailableTrips = async (schoolName) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/api/trip-assignments/available/${encodeURIComponent(schoolName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available trips');
      }

      const data = await response.json();
      setAvailableTrips(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
  };

  const handleConfirmSelection = () => {
    if (selectedTrip && assignmentType) {
      onTripSelect({
        childId: selectedChild._id,
        tripId: selectedTrip._id,
        assignmentType,
        trip: selectedTrip
      });
    }
  };

  const getCapacityStatus = (trip) => {
    if (trip.availableSeats === 0) {
      return { status: 'full', text: 'Full', className: 'capacity-full' };
    } else if (trip.availableSeats <= 5) {
      return { status: 'limited', text: 'Limited', className: 'capacity-limited' };
    } else {
      return { status: 'available', text: 'Available', className: 'capacity-available' };
    }
  };

  if (loading) {
    return (
      <div className="trip-selector-loading">
        <div className="loading-spinner"></div>
        <p>Finding available trips for {selectedChild?.schoolName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-selector-error">
        <h3>Error Loading Trips</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => fetchAvailableTrips(selectedChild?.schoolName)} className="retry-btn">
            Try Again
          </button>
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-selector-container">
      <div className="selector-header">
        <h3>Select Trip for {selectedChild?.firstName} {selectedChild?.lastName}</h3>
        <p className="school-info">School: {selectedChild?.schoolName}</p>
      </div>

      {availableTrips.length === 0 ? (
        <div className="no-trips">
          <div className="empty-state">
            <div className="empty-icon">🚌</div>
            <h4>No Available Trips</h4>
            <p>There are currently no available trips for {selectedChild?.schoolName}.</p>
            <p>Please check back later or contact the school administration.</p>
            <button onClick={onCancel} className="cancel-btn">
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="trips-list">
            <h4>Available Trips ({availableTrips.length})</h4>
            <div className="trips-grid">
              {availableTrips.map((trip) => {
                const capacityInfo = getCapacityStatus(trip);
                return (
                  <div
                    key={trip._id}
                    className={`trip-card ${selectedTrip?._id === trip._id ? 'selected' : ''}`}
                    onClick={() => handleTripSelect(trip)}
                  >
                    <div className="trip-header">
                      <div className="trip-id">
                        <strong>{trip.Trip_ID}</strong>
                      </div>
                      <div className={`capacity-badge ${capacityInfo.className}`}>
                        {capacityInfo.text}
                      </div>
                    </div>

                    <div className="trip-details">
                      <div className="trip-info-row">
                        <span className="label">Date:</span>
                        <span className="value">{new Date(trip.date).toLocaleDateString()}</span>
                      </div>
                      <div className="trip-info-row">
                        <span className="label">Time:</span>
                        <span className="value">{trip.start_time} - {trip.end_time}</span>
                      </div>
                      <div className="trip-info-row">
                        <span className="label">Route:</span>
                        <span className="value">{trip.route}</span>
                      </div>
                      <div className="trip-info-row">
                        <span className="label">Bus:</span>
                        <span className="value">{trip.busId?.busNumber || 'TBD'}</span>
                      </div>
                      <div className="trip-info-row">
                        <span className="label">Driver:</span>
                        <span className="value">{trip.driverId?.name || 'TBD'}</span>
                      </div>
                      <div className="trip-info-row">
                        <span className="label">Capacity:</span>
                        <span className="value">
                          {trip.currentAssignments}/{trip.capacity} ({trip.availableSeats} available)
                        </span>
                      </div>
                    </div>

                    {selectedTrip?._id === trip._id && (
                      <div className="selection-indicator">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedTrip && (
            <div className="assignment-options">
              <h4>Assignment Type</h4>
              <div className="assignment-type-selector">
                <label className="type-option">
                  <input
                    type="radio"
                    value="pickup"
                    checked={assignmentType === 'pickup'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  <span className="type-label">Pickup Only</span>
                  <span className="type-description">Morning pickup from home to school</span>
                </label>

                <label className="type-option">
                  <input
                    type="radio"
                    value="dropoff"
                    checked={assignmentType === 'dropoff'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  <span className="type-label">Drop-off Only</span>
                  <span className="type-description">Afternoon drop-off from school to home</span>
                </label>

                <label className="type-option">
                  <input
                    type="radio"
                    value="both"
                    checked={assignmentType === 'both'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                  />
                  <span className="type-label">Round Trip</span>
                  <span className="type-description">Both pickup and drop-off</span>
                </label>
              </div>
            </div>
          )}

          <div className="selector-actions">
            <button onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedTrip}
              className="confirm-btn"
            >
              {selectedTrip ? 'Confirm Assignment' : 'Select a Trip'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TripSelector;
