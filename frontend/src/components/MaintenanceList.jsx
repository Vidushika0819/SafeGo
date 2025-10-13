import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Wrench,
  Calendar
} from 'lucide-react';
import { maintenanceAPI } from '../services/api';
import toast from 'react-hot-toast';

const MaintenanceList = () => {
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]); // Store original data
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchMaintenanceLogs();
  }, [currentPage, searchTerm, statusFilter, priorityFilter]);

  const fetchMaintenanceLogs = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter })
      };

      const response = await maintenanceAPI.getAll(params);
      const logs = response.data.maintenanceLogs || [];
      setMaintenanceLogs(logs);
      setAllLogs(logs); // Store original data for filtering
      setTotalPages(response.data.totalPages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error('Failed to load maintenance logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side search method
  const handleSearch = () => {
    const filteredLogs = allLogs.filter((log) =>
      Object.values(log).some((field) =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setMaintenanceLogs(filteredLogs);
    setNoResults(filteredLogs.length === 0);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery('');
    setMaintenanceLogs(allLogs);
    setNoResults(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance log?')) {
      try {
        await maintenanceAPI.delete(id);
        toast.success('Maintenance log deleted successfully');
        fetchMaintenanceLogs();
      } catch (error) {
        toast.error('Failed to delete maintenance log');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Planned': return 'status-planned';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      default: return 'status-planned';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{padding: '0 16px'}}>
      {/* Header */}
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 8px 0'
            }}>
              Maintenance Logs
            </h1>
            <p style={{
              color: '#6b7280', 
              fontSize: '1.1rem',
              margin: 0
            }}>
              Track vehicle maintenance and repairs
            </p>
          </div>
          <Link
            to="/maintenance/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => e.target.style.background = '#2563eb'}
            onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
          >
            <Plus style={{height: 18, width: 18}} />
            New Maintenance Log
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          alignItems: 'end'
        }}>
          <div style={{gridColumn: 'span 2'}}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Search Maintenance Logs
            </label>
            <div style={{position: 'relative', display: 'flex', gap: '12px'}}>
              <div style={{position: 'relative', flex: 1}}>
                <Search style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '20px',
                  width: '20px',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Search maintenance logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  padding: '14px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                  minWidth: '100px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
              >
                Search
              </button>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  style={{
                    padding: '14px 20px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    minWidth: '80px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                  onMouseLeave={(e) => e.target.style.background = '#6b7280'}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'white',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <option value="">All Status</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Priority Filter
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                background: 'white',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div style={{display: 'flex', alignItems: 'end'}}>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setPriorityFilter('');
                clearSearch();
              }}
              style={{
                width: '80%',
                padding: '14px 20px',
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #979a9dff',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                minHeight: '50px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#e5e7eb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f3f4f6';
                e.target.style.borderColor = '#979a9dff';
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Maintenance Logs ({total})
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.9rem',
              color: '#6b7280',
              gap: '4px'
            }}>
              <Calendar style={{height: 16, width: 16}} />
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
        <div style={{overflowX: 'auto'}}>
          {maintenanceLogs.length > 0 ? (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Vehicle ID</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Service Type</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Description</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Priority</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Status</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Cost</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Date</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb',
                    minWidth: '180px'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceLogs.map((log, index) => (
                  <tr key={log._id} style={{
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      padding: '16px 20px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>{log.vehicleId}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151'
                    }}>{log.serviceType}</td>
                    <td style={{
                      padding: '16px 20px',
                      maxWidth: '200px'
                    }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#374151'
                      }} title={log.description}>
                        {log.description}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 20px'
                    }}>
                      <span className={`status-badge ${getPriorityBadge(log.priority)}`} style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {log.priority}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 20px'
                    }}>
                      <span className={`status-badge ${getStatusBadge(log.status)}`} style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem',
                        color: '#6b7280'
                      }}>
                        Rs. {log.actualCost || log.estimatedCost || 'N/A'}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151'
                    }}>
                      {log.scheduledDate 
                        ? new Date(log.scheduledDate).toLocaleDateString()
                        : new Date(log.createdAt).toLocaleDateString()
                      }
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <Link
                          to={`/maintenance/${log._id}/edit`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            background: '#10b981',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#059669'}
                          onMouseLeave={(e) => e.target.style.background = '#10b981'}
                          title="Edit maintenance log"
                        >
                          <Edit style={{height: 14, width: 14}} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(log._id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                          onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                          title="Delete maintenance log"
                        >
                          <Trash2 style={{height: 14, width: 14}} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px'
            }}>
              <Wrench style={{
                height: 48,
                width: 48,
                color: '#9ca3af',
                margin: '0 auto 16px auto'
              }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                {noResults ? 'No search results found' : 'No maintenance logs found'}
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '16px',
                fontSize: '0.95rem'
              }}>
                {searchQuery
                  ? 'No maintenance logs match your search. Try different keywords.'
                  : searchTerm || statusFilter || priorityFilter
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first maintenance log'
                }
              </p>
              {!searchTerm && !statusFilter && !priorityFilter && !searchQuery && (
                <Link 
                  to="/maintenance/new" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                >
                  <Plus style={{height: 18, width: 18}} />
                  Create Maintenance Log
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{
                fontSize: '0.9rem',
                color: '#374151'
              }}>
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} results
              </div>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    background: currentPage === 1 ? '#f3f4f6' : '#3b82f6',
                    color: currentPage === 1 ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) e.target.style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) e.target.style.background = '#3b82f6';
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    background: currentPage === totalPages ? '#f3f4f6' : '#3b82f6',
                    color: currentPage === totalPages ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) e.target.style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) e.target.style.background = '#3b82f6';
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;
