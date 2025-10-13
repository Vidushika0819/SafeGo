import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  Calendar
} from 'lucide-react';
import { monthlyReportAPI } from '../services/api';
import toast from 'react-hot-toast';

const MonthlyReportList = () => {
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [allReports, setAllReports] = useState([]); // Store original data
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchMonthlyReports();
  }, [currentPage, searchTerm]);

  const fetchMonthlyReports = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      };

      const response = await monthlyReportAPI.getAll(params);
      const reports = response.data.monthlyReports || [];
      setMonthlyReports(reports);
      setAllReports(reports); // Store original data for filtering
      setTotalPages(response.data.totalPages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error('Failed to load monthly reports');
    } finally {
      setIsLoading(false);
    }
  };

  // Your simple search method
  const handleSearch = () => {
    const filteredReports = allReports.filter((report) =>
      Object.values(report).some((field) =>
        field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setMonthlyReports(filteredReports);
    setNoResults(filteredReports.length === 0);
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery('');
    setMonthlyReports(allReports);
    setNoResults(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this monthly report?')) {
      try {
        await monthlyReportAPI.delete(id);
        toast.success('Monthly report deleted successfully');
        fetchMonthlyReports();
      } catch (error) {
        toast.error('Failed to delete monthly report');
      }
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
              Monthly Reports
            </h1>
            <p style={{
              color: '#6b7280', 
              fontSize: '1.1rem',
              margin: 0
            }}>
              View and manage monthly service reports
            </p>
          </div>
          <Link
            to="/monthly-reports/new"
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
            New Monthly Report
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
                  name="search"
                  placeholder="Search reports..."
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
              Monthly Reports ({total})
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
          {monthlyReports.length > 0 ? (
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
                  }}>Month/Year</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Odometer</th>
                  <th style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    background: '#f9fafb'
                  }}>Issues</th>
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
                {monthlyReports.map((report, index) => (
                  <tr key={report._id} style={{
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
                    }}>{report.vehicleId}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151'
                    }}>{report.completedBy}</td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151'
                    }}>
                      {report.month}/{report.year}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151'
                    }}>
                      {report.odometerReading ? `${report.odometerReading.toLocaleString()} mi` : 'N/A'}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      maxWidth: '200px'
                    }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#374151'
                      }} title={report.issues}>
                        {report.issues || 'None reported'}
                      </div>
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
                        Rs. {report.totalCost || 'N/A'}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      color: '#374151'
                    }}>
                      {new Date(report.date).toLocaleDateString()}
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
                          to={`/monthly-reports/${report._id}/edit`}
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
                          title="Edit monthly report"
                        >
                          <Edit style={{height: 14, width: 14}} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(report._id)}
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
                          title="Delete monthly report"
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
              <FileText style={{
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
                {noResults ? 'No search results found' : 'No monthly reports found'}
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '16px',
                fontSize: '0.95rem'
              }}>
                {searchQuery
                  ? 'No reports match your search. Try different keywords.'
                  : searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first monthly report'
                }
              </p>
              {!searchTerm && !searchQuery && (
                <Link 
                  to="/monthly-reports/new" 
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
                  Create Monthly Report
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

export default MonthlyReportList;
