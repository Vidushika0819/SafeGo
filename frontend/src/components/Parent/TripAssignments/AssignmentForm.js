import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const AssignmentForm = ({ assignment, children, onSave, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    childId: '',
    tripId: '',
    assignmentType: 'both',
    notes: '',
    emergencyContactOverride: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [availableTrips, setAvailableTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (assignment) {
      // Editing existing assignment
      setFormData({
        childId: assignment.child._id,
        tripId: assignment.trip._id,
        assignmentType: assignment.assignmentType,
        notes: assignment.notes || '',
        emergencyContactOverride: assignment.emergencyContactOverride || {
          name: '',
          phone: '',
          relationship: ''
        }
      });
      setSelectedChild(assignment.child);
    }
  }, [assignment]);

  useEffect(() => {
    if (formData.childId) {
      const child = children.find(c => c._id === formData.childId);
      setSelectedChild(child);
      if (child?.schoolName) {
        fetchAvailableTrips(child.schoolName);
      }
    }
  }, [formData.childId, children]);

  const fetchAvailableTrips = async (schoolName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/api/trip-assignments/available/${encodeURIComponent(schoolName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableTrips(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch available trips:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContactOverride: {
        ...prev.emergencyContactOverride,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.childId) {
      newErrors.childId = 'Please select a child';
    }

    if (!formData.tripId) {
      newErrors.tripId = 'Please select a trip';
    }

    if (!formData.assignmentType) {
      newErrors.assignmentType = 'Please select assignment type';
    }

    // Validate emergency contact if provided
    if (formData.emergencyContactOverride.name ||
        formData.emergencyContactOverride.phone ||
        formData.emergencyContactOverride.relationship) {
      if (!formData.emergencyContactOverride.name) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
      }
      if (!formData.emergencyContactOverride.phone) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      }
      if (!formData.emergencyContactOverride.relationship) {
        newErrors.emergencyContactRelationship = 'Emergency contact relationship is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = assignment
        ? `http://localhost:5005/api/trip-assignments/${assignment._id}`
        : 'http://localhost:5005/api/trip-assignments';

      const method = assignment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save assignment');
      }

      const data = await response.json();
      onSave(data.data);
    } catch (err) {
      alert('Failed to save assignment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-form-container">
      <div className="form-header">
        <h3>{assignment ? 'Edit Trip Assignment' : 'Create Trip Assignment'}</h3>
        <p>Assign your child to a transportation trip</p>
      </div>

      <form onSubmit={handleSubmit} className="assignment-form">
        {/* Child Selection */}
        <div className="form-group">
          <label htmlFor="childId">Select Child *</label>
          <select
            id="childId"
            value={formData.childId}
            onChange={(e) => handleInputChange('childId', e.target.value)}
            disabled={assignment} // Can't change child when editing
            className={errors.childId ? 'error' : ''}
          >
            <option value="">Choose a child...</option>
            {children.map(child => (
              <option key={child._id} value={child._id}>
                {child.firstName} {child.lastName} - {child.schoolName} (Grade: {child.grade})
              </option>
            ))}
          </select>
          {errors.childId && <span className="error-message">{errors.childId}</span>}
        </div>

        {/* Trip Selection */}
        {selectedChild && (
          <div className="form-group">
            <label htmlFor="tripId">Select Trip *</label>
            <select
              id="tripId"
              value={formData.tripId}
              onChange={(e) => handleInputChange('tripId', e.target.value)}
              disabled={assignment} // Can't change trip when editing
              className={errors.tripId ? 'error' : ''}
            >
              <option value="">Choose a trip...</option>
              {availableTrips.map(trip => (
                <option key={trip._id} value={trip._id}>
                  {trip.Trip_ID} - {new Date(trip.date).toLocaleDateString()} ({trip.start_time} - {trip.end_time})
                  {trip.availableSeats === 0 ? ' - FULL' : ` - ${trip.availableSeats} seats available`}
                </option>
              ))}
            </select>
            {errors.tripId && <span className="error-message">{errors.tripId}</span>}
            {availableTrips.length === 0 && (
              <p className="info-message">No available trips found for {selectedChild.schoolName}</p>
            )}
          </div>
        )}

        {/* Assignment Type */}
        <div className="form-group">
          <label>Assignment Type *</label>
          <div className="assignment-type-options">
            <label className="option">
              <input
                type="radio"
                value="pickup"
                checked={formData.assignmentType === 'pickup'}
                onChange={(e) => handleInputChange('assignmentType', e.target.value)}
              />
              <span className="option-label">Pickup Only</span>
              <span className="option-desc">Morning pickup from home to school</span>
            </label>

            <label className="option">
              <input
                type="radio"
                value="dropoff"
                checked={formData.assignmentType === 'dropoff'}
                onChange={(e) => handleInputChange('assignmentType', e.target.value)}
              />
              <span className="option-label">Drop-off Only</span>
              <span className="option-desc">Afternoon drop-off from school to home</span>
            </label>

            <label className="option">
              <input
                type="radio"
                value="both"
                checked={formData.assignmentType === 'both'}
                onChange={(e) => handleInputChange('assignmentType', e.target.value)}
              />
              <span className="option-label">Round Trip</span>
              <span className="option-desc">Both pickup and drop-off</span>
            </label>
          </div>
          {errors.assignmentType && <span className="error-message">{errors.assignmentType}</span>}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any special instructions or notes..."
            rows={3}
            maxLength={500}
          />
          <small className="char-count">{formData.notes.length}/500 characters</small>
        </div>

        {/* Emergency Contact Override */}
        <div className="form-group emergency-contact-section">
          <label>Emergency Contact Override (Optional)</label>
          <p className="section-desc">Override the default emergency contacts for this specific trip</p>

          <div className="emergency-contact-fields">
            <div className="field-row">
              <div className="field">
                <label htmlFor="emergencyName">Name</label>
                <input
                  type="text"
                  id="emergencyName"
                  value={formData.emergencyContactOverride.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  className={errors.emergencyContactName ? 'error' : ''}
                />
                {errors.emergencyContactName && <span className="error-message">{errors.emergencyContactName}</span>}
              </div>

              <div className="field">
                <label htmlFor="emergencyPhone">Phone</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  value={formData.emergencyContactOverride.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  placeholder="123-456-7890"
                  className={errors.emergencyContactPhone ? 'error' : ''}
                />
                {errors.emergencyContactPhone && <span className="error-message">{errors.emergencyContactPhone}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="emergencyRelationship">Relationship</label>
              <input
                type="text"
                id="emergencyRelationship"
                value={formData.emergencyContactOverride.relationship}
                onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                placeholder="e.g., Aunt, Uncle, Neighbor"
                className={errors.emergencyContactRelationship ? 'error' : ''}
              />
              {errors.emergencyContactRelationship && <span className="error-message">{errors.emergencyContactRelationship}</span>}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Saving...' : (assignment ? 'Update Assignment' : 'Create Assignment')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
