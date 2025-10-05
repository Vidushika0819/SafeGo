import React from 'react';

const UserList = ({
  users,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEditUser,
  onRefresh
}) => {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return '#dc3545'; // red
      case 'coordinator':
        return '#28a745'; // green
      case 'driver':
        return '#007bff'; // blue
      default:
        return '#6c757d'; // gray
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return '#28a745'; // green
      case 'inactive':
        return '#ffc107'; // yellow
      case 'suspended':
        return '#dc3545'; // red
      default:
        return '#6c757d'; // gray
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#6c757d'
      }}>
        Loading users...
      </div>
    );
  }

  return (
    <div>
      {/* Results Summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{ color: '#6c757d' }}>
          Showing {users.length} users
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>
        <button
          onClick={onRefresh}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6c757d',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          No users found matching your criteria
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #dee2e6'
              }}>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#343a40',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  Name
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#343a40',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  Email
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#343a40',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  Role
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#343a40',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  Status
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#343a40',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  Created
                </th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#343a40',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{
                  borderBottom: '1px solid #dee2e6',
                  '&:hover': { backgroundColor: '#f8f9fa' }
                }}>
                  <td style={{
                    padding: '1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    {user.name || 'N/A'}
                  </td>
                  <td style={{
                    padding: '1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    {user.email}
                  </td>
                  <td style={{
                    padding: '1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <span style={{
                      backgroundColor: getRoleBadgeColor(user.role),
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{
                    padding: '1rem',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <span style={{
                      backgroundColor: getStatusBadgeColor(user.status),
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{
                    padding: '1rem',
                    borderBottom: '1px solid #dee2e6',
                    color: '#6c757d',
                    fontSize: '0.9rem'
                  }}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td style={{
                    padding: '1rem',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center'
                  }}>
                    <button
                      onClick={() => onEditUser(user)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        marginRight: '0.5rem'
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              backgroundColor: currentPage === 1 ? '#e9ecef' : '#007bff',
              color: currentPage === 1 ? '#6c757d' : 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            if (pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                style={{
                  backgroundColor: pageNum === currentPage ? '#007bff' : '#e9ecef',
                  color: pageNum === currentPage ? 'white' : '#495057',
                  border: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: pageNum === currentPage ? 'bold' : 'normal'
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              backgroundColor: currentPage === totalPages ? '#e9ecef' : '#007bff',
              color: currentPage === totalPages ? '#6c757d' : 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
