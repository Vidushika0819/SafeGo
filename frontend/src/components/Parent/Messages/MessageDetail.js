import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const MessageDetail = ({ message, onReply, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replySubject, setReplySubject] = useState('');

  useEffect(() => {
    if (message && message.subject && !message.subject.startsWith('Re:')) {
      setReplySubject(`Re: ${message.subject}`);
    }
  }, [message]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await onReply(message._id, {
        content: replyContent,
        subject: replySubject
      });
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'normal': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'trip_update': return '🚌';
      case 'school_announcement': return '🏫';
      default: return '💬';
    }
  };

  if (!message) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: '#6c757d'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📧</div>
          <p>Select a message to view details</p>
        </div>
      </div>
    );
  }

  const isFromCurrentUser = message.sender._id === user.id;

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
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '5px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {getTypeIcon(message.type)}
              </span>
              <h3 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: '18px'
              }}>
                {message.subject}
              </h3>
              <span style={{
                fontSize: '12px',
                color: getPriorityColor(message.priority),
                backgroundColor: `${getPriorityColor(message.priority)}20`,
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {message.priority}
              </span>
            </div>

            <div style={{
              color: '#7f8c8d',
              fontSize: '14px'
            }}>
              From: {message.sender.firstName} {message.sender.lastName} ({message.sender.role})
              {!isFromCurrentUser && (
                <span style={{ marginLeft: '10px' }}>
                  • To: {message.recipient.firstName} {message.recipient.lastName}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6c757d',
              padding: '5px'
            }}
            title="Close"
          >
            ×
          </button>
        </div>

        <div style={{
          color: '#95a5a6',
          fontSize: '12px'
        }}>
          {formatDate(message.createdAt)}
          {message.status === 'read' && (
            <span style={{ marginLeft: '10px', color: '#27ae60' }}>
              • Read
            </span>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ecf0f1',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          color: '#2c3e50'
        }}>
          {message.content}
        </div>

        {/* Related Information */}
        {(message.relatedChild || message.relatedTrip || message.relatedAssignment) && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f4fd',
            borderRadius: '6px',
            border: '1px solid #bee5eb'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
              Related Information
            </h4>
            {message.relatedChild && (
              <div style={{ marginBottom: '5px', fontSize: '14px' }}>
                <strong>Child:</strong> {message.relatedChild.firstName} {message.relatedChild.lastName}
                {message.relatedChild.grade && ` (Grade ${message.relatedChild.grade})`}
              </div>
            )}
            {message.relatedTrip && (
              <div style={{ marginBottom: '5px', fontSize: '14px' }}>
                <strong>Trip:</strong> {message.relatedTrip.routeName} - {new Date(message.relatedTrip.departureTime).toLocaleDateString()}
              </div>
            )}
            {message.relatedAssignment && (
              <div style={{ fontSize: '14px' }}>
                <strong>Assignment Status:</strong> {message.relatedAssignment.status}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #ecf0f1',
        backgroundColor: '#f8f9fa'
      }}>
        {!isFromCurrentUser && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {showReplyForm ? 'Cancel Reply' : 'Reply'}
            </button>

            <button
              onClick={() => {/* Archive functionality */}}
              style={{
                padding: '10px 20px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Archive
            </button>
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #ecf0f1'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Subject"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}
              />
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleReply}
                disabled={loading || !replyContent.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: loading ? '#95a5a6' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Sending...' : 'Send Reply'}
              </button>
              <button
                onClick={() => setShowReplyForm(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDetail;
