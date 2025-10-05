import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import UserList from './UserList';
import UserFilters from './UserFilters';
import UserForm from './UserForm';
import axios from 'axios';

const UserManagement = () => {
  const { isAdmin, getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/login';
      return;
    }
    fetchUsers();
  }, [isAdmin, filters, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });

      const response = await axios.get(
        `http://localhost:5005/api/admin/users?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateUser = () => {
    setShowCreateForm(true);
    setEditingUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingUser(null);
  };

  const handleUserSaved = (responseData) => {
    fetchUsers(); // Refresh the user list
    handleFormClose();
  };

  if (!isAdmin()) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Verifying admin access...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '2rem'
    }}>
      {/* Breadcrumb Navigation */}
      <nav style={{
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#6c757d'
      }}>
        <a href="/admin" style={{
          color: '#007bff',
          textDecoration: 'none'
        }}>
          Admin Dashboard
        </a>
        <span style={{ margin: '0 0.5rem' }}></span>
        <span style={{ fontWeight: 'bold', color: '#343a40' }}>
          User Management
        </span>
      </nav>

      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#343a40' }}>User Management</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d' }}>
              Manage system users, roles, and permissions
            </p>
          </div>
          <button
            onClick={handleCreateUser}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ➕ Add New User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginTop: 0, color: '#343a40' }}>Search & Filter Users</h3>
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* User List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1.5rem'
      }}>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <UserList
          users={users}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEditUser={handleEditUser}
          onRefresh={fetchUsers}
        />
      </div>

      {/* User Form Modal would go here */}
      {showCreateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ margin: 0, color: '#343a40' }}>
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={handleFormClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ×
              </button>
            </div>
            <UserForm
              user={editingUser}
              onSave={handleUserSaved}
              onCancel={handleFormClose}
              isAdmin={isAdmin}
              getToken={getToken}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
