import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';
import MessageCompose from './MessageCompose';

const MessagesManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // list, detail, compose
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    setCurrentView('detail');
  };

  const handleComposeMessage = () => {
    setCurrentView('compose');
  };

  const handleSendMessage = async (messageData) => {
    try {
      const response = await fetch('http://localhost:5005/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Refresh the message list
      setRefreshTrigger(prev => prev + 1);
      setCurrentView('list');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleReplyMessage = async (messageId, replyData) => {
    try {
      const response = await fetch(`http://localhost:5005/api/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(replyData)
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      // Refresh the message list and stay on detail view
      setRefreshTrigger(prev => prev + 1);
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const handleCloseDetail = () => {
    setSelectedMessage(null);
    setCurrentView('list');
  };

  const handleCancelCompose = () => {
    setCurrentView('list');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderBottom: '1px solid #ecf0f1',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 5px 0',
              color: '#2c3e50',
              fontSize: '28px',
              fontWeight: 'bold'
            }}>
              💬 Messages
            </h1>
            <p style={{
              margin: 0,
              color: '#7f8c8d',
              fontSize: '16px'
            }}>
              Communicate with school administrators and coordinators
            </p>
          </div>

          {currentView === 'list' && (
            <button
              onClick={handleComposeMessage}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
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
              <span>✏️</span>
              Compose Message
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: currentView === 'list' ? '1fr' : '350px 1fr',
        gap: '20px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Message List - Always visible in list view, sidebar in detail/compose */}
        {(currentView === 'list' || currentView === 'detail' || currentView === 'compose') && (
          <div style={{
            gridColumn: currentView === 'list' ? '1' : '1',
            height: currentView === 'list' ? 'auto' : 'calc(100vh - 140px)',
            overflow: 'hidden'
          }}>
            <MessageList
              onMessageSelect={handleMessageSelect}
              selectedMessageId={selectedMessage?._id}
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}

        {/* Message Detail or Compose */}
        {currentView === 'detail' && selectedMessage && (
          <div style={{
            height: 'calc(100vh - 140px)',
            overflow: 'hidden'
          }}>
            <MessageDetail
              message={selectedMessage}
              onReply={handleReplyMessage}
              onClose={handleCloseDetail}
            />
          </div>
        )}

        {currentView === 'compose' && (
          <div style={{
            height: 'calc(100vh - 140px)',
            overflow: 'hidden'
          }}>
            <MessageCompose
              onSend={handleSendMessage}
              onCancel={handleCancelCompose}
            />
          </div>
        )}
      </div>

      {/* Navigation Breadcrumb */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setCurrentView('list')}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === 'list' ? '#3498db' : '#ecf0f1',
            color: currentView === 'list' ? 'white' : '#2c3e50',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: currentView === 'list' ? 'bold' : 'normal'
          }}
        >
          📋 Inbox
        </button>

        {currentView === 'detail' && (
          <button
            onClick={() => setCurrentView('detail')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📄 Message
          </button>
        )}

        {currentView === 'compose' && (
          <button
            onClick={() => setCurrentView('compose')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ✏️ Compose
          </button>
        )}
      </div>
    </div>
  );
};

export default MessagesManagement;
