import React from 'react';

const QuickActions = ({ onNavigate }) => {
  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-child':
        if (onNavigate) {
          onNavigate('children');
        }
        break;
      case 'view-trips':
        if (onNavigate) {
          onNavigate('trips');
        }
        break;
      case 'contact-admin':
        alert('Contact Administrator will be implemented in Story 3.5: Parent Communication System');
        break;
      case 'update-profile':
        alert('Profile Management will be implemented in future updates');
        break;
      default:
        alert(`Action "${action}" will be implemented in future stories`);
    }
  };

  const quickActions = [
    {
      id: 'add-child',
      title: 'Add New Child',
      description: 'Register a new child for transportation services',
      icon: '👶',
      color: '#3498db',
      bgColor: '#ecf0f1'
    },
    {
      id: 'view-trips',
      title: 'View Available Trips',
      description: 'Browse and assign children to transportation routes',
      icon: '🚌',
      color: '#27ae60',
      bgColor: '#d5f4e6'
    },
    {
      id: 'contact-admin',
      title: 'Contact Administrator',
      description: 'Send messages to school administrators',
      icon: '💬',
      color: '#f39c12',
      bgColor: '#fff3cd'
    },
    {
      id: 'update-profile',
      title: 'Update Profile',
      description: 'Manage your account settings and preferences',
      icon: '⚙️',
      color: '#9b59b6',
      bgColor: '#f5e6ff'
    }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #ecf0f1',
      marginBottom: '30px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <span style={{
          fontSize: '24px',
          marginRight: '12px'
        }}>
          ⚡
        </span>
        <div>
          <h3 style={{
            margin: '0 0 5px 0',
            color: '#2c3e50',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            Quick Actions
          </h3>
          <p style={{
            margin: 0,
            color: '#7f8c8d',
            fontSize: '14px'
          }}>
            Common tasks and shortcuts for managing your children's transportation
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {quickActions.map((action) => (
          <div
            key={action.id}
            onClick={() => handleQuickAction(action.id)}
            style={{
              padding: '20px',
              backgroundColor: action.bgColor,
              borderRadius: '10px',
              border: `2px solid ${action.color}20`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '140px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.target.style.borderColor = action.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = `${action.color}20`;
            }}
          >
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: `${action.color}15`,
              opacity: 0.3
            }} />

            {/* Icon */}
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 1
            }}>
              {action.icon}
            </div>

            {/* Title */}
            <h4 style={{
              margin: '0 0 8px 0',
              color: '#2c3e50',
              fontSize: '16px',
              fontWeight: 'bold',
              position: 'relative',
              zIndex: 1
            }}>
              {action.title}
            </h4>

            {/* Description */}
            <p style={{
              margin: 0,
              color: '#7f8c8d',
              fontSize: '13px',
              lineHeight: '1.4',
              position: 'relative',
              zIndex: 1
            }}>
              {action.description}
            </p>

            {/* Action indicator */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: action.color,
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              →
            </div>
          </div>
        ))}
      </div>

      {/* Additional Actions Row */}
      <div style={{
        marginTop: '25px',
        paddingTop: '20px',
        borderTop: '1px solid #ecf0f1',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => handleQuickAction('emergency-contact')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🚨</span>
          Emergency Contact
        </button>

        <button
          onClick={() => handleQuickAction('trip-history')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>📚</span>
          Trip History
        </button>

        <button
          onClick={() => handleQuickAction('notifications')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🔔</span>
          Notification Settings
        </button>
      </div>

      {/* Help Section */}
      <div style={{
        marginTop: '25px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <span style={{
            fontSize: '20px',
            marginRight: '10px'
          }}>
            ❓
          </span>
          <h4 style={{
            margin: 0,
            color: '#2c3e50',
            fontSize: '16px'
          }}>
            Need Help?
          </h4>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '5px'
            }}>
              📞 Support Hotline
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Call 1-800-SAFEGO for immediate assistance
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '5px'
            }}>
              📧 Email Support
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              support@safego.com - Response within 24 hours
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '5px'
            }}>
              📖 User Guide
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Access our comprehensive parent guide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
