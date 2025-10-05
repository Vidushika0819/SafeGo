import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import TripAssignmentList from './TripAssignmentList';
import TripSelector from './TripSelector';
import AssignmentForm from './AssignmentForm';
import './TripAssignments.css';

const TripAssignmentsManagement = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'select-trip', 'create-form', 'edit-form'
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/api/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChildren(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToTrip = () => {
    setCurrentView('select-trip');
    setSelectedChild(null);
  };

  const handleTripSelected = (selectionData) => {
    // Move to create form with pre-selected data
    setSelectedChild(children.find(c => c._id === selectionData.childId));
    setCurrentView('create-form');
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setCurrentView('edit-form');
  };

  const handleCancelAssignment = () => {
    // Handled by TripAssignmentList component
  };

  const handleSaveAssignment = (assignment) => {
    // Refresh data and go back to list
    setCurrentView('list');
    setSelectedChild(null);
    setSelectedAssignment(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedChild(null);
    setSelectedAssignment(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'select-trip':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={handleCancel} className="back-btn">← Back</button>
              <h2>Assign Child to Trip</h2>
            </div>
            <div className="view-content">
              <div className="child-selection">
                <h3>Select a Child</h3>
                <div className="children-grid">
                  {children.map(child => (
                    <div
                      key={child._id}
                      className={`child-card ${selectedChild?._id === child._id ? 'selected' : ''}`}
                      onClick={() => setSelectedChild(child)}
                    >
                      <div className="child-avatar">
                        {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                      </div>
                      <div className="child-info">
                        <h4>{child.firstName} {child.lastName}</h4>
                        <p>Grade: {child.grade}</p>
                        <p>{child.schoolName}</p>
                      </div>
                      {selectedChild?._id === child._id && (
                        <div className="selection-indicator">✓ Selected</div>
                      )}
                    </div>
                  ))}
                </div>
                {selectedChild && (
                  <div className="next-step">
                    <button
                      onClick={() => setCurrentView('trip-selector')}
                      className="next-btn"
                    >
                      Next: Choose Trip
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'trip-selector':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={() => setCurrentView('select-trip')} className="back-btn">← Back</button>
              <h2>Select Trip for {selectedChild?.firstName}</h2>
            </div>
            <div className="view-content">
              <TripSelector
                selectedChild={selectedChild}
                onTripSelect={handleTripSelected}
                onCancel={() => setCurrentView('select-trip')}
              />
            </div>
          </div>
        );

      case 'create-form':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={handleCancel} className="back-btn">← Back</button>
              <h2>Create Trip Assignment</h2>
            </div>
            <div className="view-content">
              <AssignmentForm
                children={children}
                onSave={handleSaveAssignment}
                onCancel={handleCancel}
              />
            </div>
          </div>
        );

      case 'edit-form':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={handleCancel} className="back-btn">← Back</button>
              <h2>Edit Trip Assignment</h2>
            </div>
            <div className="view-content">
              <AssignmentForm
                assignment={selectedAssignment}
                children={children}
                onSave={handleSaveAssignment}
                onCancel={handleCancel}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="view-container">
            <div className="view-header">
              <h2>Trip Assignments</h2>
              <button onClick={handleAssignToTrip} className="primary-btn">
                + Assign to Trip
              </button>
            </div>
            <div className="view-content">
              <TripAssignmentList
                onEdit={handleEditAssignment}
                onCancel={handleCancelAssignment}
              />
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="trip-assignments-management loading">
        <div className="loading-spinner"></div>
        <p>Loading trip assignments...</p>
      </div>
    );
  }

  return (
    <div className="trip-assignments-management">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Parent Dashboard</span> › <span>Trip Assignments</span>
        </div>
        <div className="page-title">
          <h1>🚐 Trip Assignments</h1>
          <p>Manage transportation assignments for your children</p>
        </div>
      </div>

      <div className="page-content">
        {renderCurrentView()}
      </div>

      {/* Quick Stats Sidebar */}
      <div className="quick-stats-sidebar">
        <div className="stats-card">
          <h4>Children</h4>
          <div className="stat-number">{children.length}</div>
          <p>Registered children</p>
        </div>

        <div className="stats-card">
          <h4>Schools</h4>
          <div className="stat-number">
            {new Set(children.map(c => c.schoolName)).size}
          </div>
          <p>Different schools</p>
        </div>

        <div className="action-card">
          <h4>Quick Actions</h4>
          <button
            onClick={handleAssignToTrip}
            className="action-btn primary"
          >
            + New Assignment
          </button>
          <button
            onClick={() => setCurrentView('list')}
            className="action-btn secondary"
          >
            View All Assignments
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripAssignmentsManagement;
