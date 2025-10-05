import React from 'react';

const DashboardWidgets = () => {
  // Mock data - will be replaced with real API data in future stories
  const mockData = {
    children: {
      total: 2,
      active: 2,
      pendingApproval: 0
    },
    trips: {
      today: 2,
      thisWeek: 8,
      active: 1
    },
    stats: {
      messages: 3,
      notifications: 5,
      pendingActions: 1
    },
    system: {
      routes: 12,
      buses: 8,
      drivers: 6
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {/* Children Overview Widget */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #ecf0f1'
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
            👨‍👩‍👧‍👦
          </span>
          <div>
            <h3 style={{
              margin: '0 0 5px 0',
              color: '#2c3e50',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              My Children
            </h3>
            <p style={{
              margin: 0,
              color: '#7f8c8d',
              fontSize: '14px'
            }}>
              Children registered in the system
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#3498db',
              marginBottom: '5px'
            }}>
              {formatNumber(mockData.children.total)}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#7f8c8d'
            }}>
              Total Children
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#27ae60'
              }}></div>
              <span style={{
                fontSize: '12px',
                color: '#27ae60',
                fontWeight: 'bold'
              }}>
                {mockData.children.active} Active
              </span>
            </div>
            {mockData.children.pendingApproval > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f39c12'
                }}></div>
                <span style={{
                  fontSize: '12px',
                  color: '#f39c12',
                  fontWeight: 'bold'
                }}>
                  {mockData.children.pendingApproval} Pending
                </span>
              </div>
            )}
          </div>
        </div>

        <button style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Manage Children
        </button>
      </div>

      {/* Active Trips Widget */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #ecf0f1'
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
            🚌
          </span>
          <div>
            <h3 style={{
              margin: '0 0 5px 0',
              color: '#2c3e50',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Active Trips
            </h3>
            <p style={{
              margin: 0,
              color: '#7f8c8d',
              fontSize: '14px'
            }}>
              Current trip assignments
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#e74c3c',
              marginBottom: '5px'
            }}>
              {formatNumber(mockData.trips.today)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Today
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#27ae60',
              marginBottom: '5px'
            }}>
              {formatNumber(mockData.trips.active)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              In Progress
            </div>
          </div>
        </div>

        <button style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          View All Trips
        </button>
      </div>

      {/* Quick Stats Widget */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #ecf0f1'
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
            📊
          </span>
          <div>
            <h3 style={{
              margin: '0 0 5px 0',
              color: '#2c3e50',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Quick Stats
            </h3>
            <p style={{
              margin: 0,
              color: '#7f8c8d',
              fontSize: '14px'
            }}>
              Overview of your activity
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>💬</span>
              <span style={{ fontSize: '14px', color: '#2c3e50' }}>Unread Messages</span>
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#3498db'
            }}>
              {mockData.stats.messages}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>🔔</span>
              <span style={{ fontSize: '14px', color: '#2c3e50' }}>Notifications</span>
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#f39c12'
            }}>
              {mockData.stats.notifications}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#fff3cd',
            borderRadius: '6px',
            border: '1px solid #ffeaa7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span style={{ fontSize: '14px', color: '#856404' }}>Pending Actions</span>
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#856404'
            }}>
              {mockData.stats.pendingActions}
            </span>
          </div>
        </div>
      </div>

      {/* System Status Widget */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #ecf0f1'
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
            🏫
          </span>
          <div>
            <h3 style={{
              margin: '0 0 5px 0',
              color: '#2c3e50',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              System Status
            </h3>
            <p style={{
              margin: 0,
              color: '#7f8c8d',
              fontSize: '14px'
            }}>
              SafeGo system overview
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#3498db',
              marginBottom: '5px'
            }}>
              {formatNumber(mockData.system.routes)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Routes
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#27ae60',
              marginBottom: '5px'
            }}>
              {formatNumber(mockData.system.buses)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Buses
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#9b59b6',
              marginBottom: '5px'
            }}>
              {formatNumber(mockData.system.drivers)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Drivers
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#27ae60',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '5px'
            }}>
              ✓
            </div>
            <div style={{
              fontSize: '12px',
              color: 'white',
              opacity: 0.9
            }}>
              Online
            </div>
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          borderRadius: '6px',
          border: '1px solid #c3e6cb'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#155724',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            ✅ System Operational
          </div>
          <div style={{
            fontSize: '12px',
            color: '#155724',
            opacity: 0.8
          }}>
            All services running normally
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
