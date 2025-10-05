import React, { useState } from 'react';

const QuickActions = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleActionClick = (action) => {
    if (action.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmDialog(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action) => {
    // For now, just show an alert - in a real implementation, these would call APIs
    alert(`${action.label} action would be executed here`);
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const quickActions = [
    {
      id: 'add-user',
      label: 'Add New User',
      description: 'Create a new system user account',
      icon: '👤',
      color: '#28a745',
      requiresConfirmation: false
    },
    {
      id: 'view-reports',
      label: 'Generate Report',
      description: 'Create system usage report',
      icon: '📊',
      color: '#17a2b8',
      requiresConfirmation: false
    },
    {
      id: 'system-backup',
      label: 'System Backup',
      description: 'Initiate system data backup',
      icon: '💾',
      color: '#ffc107',
      requiresConfirmation: true
    },
    {
      id: 'clear-cache',
      label: 'Clear System Cache',
      description: 'Clear all system caches',
      icon: '🧹',
      color: '#6c757d',
      requiresConfirmation: true
    },
    {
      id: 'emergency-stop',
      label: 'Emergency Stop',
      description: 'Stop all active trips (emergency only)',
      icon: '🚨',
      color: '#dc3545',
      requiresConfirmation: true
    },
    {
      id: 'system-status',
      label: 'Check System Status',
      description: 'Run system health check',
      icon: '🔍',
      color: '#007bff',
      requiresConfirmation: false
    }
  ];

  return (
    <div>
      {/* Quick Actions Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {quickActions.map((action) => (
          <div
            key={action.id}
            style={{
              backgroundColor: 'white',
              border: `2px solid ${action.color}`,
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => handleActionClick(action)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                fontSize: '2rem',
                marginRight: '1rem'
              }}>
                {action.icon}
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  color: action.color,
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  {action.label}
                </h3>
                <p style={{
                  margin: '0.25rem 0 0 0',
                  color: '#6c757d',
                  fontSize: '0.9rem'
                }}>
                  {action.description}
                </p>
              </div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: action.color,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = action.color === '#dc3545' ? '#c82333' :
                                                         action.color === '#28a745' ? '#218838' :
                                                         action.color === '#007bff' ? '#0069d9' :
                                                         action.color === '#ffc107' ? '#e0a800' :
                                                         action.color === '#17a2b8' ? '#138496' : '#545b62';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = action.color;
              }}
            >
              Execute Action
            </button>

            {action.requiresConfirmation && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                CONFIRMATION REQUIRED
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingAction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: pendingAction.color
            }}>
              {pendingAction.icon}
            </div>

            <h2 style={{
              marginTop: 0,
              color: '#343a40',
              fontSize: '1.3rem'
            }}>
              Confirm Action
            </h2>

            <p style={{
              color: '#6c757d',
              marginBottom: '1.5rem',
              lineHeight: '1.5'
            }}>
              Are you sure you want to <strong>{pendingAction.label.toLowerCase()}</strong>?
              <br />
              <em>{pendingAction.description}</em>
            </p>

            {pendingAction.id === 'emergency-stop' && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid #f5c6cb',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                <strong>⚠️ Warning:</strong> This action will immediately stop all active trips and may cause service disruption. Only use in genuine emergencies.
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelAction}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: pendingAction.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action History */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0, color: '#343a40' }}>Recent Actions</h3>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1rem',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          Action history will be displayed here
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
