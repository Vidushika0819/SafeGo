import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Plus, UserPlus, Bus, Armchair, MessageSquare, Settings, AlertTriangle, History, Bell } from 'lucide-react';

const QuickActions = ({ onNavigate }) => {
  const [bookingChild, setBookingChild] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(3); // Mock data

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
      case 'book-seat':
        handleBookSeat();
        break;
      case 'contact-admin':
        if (onNavigate) {
          onNavigate('messages');
        }
        break;
      case 'update-profile':
        if (onNavigate) {
          onNavigate('profile');
        }
        break;
      case 'notifications':
        if (onNavigate) {
          onNavigate('notifications');
        }
        break;
      case 'trip-history':
        if (onNavigate) {
          onNavigate('trips');
        }
        break;
      case 'emergency-contact':
        handleEmergencyContact();
        break;
      default:
        console.log(`Action "${action}" clicked`);
    }
  };

  const handleBookSeat = async () => {
    try {
      // First get available children
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/api/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const unassignedChildren = data.data.filter(child => !child.tripAssigned);

        if (unassignedChildren.length === 0) {
          alert('All your children are already assigned to trips. Please check the trips section for updates.');
          return;
        }

        // Get available trips
        const tripResponse = await fetch('http://localhost:5005/api/trips/available', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (tripResponse.ok) {
          const tripData = await tripResponse.json();
          const availableTrips = tripData.data.filter(trip => trip.availableSeats > 0);

          if (availableTrips.length === 0) {
            alert('No trips with available seats found. Please contact the administrator.');
            return;
          }

          // Auto-assign first available child to first available trip
          const childToAssign = unassignedChildren[0];
          const tripToAssign = availableTrips[0];

          const assignResponse = await fetch('http://localhost:5005/api/trip-assignments', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              childId: childToAssign._id,
              tripId: tripToAssign._id,
              assignedBy: 'parent-auto'
            })
          });

          if (assignResponse.ok) {
            alert(`🎉 Successfully booked a seat!\n\n${childToAssign.firstName} ${childToAssign.lastName} has been assigned to ${tripToAssign.routeName} on ${new Date(tripToAssign.departureTime).toLocaleDateString()}.\n\nDeparture: ${new Date(tripToAssign.departureTime).toLocaleTimeString()}`);
            setAvailableSeats(prev => prev - 1);

            // Navigate to trips to show the assignment
            if (onNavigate) {
              onNavigate('trips');
            }
          } else {
            const errorData = await assignResponse.json();
            alert(`Failed to book seat: ${errorData.message || 'Unknown error'}`);
          }
        } else {
          alert('Failed to load available trips. Please try again.');
        }
      } else {
        alert('Failed to load children information. Please try again.');
      }
    } catch (error) {
      console.error('Error booking seat:', error);
      alert('Network error occurred. Please check your connection and try again.');
    }
  };

  const handleEmergencyContact = () => {
    alert('🚨 EMERGENCY CONTACT\n\nIf you have an immediate safety concern:\n\n📞 Call: (555) 123-HELP\n📧 Email: emergency@safego.com\n\nFor non-emergency issues, please use the Messages section.');
  };

  const quickActions = [
    {
      id: 'book-seat',
      title: 'Book a Seat Today',
      description: 'Instantly assign your child to an available trip',
      icon: <Armchair className="w-6 h-6" />,
      color: 'primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      iconBg: 'bg-primary-100',
      available: availableSeats > 0,
      badge: `${availableSeats} seats available`
    },
    {
      id: 'add-child',
      title: 'Add New Child',
      description: 'Register a new child for transportation services',
      icon: <UserPlus className="w-6 h-6" />,
      color: 'primary',
      bgColor: 'bg-neutral-50',
      borderColor: 'border-neutral-200',
      iconBg: 'bg-neutral-100'
    },
    {
      id: 'view-trips',
      title: 'View Active Trips',
      description: 'Monitor current and upcoming transportation',
      icon: <Bus className="w-6 h-6" />,
      color: 'success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconBg: 'bg-success-100'
    },
    {
      id: 'contact-admin',
      title: 'Contact Admin',
      description: 'Send messages to school administrators',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'secondary',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
      iconBg: 'bg-secondary-100'
    }
  ];

  const secondaryActions = [
    {
      id: 'trip-history',
      title: 'Trip History',
      description: 'View past transportation records',
      icon: <History className="w-4 h-4" />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: <Bell className="w-4 h-4" />
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
