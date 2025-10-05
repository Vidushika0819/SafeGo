import React from 'react';

const ActivityFeed = () => {
  // Mock activity data - will be replaced with real API data in future stories
  const mockActivities = [
    {
      id: 1,
      type: 'trip_started',
      title: 'Morning Pickup Started',
      description: 'Sarah Johnson\'s morning route has begun',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'in_progress',
      icon: '🚌',
      color: '#3498db'
    },
    {
      id: 2,
      type: 'child_picked_up',
      title: 'Child Picked Up',
      description: 'Emma Johnson was picked up at 7:45 AM',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'completed',
      icon: '✅',
      color: '#27ae60'
    },
    {
      id: 3,
      type: 'message_received',
      title: 'Message from Administrator',
      description: 'Route delay notification sent',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'unread',
      icon: '💬',
      color: '#f39c12'
    },
    {
      id: 4,
      type: 'trip_completed',
      title: 'Afternoon Drop-off Completed',
      description: 'All children safely delivered home',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'completed',
      icon: '🏠',
      color: '#27ae60'
    },
    {
      id: 5,
      type: 'system_update',
      title: 'System Maintenance',
      description: 'Scheduled maintenance completed successfully',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: 'info',
      icon: '🔧',
      color: '#95a5a6'
    },
    {
      id: 6,
      type: 'trip_scheduled',
      title: 'New Trip Scheduled',
      description: 'Additional afternoon route added for tomorrow',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'info',
      icon: '📅',
      color: '#9b59b6'
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_progress: { label: 'In Progress', color: '#3498db', bgColor: '#d4e6f1' },
      completed: { label: 'Completed', color: '#27ae60', bgColor: '#d5f4e6' },
      unread: { label: 'Unread', color: '#f39c12', bgColor: '#fff3cd' },
      info: { label: 'Info', color: '#95a5a6', bgColor: '#ecf0f1' }
    };

    const config = statusConfig[status] || statusConfig.info;

    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        backgroundColor: config.bgColor,
        color: config.color,
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {config.label}
      </span>
    );
  };

  return (
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
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '24px',
            marginRight: '12px'
          }}>
            📋
          </span>
          <div>
            <h3 style={{
              margin: '0 0 5px 0',
              color: '#2c3e50',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              Recent Activity
            </h3>
            <p style={{
              margin: 0,
              color: '#7f8c8d',
              fontSize: '14px'
            }}>
              Latest updates on your children's transportation
            </p>
          </div>
        </div>

        <button style={{
          padding: '8px 16px',
          backgroundColor: '#f8f9fa',
          color: '#2c3e50',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>🔄</span>
          Refresh
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px',
              backgroundColor: activity.status === 'unread' ? '#fffbf0' : '#f8f9fa',
              borderRadius: '8px',
              border: activity.status === 'unread' ? '1px solid #ffeaa7' : '1px solid #e9ecef',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {/* Activity Icon */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: `${activity.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              marginRight: '16px',
              flexShrink: 0
            }}>
              {activity.icon}
            </div>

            {/* Activity Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <h4 style={{
                  margin: 0,
                  color: '#2c3e50',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {activity.title}
                </h4>
                {getStatusBadge(activity.status)}
              </div>

              <p style={{
                margin: '4px 0',
                color: '#7f8c8d',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {activity.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                <span style={{
                  color: '#95a5a6',
                  fontSize: '12px'
                }}>
                  {formatTimeAgo(activity.timestamp)}
                </span>

                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  {activity.type === 'message_received' && (
                    <button style={{
                      padding: '4px 12px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      View Message
                    </button>
                  )}

                  {activity.type.includes('trip') && (
                    <button style={{
                      padding: '4px 12px',
                      backgroundColor: 'transparent',
                      color: '#3498db',
                      border: '1px solid #3498db',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #ecf0f1'
      }}>
        <button style={{
          padding: '12px 24px',
          backgroundColor: '#f8f9fa',
          color: '#2c3e50',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '0 auto'
        }}>
          <span>📜</span>
          Load More Activities
        </button>
      </div>

      {/* Activity Filters */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '16px',
            marginRight: '8px'
          }}>
            🔍
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Filter Activities
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {['All', 'Trips', 'Messages', 'System'].map((filter) => (
            <button
              key={filter}
              style={{
                padding: '6px 12px',
                backgroundColor: filter === 'All' ? '#3498db' : 'white',
                color: filter === 'All' ? 'white' : '#2c3e50',
                border: '1px solid #dee2e6',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
