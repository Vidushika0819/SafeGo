import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { dailyCheckAPI, monthlyReportAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef(null);
  const [popoverPos, setPopoverPos] = useState({ top: 80, left: null });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      // Fetch daily checks and monthly reports that need admin attention
      const [dailyChecksResponse, monthlyReportsResponse] = await Promise.all([
        dailyCheckAPI.getAll({ adminStatus: 'pending', limit: 10 }),
        monthlyReportAPI.getAll({ adminStatus: 'pending', limit: 10 })
      ]);

      const dailyChecks = dailyChecksResponse.data.dailyChecks || [];
      const monthlyReports = monthlyReportsResponse.data.monthlyReports || [];

      // Combine and format notifications
      const allNotifications = [
        ...dailyChecks.map(check => ({
          id: `daily-${check._id}`,
          type: 'daily_check',
          title: 'Daily Check Submitted',
          message: `Vehicle ${check.vehicleId} - Status: ${check.finalDecision}`,
          driver: check.completedBy,
          date: check.date,
          priority: check.finalDecision !== 'Ready' ? 'high' : 'medium',
          requiresAttention: check.finalDecision !== 'Ready',
          data: check
        })),
        ...monthlyReports.map(report => ({
          id: `monthly-${report._id}`,
          type: 'monthly_report',
          title: 'Monthly Report Submitted',
          message: `Vehicle ${report.vehicleId} - ${report.month}/${report.year}`,
          driver: report.completedBy,
          date: report.date,
          priority: 'medium',
          hasImages: report.images && report.images.length > 0,
          data: report
        }))
      ];

      // Sort by date (newest first)
      allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(allNotifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'daily_check': return <CheckCircle style={{height: 16, width: 16}} />;
      case 'monthly_report': return <FileText style={{height: 16, width: 16}} />;
      default: return <Bell style={{height: 16, width: 16}} />;
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success('Notification marked as read');
  };

  const handleViewDetails = (notification) => {
    // In a real app, this would navigate to detailed view
    toast.info(`Viewing details for ${notification.title}`);
  };

  const openPopover = () => {
    // compute popover position based on bell button location to avoid affecting nav layout
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      const dropdownWidth = 380; // popover width
      
      // Align the dropdown to the right edge of the bell button
      let left = rect.right - dropdownWidth;
      
      // if popover would overflow to the left, shift it right
      if (left < 16) {
        left = 16;
      }
      
      // if popover would overflow to the right, shift it left
      if (left + dropdownWidth > window.innerWidth - 16) {
        left = window.innerWidth - dropdownWidth - 16;
      }
      
      const top = rect.bottom + 12; // a little below the bell for better spacing
      setPopoverPos({ top, left });
    }
    setShowNotifications(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        ref={bellRef}
        onClick={() => (showNotifications ? setShowNotifications(false) : openPopover())}
        style={{
          position: 'relative',
          padding: '8px',
          color: '#fff',
          background: notifications.length > 0 ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = notifications.length > 0 ? 'rgba(59, 130, 246, 0.15)' : 'transparent';
        }}
      >
        <Bell style={{height: 20, width: 20}} />
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            height: '18px',
            minWidth: '18px',
            background: '#ef4444',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: '600',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10
            }}
            onClick={() => setShowNotifications(false)}
          />
          {/* Fixed-position popover (anchored to bell) - does not affect nav layout */}
          <div
            style={{
              position: 'fixed',
              top: popoverPos.top,
              left: popoverPos.left,
              width: 380,
              maxWidth: 'calc(100vw - 32px)',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
              border: '1px solid #d1d5db',
              zIndex: 20,
              maxHeight: '500px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Arrow pointing to notification button */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '20px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #f9fafb',
              filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.1))'
            }} />
            
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Admin Notifications
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                    e.currentTarget.style.color = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <X style={{height: 18, width: 18}} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div style={{
              padding: '8px',
              overflowY: 'auto',
              flex: 1
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px'
                }}>
                  <Bell style={{
                    height: 40,
                    width: 40,
                    color: '#9ca3af',
                    margin: '0 auto 12px auto'
                  }} />
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    margin: 0
                  }}>No new notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '12px',
                      background: 'white',
                      borderRadius: '8px',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div style={{
                      padding: '6px',
                      borderRadius: '50%',
                      background: notification.priority === 'high' ? '#fee2e2' : notification.priority === 'medium' ? '#fef3c7' : '#dcfce7',
                      color: notification.priority === 'high' ? '#dc2626' : notification.priority === 'medium' ? '#d97706' : '#16a34a',
                      flexShrink: 0
                    }}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div style={{
                      flex: 1,
                      minWidth: 0
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}>
                        <h4 style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {notification.title}
                        </h4>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          marginLeft: '8px',
                          flexShrink: 0
                        }}>
                          {new Date(notification.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        margin: '0 0 8px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {notification.message}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <button
                          onClick={() => handleViewDetails(notification)}
                          style={{
                            fontSize: '0.8rem',
                            color: '#3b82f6',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            fontWeight: '500',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          style={{
                            fontSize: '0.8rem',
                            color: '#6b7280',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            fontWeight: '500'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#1f2937'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                        >
                          Mark read
                        </button>
                        {notification.requiresAttention && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: '#fee2e2',
                            color: '#dc2626'
                          }}>
                            <AlertTriangle style={{height: 12, width: 12, marginRight: 4}} />
                            Attention
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid #e5e7eb',
                background: '#f9fafb'
              }}>
                <button
                  onClick={() => {
                    setNotifications([]);
                    toast.success('All notifications marked as read');
                  }}
                  style={{
                    width: '100%',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#3b82f6',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dbeafe';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminNotifications;
