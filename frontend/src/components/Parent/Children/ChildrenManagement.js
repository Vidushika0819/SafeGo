import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ParentSidebar from '../ParentSidebar';
import ChildList from './ChildList';
import ChildForm from './ChildForm';

const ChildrenManagement = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [editingChild, setEditingChild] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddChild = () => {
    setEditingChild(null);
    setCurrentView('form');
  };

  const handleEditChild = (child) => {
    setEditingChild(child);
    setCurrentView('form');
  };

  const handleViewChild = (child) => {
    // For now, just show edit form - in future could have separate view mode
    setEditingChild(child);
    setCurrentView('form');
  };

  const handleSaveChild = (savedChild) => {
    setCurrentView('list');
    setEditingChild(null);
    // Trigger refresh of child list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setCurrentView('list');
    setEditingChild(null);
  };

  const handleDeactivateChild = (child) => {
    // Trigger refresh after deactivation
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <ParentSidebar activeSection="children" />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: window.innerWidth <= 768 ? '0' : '280px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {/* Top Header Bar */}
        <header style={{
          backgroundColor: 'white',
          padding: '15px 30px',
          borderBottom: '1px solid #ecf0f1',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Breadcrumb Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#2c3e50'
              }}>
                🏠
              </span>
              <span style={{
                color: '#7f8c8d',
                fontSize: '14px'
              }}>
                Dashboard
              </span>
              <span style={{
                color: '#bdc3c7',
                fontSize: '14px',
                margin: '0 5px'
              }}>
                /
              </span>
              <span style={{
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                My Children
              </span>
            </div>

            {/* User Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  {user?.email?.split('@')[0] || 'Parent'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#7f8c8d'
                }}>
                  Parent Account
                </div>
              </div>

              {/* User Avatar Placeholder */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {user?.email?.charAt(0).toUpperCase() || 'P'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          padding: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {currentView === 'list' ? (
            <ChildList
              key={refreshTrigger} // Force re-render when refresh is triggered
              onEditChild={handleEditChild}
              onViewChild={handleViewChild}
              onDeactivateChild={handleDeactivateChild}
            />
          ) : (
            <ChildForm
              child={editingChild}
              onSave={handleSaveChild}
              onCancel={handleCancelForm}
            />
          )}
        </main>
      </div>

      {/* Mobile Overlay for Sidebar */}
      {window.innerWidth <= 768 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            display: 'none' // Controlled by sidebar component
          }}
          id="mobile-overlay"
        />
      )}
    </div>
  );
};

export default ChildrenManagement;
