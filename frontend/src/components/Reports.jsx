import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { dailyCheckAPI, maintenanceAPI, monthlyReportAPI, vehicleAPI } from '../services/api';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports = () => {
  const [stats, setStats] = useState({
    dailyChecks: {},
    maintenance: {},
    monthlyReports: {},
    vehicles: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };

      console.log('Fetching report data with params:', params);

      const [dailyStats, maintenanceStats, monthlyStats, vehicleStats] = await Promise.all([
        dailyCheckAPI.getStats(params).catch(err => {
          console.error('Daily stats error:', err);
          return { data: {} };
        }),
        maintenanceAPI.getStats(params).catch(err => {
          console.error('Maintenance stats error:', err);
          return { data: {} };
        }),
        monthlyReportAPI.getStats(params).catch(err => {
          console.error('Monthly stats error:', err);
          return { data: {} };
        }),
        vehicleAPI.getStats().catch(err => {
          console.error('Vehicle stats error:', err);
          return { data: {} };
        })
      ]);

      console.log('API Responses:', { dailyStats, maintenanceStats, monthlyStats, vehicleStats });
      console.log('Final stats object:', {
        dailyChecks: dailyStats.data || {},
        maintenance: maintenanceStats.data || {},
        monthlyReports: monthlyStats.data || {},
        vehicles: vehicleStats.data || {}
      });

      setStats({
        dailyChecks: dailyStats.data || {},
        maintenance: maintenanceStats.data || {},
        monthlyReports: monthlyStats.data || {},
        vehicles: vehicleStats.data || {}
      });
    } catch (error) {
      toast.error('Failed to load report data');
      console.error('Reports error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart data
  const dailyCheckChartData = {
    labels: ['Ready', 'Not Ready', 'Needs Service', 'Unsafe'],
    datasets: [
      {
        label: 'Daily Checks',
        data: [
          stats.dailyChecks.readyChecks || 5,
          stats.dailyChecks.notReadyChecks || 3,
          stats.dailyChecks.needsServiceChecks || 2,
          stats.dailyChecks.unsafeChecks || 1
        ],
        backgroundColor: [
          '#10B981',
          '#EF4444',
          '#F59E0B',
          '#DC2626'
        ],
        borderColor: [
          '#10B981',
          '#EF4444',
          '#F59E0B',
          '#DC2626'
        ],
        borderWidth: 2
      }
    ]
  };

  const maintenanceChartData = {
    labels: ['Planned', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Maintenance Status',
        data: [
          stats.maintenance.plannedLogs || 3,
          stats.maintenance.inProgressLogs || 2,
          stats.maintenance.completedLogs || 8
        ],
        backgroundColor: [
          '#3B82F6',
          '#F59E0B',
          '#10B981'
        ],
        borderColor: [
          '#3B82F6',
          '#F59E0B',
          '#10B981'
        ],
        borderWidth: 2
      }
    ]
  };

  const vehicleChartData = {
    labels: ['Active', 'Inactive', 'Maintenance'],
    datasets: [
      {
        label: 'Vehicle Status',
        data: [
          stats.vehicles.activeVehicles || 10,
          stats.vehicles.inactiveVehicles || 2,
          stats.vehicles.maintenanceVehicles || 1
        ],
        backgroundColor: [
          '#10B981',
          '#6B7280',
          '#F59E0B'
        ],
        borderColor: [
          '#10B981',
          '#6B7280',
          '#F59E0B'
        ],
        borderWidth: 2
      }
    ]
  };

  // Debug log to check data
  console.log('Chart Data:', { dailyCheckChartData, maintenanceChartData, vehicleChartData });
  console.log('Stats:', stats);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your vehicle fleet</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchReportData}
                className="btn btn-secondary"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.dailyChecks.readyChecks || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Issues Found</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.dailyChecks.notReadyChecks || 0) + (stats.dailyChecks.unsafeChecks || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.maintenance.completionRate || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{stats.monthlyReports.totalCost || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Check Status Distribution</h3>
            <div style={{height: '350px', width: '100%', position: 'relative'}}>
              {dailyCheckChartData && dailyCheckChartData.datasets && dailyCheckChartData.datasets[0] ? (
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
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return context.label + ': ' + context.parsed;
                          }
                        }
                      }
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Status Overview</h3>
            <div style={{height: '350px', width: '100%', position: 'relative'}}>
              {maintenanceChartData && maintenanceChartData.datasets && maintenanceChartData.datasets[0] ? (
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
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return context.label + ': ' + context.parsed;
                          }
                        }
                      }
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Fleet Status</h3>
            <div style={{height: '300px', position: 'relative'}}>
              <Bar 
                data={vehicleChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Daily Checks</span>
                <span className="text-lg font-bold text-gray-900">{stats.dailyChecks.totalChecks || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Ready Percentage</span>
                <span className="text-lg font-bold text-green-600">{stats.dailyChecks.readyPercentage || 0}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Maintenance Logs</span>
                <span className="text-lg font-bold text-gray-900">{stats.maintenance.totalLogs || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Average Maintenance Cost</span>
                <span className="text-lg font-bold text-gray-900">Rs. {stats.maintenance.averageCost || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
