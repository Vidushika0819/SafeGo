import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalBuses: 0,
    totalCoordinators: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:5005/api/admin/stats');

      if (response.data.success) {
        setStats(response.data.data);
        setLastRefresh(new Date());
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  if (isLoading && !stats.totalUsers) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: '#6c757d'
      }}>
        Loading statistics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '4px',
        border: '1px solid #f5c6cb'
      }}>
        <strong>Error:</strong> {error}
        <button
          onClick={handleRefresh}
          style={{
            marginLeft: '1rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Refresh Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {isLoading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Total Users */}
        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '0.5rem'
          }}>
            👥
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '0.5rem'
          }}>
            {stats.totalUsers}
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: '#495057',
            fontWeight: '500'
          }}>
            Total Users
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            marginTop: '0.25rem'
          }}>
            Registered system users
          </div>
        </div>

        {/* Total Trips */}
        <div style={{
          backgroundColor: '#e8f5e8',
          border: '1px solid #c3e6c3',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#28a745',
            marginBottom: '0.5rem'
          }}>
            🚌
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#28a745',
            marginBottom: '0.5rem'
          }}>
            {stats.totalTrips}
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: '#495057',
            fontWeight: '500'
          }}>
            Total Trips
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            marginTop: '0.25rem'
          }}>
            All scheduled trips
          </div>
        </div>

        {/* Total Buses */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#ffc107',
            marginBottom: '0.5rem'
          }}>
            🚐
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ffc107',
            marginBottom: '0.5rem'
          }}>
            {stats.totalBuses}
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: '#495057',
            fontWeight: '500'
          }}>
            Total Buses
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            marginTop: '0.25rem'
          }}>
            Available fleet vehicles
          </div>
        </div>

        {/* Total Coordinators */}
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#dc3545',
            marginBottom: '0.5rem'
          }}>
            👨‍💼
          </div>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#dc3545',
            marginBottom: '0.5rem'
          }}>
            {stats.totalCoordinators}
          </div>
          <div style={{
            fontSize: '1.1rem',
            color: '#495057',
            fontWeight: '500'
          }}>
            Total Coordinators
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            marginTop: '0.25rem'
          }}>
            Active trip coordinators
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0, color: '#343a40' }}>System Summary</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          fontSize: '0.9rem'
        }}>
          <div>
            <strong>Average trips per bus:</strong> {stats.totalBuses > 0 ? (stats.totalTrips / stats.totalBuses).toFixed(1) : 'N/A'}
          </div>
          <div>
            <strong>Users per coordinator:</strong> {stats.totalCoordinators > 0 ? (stats.totalUsers / stats.totalCoordinators).toFixed(1) : 'N/A'}
          </div>
          <div>
            <strong>Fleet utilization:</strong> {stats.totalBuses > 0 ? `${((stats.totalTrips / stats.totalBuses) * 100).toFixed(0)}%` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
