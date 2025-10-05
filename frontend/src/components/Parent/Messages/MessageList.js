import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const MessageList = ({ onMessageSelect, selectedMessageId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, sent

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'sent' ? '/api/messages/sent' : '/api/messages';
      const params = filter === 'unread' ? '?status=delivered' : '';

      const response = await fetch(`http://localhost:5005${endpoint}${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
        Error: {error}
      </div>
    );
  }

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
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Messages</h3>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { key: 'all', label: 'All Messages' },
            { key: 'unread', label: 'Unread' },
            { key: 'sent', label: 'Sent' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: filter === key ? '#3498db' : '#ecf0f1',
                color: filter === key ? 'white' : '#2c3e50',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: filter === key ? 'bold' : 'normal'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: messages.length === 0 ? '40px 20px' : '0'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6c757d' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</div>
            <p>No messages found</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              onClick={() => onMessageSelect(message)}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid #ecf0f1',
                cursor: 'pointer',
                backgroundColor: selectedMessageId === message._id ? '#e3f2fd' : 'white',
                transition: 'background-color 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedMessageId !== message._id) {
                  e.target.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMessageId !== message._id) {
                  e.target.style.backgroundColor = 'white';
                }
              }}
            >
              {/* Unread indicator */}
              {message.status === 'delivered' && (
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '15px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3498db'
                }} />
              )}

              <div style={{ marginLeft: '15px' }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>
                      {getTypeIcon(message.type)}
                    </span>
                    <span style={{
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      fontSize: '14px'
                    }}>
                      {filter === 'sent' ? message.recipient.firstName + ' ' + message.recipient.lastName : message.sender.firstName + ' ' + message.sender.lastName}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: getPriorityColor(message.priority),
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {message.priority}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#7f8c8d'
                  }}>
                    {formatDate(message.createdAt)}
                  </span>
                </div>

                {/* Subject */}
                <div style={{
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  marginBottom: '5px',
                  fontSize: '14px'
                }}>
                  {message.subject}
                </div>

                {/* Preview */}
                <div style={{
                  color: '#7f8c8d',
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {message.content.length > 100
                    ? message.content.substring(0, 100) + '...'
                    : message.content
                  }
                </div>

                {/* Status */}
                <div style={{
                  marginTop: '5px',
                  fontSize: '11px',
                  color: '#95a5a6'
                }}>
                  {message.status === 'sent' && 'Sent'}
                  {message.status === 'delivered' && 'Delivered'}
                  {message.status === 'read' && 'Read'}
                  {message.status === 'replied' && 'Replied'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageList;
