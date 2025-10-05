import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import ChildCard from './ChildCard';

const ChildList = ({ onEditChild, onViewChild, onDeactivateChild }) => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5005/api/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = `Failed to fetch children: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.success) {
        setChildren(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch children');
      }
    } catch (err) {
      console.error('Error fetching children:', err);

      // If token is invalid/expired, logout and redirect to login
      if (err.message.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        return;
      }

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const filteredChildren = children.filter(child => {
    switch (filter) {
      case 'active':
        return child.status === 'active';
      case 'inactive':
        return child.status === 'inactive';
      default:
        return true;
    }
  });

  const handleDeactivateChild = async (child) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/api/children/${child._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate child');
      }

      // Refresh the children list
      await fetchChildren();
    } catch (err) {
      console.error('Error deactivating child:', err);
      alert('Failed to deactivate child. Please try again.');
    }
  };

  const handleReactivateChild = async (child) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5005/api/children/${child._id}/reactivate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate child');
      }

      // Refresh the children list
      await fetchChildren();
    } catch (err) {
      console.error('Error reactivating child:', err);
      alert('Failed to reactivate child. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>
            👨‍👩‍👧‍👦
          </div>
          <div style={{
            fontSize: '18px',
            color: '#7f8c8d'
          }}>
            Loading your children...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #f5c6cb',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '15px'
        }}>
          ⚠️
        </div>
        <h3 style={{
          margin: '0 0 10px 0',
          color: '#721c24'
        }}>
          Error Loading Children
        </h3>
        <p style={{
          margin: '0 0 20px 0'
        }}>
          {error}
        </p>
        <button
          onClick={fetchChildren}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with stats and filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{
            margin: '0 0 10px 0',
            color: '#2c3e50',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            My Children
          </h2>
          <p style={{
            margin: 0,
            color: '#7f8c8d',
            fontSize: '16px'
          }}>
            Manage your children's transportation information
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #ecf0f1'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#3498db',
              marginBottom: '5px'
            }}>
              {children.filter(c => c.status === 'active').length}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Active
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #ecf0f1'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#95a5a6',
              marginBottom: '5px'
            }}>
              {children.filter(c => c.status === 'inactive').length}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Inactive
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #ecf0f1'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '5px'
            }}>
              {children.length}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              Total
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Filter:
          </span>

          {['all', 'active', 'inactive'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === filterOption ? '#3498db' : 'white',
                color: filter === filterOption ? 'white' : '#2c3e50',
                border: filter === filterOption ? '1px solid #3498db' : '1px solid #dee2e6',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Add Child Button - Always visible when viewing all children */}
      {filter === 'all' && (
        <div style={{
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => onEditChild?.(null)}
            style={{
              padding: '15px 30px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            <span>➕</span>
            {children.length === 0 ? 'Add Your First Child' : 'Add Another Child'}
          </button>
        </div>
      )}

      {/* Children Grid */}
      {filteredChildren.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #ecf0f1'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>
            👨‍👩‍👧‍👦
          </div>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#2c3e50',
            fontSize: '24px'
          }}>
            {filter === 'all' ? 'No Children Added Yet' : `No ${filter} Children`}
          </h3>
          <p style={{
            margin: '0 0 30px 0',
            color: '#7f8c8d',
            fontSize: '16px',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {filter === 'all'
              ? 'Start by adding your first child to manage their transportation information.'
              : `No children match the "${filter}" filter.`
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {filteredChildren.map((child) => (
            <ChildCard
              key={child._id}
              child={child}
              onEdit={() => onEditChild?.(child)}
              onView={() => onViewChild?.(child)}
              onDeactivate={() => handleDeactivateChild(child)}
              onReactivate={() => handleReactivateChild(child)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildList;
