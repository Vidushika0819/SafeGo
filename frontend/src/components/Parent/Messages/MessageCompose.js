import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const MessageCompose = ({ onSend, onCancel, preselectedRecipient }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [formData, setFormData] = useState({
    recipientId: preselectedRecipient || '',
    subject: '',
    content: '',
    type: 'general',
    priority: 'normal',
    relatedChild: '',
    relatedTrip: ''
  });
  const [children, setChildren] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetchRecipients();
    fetchChildren();
    fetchTrips();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/messages/recipients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecipients(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/children', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChildren(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const fetchTrips = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll leave it empty
      setTrips([]);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipientId || !formData.subject.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSend(formData);
      // Reset form
      setFormData({
        recipientId: '',
        subject: '',
        content: '',
        type: 'general',
        priority: 'normal',
        relatedChild: '',
        relatedTrip: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #ecf0f1',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#2c3e50' }}>
            Compose Message
          </h3>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6c757d',
              padding: '5px'
            }}
            title="Cancel"
          >
            ×
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Recipient */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              To: *
            </label>
            <select
              value={formData.recipientId}
              onChange={(e) => handleInputChange('recipientId', e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">Select recipient...</option>
              {recipients.map(recipient => (
                <option key={recipient._id} value={recipient._id}>
                  {recipient.firstName} {recipient.lastName} ({recipient.role})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Subject: *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
              placeholder="Enter message subject..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Type and Priority */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Type:
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="general">General</option>
                <option value="trip_update">Trip Update</option>
                <option value="emergency">Emergency</option>
                <option value="school_announcement">School Announcement</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Priority:
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Related Information */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Related Child (Optional):
              </label>
              <select
                value={formData.relatedChild}
                onChange={(e) => handleInputChange('relatedChild', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select child...</option>
                {children.map(child => (
                  <option key={child._id} value={child._id}>
                    {child.firstName} {child.lastName} (Grade {child.grade})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Related Trip (Optional):
              </label>
              <select
                value={formData.relatedTrip}
                onChange={(e) => handleInputChange('relatedTrip', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select trip...</option>
                {trips.map(trip => (
                  <option key={trip._id} value={trip._id}>
                    {trip.routeName} - {new Date(trip.departureTime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Message: *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              required
              placeholder="Type your message here..."
              rows={8}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{
          borderTop: '1px solid #ecf0f1',
          paddingTop: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageCompose;
