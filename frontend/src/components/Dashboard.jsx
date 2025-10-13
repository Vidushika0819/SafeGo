import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Wrench, 
  FileText, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { dailyCheckAPI, maintenanceAPI, monthlyReportAPI, vehicleAPI } from '../services/api';
import { getCurrentUser } from '../utils/auth';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    dailyChecks: {},
    maintenance: {},
    monthlyReports: {},
    vehicles: {}
  });
  const [recentChecks, setRecentChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const user = getCurrentUser();

  useEffect(() => {
    fetchDashboardData();
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dailyStats, maintenanceStats, monthlyStats, vehicleStats, recentChecksData] = await Promise.all([
        dailyCheckAPI.getStats(),
        maintenanceAPI.getStats(),
        monthlyReportAPI.getStats(),
        vehicleAPI.getStats(),
        dailyCheckAPI.getAll({ limit: 5 })
      ]);

      setStats({
        dailyChecks: dailyStats.data,
        maintenance: maintenanceStats.data,
        monthlyReports: monthlyStats.data,
        vehicles: vehicleStats.data
      });

      setRecentChecks(recentChecksData.data.dailyChecks || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready': return 'text-green-600';
      case 'Not Ready': return 'text-red-600';
      case 'Needs Service': return 'text-yellow-600';
      case 'Unsafe': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ready': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Not Ready': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Needs Service': return <Wrench className="h-4 w-4 text-yellow-600" />;
      case 'Unsafe': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDateTime = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const dateStr = currentDateTime.toLocaleDateString('en-US', options);
    const timeStr = currentDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return { date: dateStr, time: timeStr };
  };

  // Chart data
  const dailyCheckChartData = {
    labels: ['Ready', 'Not Ready', 'Needs Service', 'Unsafe'],
    datasets: [
      {
        label: 'Daily Checks',
        data: [
          stats.dailyChecks.readyChecks || 0,
          stats.dailyChecks.notReadyChecks || 0,
          stats.dailyChecks.needsServiceChecks || 0,
          stats.dailyChecks.unsafeChecks || 0
        ],
        backgroundColor: [
          '#10B981',
          '#EF4444',
          '#F59E0B',
          '#DC2626'
        ],
        borderWidth: 0
      }
    ]
  };

  const maintenanceChartData = {
    labels: ['Planned', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Maintenance Status',
        data: [
          stats.maintenance.plannedLogs || 0,
          stats.maintenance.inProgressLogs || 0,
          stats.maintenance.completedLogs || 0
        ],
        backgroundColor: [
          '#3B82F6',
          '#F59E0B',
          '#10B981'
        ],
        borderWidth: 0
      }
    ]
  };



  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '2rem'
    }}>
      {/* Header with Date/Time and Welcome */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            color: '#343a40',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Welcome back, {user?.firstName} {user?.lastName}!
          </h1>
          <p style={{
            margin: 0,
            color: '#6c757d',
            fontSize: '1rem'
          }}>
            {user?.role === 'driver' && 'Driver Dashboard - Manage your daily checks and maintenance tasks'}
            {user?.role === 'mechanic' && 'Coordinator Dashboard - Track maintenance and repair activities'}
            {user?.role === 'admin' && 'Admin Dashboard - Complete system overview and management'}
            {!user?.role && 'Vehicle Health Monitoring System'}
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
            minWidth: '160px'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.25rem'
            }}>
              {formatDateTime().time}
            </div>
            <div style={{
              fontSize: '0.85rem',
              opacity: 0.9
            }}>
              {formatDateTime().date}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Daily Checks */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckSquare style={{height: 24, width: 24, color: '#fff'}} />
            </div>
            <TrendingUp style={{height: 20, width: 20, color: '#10B981'}} />
          </div>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#6c757d',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Total Daily Checks
          </h3>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            {stats.dailyChecks.totalChecks || 0}
          </p>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#10B981',
            fontWeight: '500'
          }}>
            {stats.dailyChecks.readyPercentage || 0}% Ready
          </p>
        </div>

        {/* Maintenance Logs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wrench style={{height: 24, width: 24, color: '#fff'}} />
            </div>
            <Activity style={{height: 20, width: 20, color: '#f59e0b'}} />
          </div>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#6c757d',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Maintenance Logs
          </h3>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            {stats.maintenance.totalLogs || 0}
          </p>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#3b82f6',
            fontWeight: '500'
          }}>
            {stats.maintenance.completionRate || 0}% Completed
          </p>
        </div>

        {/* Monthly Reports */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText style={{height: 24, width: 24, color: '#fff'}} />
            </div>
            <TrendingUp style={{height: 20, width: 20, color: '#6b7280'}} />
          </div>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#6c757d',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Monthly Reports
          </h3>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            {stats.monthlyReports.totalReports || 0}
          </p>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Total Cost: Rs. {stats.monthlyReports.totalCost || 0}
          </p>
        </div>

        {/* Total Vehicles */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck style={{height: 24, width: 24, color: '#fff'}} />
            </div>
            <Activity style={{height: 20, width: 20, color: '#10b981'}} />
          </div>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#6c757d',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Total Vehicles
          </h3>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            {stats.vehicles.totalVehicles || 0}
          </p>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#10b981',
            fontWeight: '500'
          }}>
            {stats.vehicles.activeVehicles || 0} Active
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: '0 0 1.5rem 0',
          color: '#343a40',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          Quick Actions
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/daily-checks/new')}
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
              e.currentTarget.style.color = '#495057';
            }}
          >
            <CheckSquare style={{height: 24, width: 24}} />
            <div>
              <div style={{ fontWeight: 'bold' }}>New Daily Check</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                Start a new vehicle inspection
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/maintenance/new')}
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
              e.currentTarget.style.color = '#495057';
            }}
          >
            <Wrench style={{height: 24, width: 24}} />
            <div>
              <div style={{ fontWeight: 'bold' }}>Log Maintenance</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                Record vehicle maintenance
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/monthly-reports/new')}
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6b7280';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
              e.currentTarget.style.color = '#495057';
            }}
          >
            <FileText style={{height: 24, width: 24}} />
            <div>
              <div style={{ fontWeight: 'bold' }}>Monthly Report</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                Submit monthly service report
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/vehicles')}
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
              e.currentTarget.style.color = '#495057';
            }}
          >
            <Truck style={{height: 24, width: 24}} />
            <div>
              <div style={{ fontWeight: 'bold' }}>View Vehicles</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                Check vehicle information
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#343a40',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Daily Check Status Distribution
          </h3>
          <div style={{
            width: '100%',
            maxWidth: '280px',
            height: '280px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Doughnut 
              data={dailyCheckChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        size: 12,
                        weight: '500'
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: '#343a40',
                    padding: 12,
                    titleFont: {
                      size: 14,
                      weight: 'bold'
                    },
                    bodyFont: {
                      size: 13
                    }
                  }
                },
                elements: {
                  arc: {
                    borderWidth: 2,
                    borderColor: '#fff'
                  }
                }
              }}
            />
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#343a40',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Maintenance Status Overview
          </h3>
          <div style={{
            width: '100%',
            maxWidth: '280px',
            height: '280px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Doughnut 
              data={maintenanceChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        size: 12,
                        weight: '500'
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: '#343a40',
                    padding: 12,
                    titleFont: {
                      size: 14,
                      weight: 'bold'
                    },
                    bodyFont: {
                      size: 13
                    }
                  }
                },
                elements: {
                  arc: {
                    borderWidth: 2,
                    borderColor: '#fff'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Daily Checks */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e9ecef'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            Recent Daily Checks
          </h3>
        </div>
        <div style={{ padding: '1.5rem 2rem' }}>
          {recentChecks.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    borderBottom: '2px solid #e9ecef'
                  }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#6c757d',
                      fontSize: '0.9rem'
                    }}>Vehicle ID</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#6c757d',
                      fontSize: '0.9rem'
                    }}>Driver</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#6c757d',
                      fontSize: '0.9rem'
                    }}>Date</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#6c757d',
                      fontSize: '0.9rem'
                    }}>Status</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#6c757d',
                      fontSize: '0.9rem'
                    }}>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {recentChecks.map((check) => (
                    <tr key={check._id} style={{
                      borderBottom: '1px solid #f1f3f5'
                    }}>
                      <td style={{
                        padding: '12px',
                        fontWeight: '500',
                        color: '#343a40'
                      }}>{check.vehicleId}</td>
                      <td style={{
                        padding: '12px',
                        color: '#495057'
                      }}>{check.completedBy}</td>
                      <td style={{
                        padding: '12px',
                        color: '#495057'
                      }}>{new Date(check.date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {getStatusIcon(check.finalDecision)}
                          <span style={{
                            color: 
                              check.finalDecision === 'Ready' ? '#10b981' :
                              check.finalDecision === 'Not Ready' ? '#ef4444' :
                              check.finalDecision === 'Needs Service' ? '#f59e0b' :
                              '#ef4444'
                          }}>
                            {check.finalDecision}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          backgroundColor:
                            check.finalDecision === 'Ready' ? '#d1fae5' :
                            check.finalDecision === 'Not Ready' ? '#fee2e2' :
                            check.finalDecision === 'Needs Service' ? '#fef3c7' :
                            '#fee2e2',
                          color:
                            check.finalDecision === 'Ready' ? '#065f46' :
                            check.finalDecision === 'Not Ready' ? '#991b1b' :
                            check.finalDecision === 'Needs Service' ? '#92400e' :
                            '#991b1b'
                        }}>
                          {check.finalDecision}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#6c757d'
            }}>
              <CheckSquare style={{
                height: 48,
                width: 48,
                margin: '0 auto 1rem',
                color: '#adb5bd'
              }} />
              <p style={{
                margin: 0,
                fontSize: '1rem'
              }}>No recent daily checks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
