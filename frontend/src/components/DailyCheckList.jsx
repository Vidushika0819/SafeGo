import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Wrench,
  Calendar
} from 'lucide-react';
import { dailyCheckAPI } from '../services/api';
import toast from 'react-hot-toast';

const DailyCheckList = () => {
  const [dailyChecks, setDailyChecks] = useState([]);
  const [allChecks, setAllChecks] = useState([]); // Store original data
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDailyChecks();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchDailyChecks = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { finalDecision: statusFilter })
      };

      const response = await dailyCheckAPI.getAll(params);
      const checks = response.data.dailyChecks || [];
      setDailyChecks(checks);
      setAllChecks(checks); // Store original data for filtering
      setTotalPages(response.data.totalPages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error('Failed to load daily checks');
    } finally {
      setIsLoading(false);
    }
  };

  // Your simple search method
  const handleSearch = () => {
    const filteredChecks = allChecks.filter((check) =>
      Object.values(check).some((field) =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setDailyChecks(filteredChecks);
    setNoResults(filteredChecks.length === 0);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery('');
    setDailyChecks(allChecks);
    setNoResults(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this daily check?')) {
      try {
        await dailyCheckAPI.delete(id);
        toast.success('Daily check deleted successfully');
        fetchDailyChecks();
      } catch (error) {
        toast.error('Failed to delete daily check');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ready': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Not Ready': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Needs Service': return <Wrench className="h-4 w-4 text-yellow-600" />;
      case 'Unsafe': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ready': return 'status-ready';
      case 'Not Ready': return 'status-not-ready';
      case 'Needs Service': return 'status-needs-service';
      case 'Unsafe': return 'status-unsafe';
      default: return 'status-not-ready';
    }
  };

  const getCheckedCount = (checklist) => {
    return Object.values(checklist).filter(Boolean).length;
  };

  const getTotalChecklistItems = (checklist) => {
    return Object.keys(checklist).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              Daily Checks
            </h1>
            <p style={{
              color: '#6b7280', 
              fontSize: '1.1rem',
              margin: 0
            }}>
              Manage vehicle daily safety checks
            </p>
          </div>
          <Link
            to="/daily-checks/new"
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
            New Daily Check
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{flex: '1', minWidth: '300px'}}>
            <div style={{position: 'relative', display: 'flex', gap: '8px'}}>
              <div style={{position: 'relative', flex: 1}}>
                <Search style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '18px',
                  width: '18px',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Search daily checks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  padding: '12px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
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
                    padding: '12px 16px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#4b5563'}
                  onMouseLeave={(e) => e.target.style.background = '#6b7280'}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div style={{minWidth: '200px'}}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: 'white',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All Status</option>
              <option value="Ready">Ready</option>
              <option value="Not Ready">Not Ready</option>
              <option value="Needs Service">Needs Service</option>
              <option value="Unsafe">Unsafe</option>
            </select>
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
              Daily Checks ({total})
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
          {dailyChecks.length > 0 ? (
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
                  }}>Driver</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Date</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Time</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Checklist</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Status</th>
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
                {dailyChecks.map((check, index) => (
                    <tr key={check._id} style={{
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
                      }}>{check.vehicleId}</td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>{check.completedBy}</td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>{new Date(check.date).toLocaleDateString()}</td>
                      <td style={{
                        padding: '16px 20px',
                        color: '#374151'
                      }}>{check.time}</td>
                      <td style={{
                        padding: '16px 20px'
                      }}>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#6b7280'
                        }}>
                          {getCheckedCount(check.checklist)}/{getTotalChecklistItems(check.checklist)} items
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 20px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {getStatusIcon(check.finalDecision)}
                          <span className={`status-badge ${getStatusBadge(check.finalDecision)}`} style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {check.finalDecision}
                          </span>
                        </div>
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
                            to={`/daily-checks/${check._id}/edit`}
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
                            title="Edit daily check"
                          >
                            <Edit style={{height: 14, width: 14}} />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(check._id)}
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
                            title="Delete daily check"
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
              <CheckCircle style={{
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
                {noResults ? 'No search results found' : 'No daily checks found'}
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '16px',
                fontSize: '0.95rem'
              }}>
                {searchQuery
                  ? 'No daily checks match your search. Try different keywords.'
                  : searchTerm || statusFilter
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first daily check'
                }
              </p>
              {!searchTerm && !statusFilter && !searchQuery && (
                <Link 
                  to="/daily-checks/new" 
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
                  Create Daily Check
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

export default DailyCheckList;
