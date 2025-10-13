import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  X,
  Image as ImageIcon,
  User
} from 'lucide-react';
import { dailyCheckAPI, monthlyReportAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [pendingDailyChecks, setPendingDailyChecks] = useState([]);
  const [pendingMonthlyReports, setPendingMonthlyReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily-checks');

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      setIsLoading(true);
      const [dailyChecksResponse, monthlyReportsResponse] = await Promise.all([
        dailyCheckAPI.getAll({ adminStatus: 'pending', limit: 50 }),
        monthlyReportAPI.getAll({ adminStatus: 'pending', limit: 50 })
      ]);

      setPendingDailyChecks(dailyChecksResponse.data.dailyChecks || []);
      setPendingMonthlyReports(monthlyReportsResponse.data.monthlyReports || []);
    } catch (error) {
      toast.error('Failed to load pending submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (type, id) => {
    try {
      if (type === 'daily-check') {
        await dailyCheckAPI.update(id, { adminStatus: 'approved' });
        setPendingDailyChecks(prev => prev.filter(item => item._id !== id));
      } else if (type === 'monthly-report') {
        await monthlyReportAPI.update(id, { adminStatus: 'approved' });
        setPendingMonthlyReports(prev => prev.filter(item => item._id !== id));
      }
      toast.success('Submission approved');
    } catch (error) {
      toast.error('Failed to approve submission');
    }
  };

  const handleReject = async (type, id) => {
    try {
      if (type === 'daily-check') {
        await dailyCheckAPI.update(id, { adminStatus: 'rejected' });
        setPendingDailyChecks(prev => prev.filter(item => item._id !== id));
      } else if (type === 'monthly-report') {
        await monthlyReportAPI.update(id, { adminStatus: 'rejected' });
        setPendingMonthlyReports(prev => prev.filter(item => item._id !== id));
      }
      toast.success('Submission rejected');
    } catch (error) {
      toast.error('Failed to reject submission');
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Review and manage driver submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Daily Checks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingDailyChecks.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Monthly Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingMonthlyReports.length}
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
                <p className="text-sm font-medium text-gray-600">Requires Attention</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingDailyChecks.filter(check => check.finalDecision !== 'Ready').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('daily-checks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'daily-checks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Daily Checks ({pendingDailyChecks.length})
          </button>
          <button
            onClick={() => setActiveTab('monthly-reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'monthly-reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Monthly Reports ({pendingMonthlyReports.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="card">
        <div className="card-body p-0">
          {activeTab === 'daily-checks' ? (
            <div>
              {pendingDailyChecks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Vehicle ID</th>
                        <th>Driver</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Checklist</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDailyChecks.map((check) => (
                        <tr key={check._id}>
                          <td className="font-medium">{check.vehicleId}</td>
                          <td>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              {check.completedBy}
                            </div>
                          </td>
                          <td>{new Date(check.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${getStatusBadge(check.finalDecision)}`}>
                              {check.finalDecision}
                            </span>
                          </td>
                          <td>
                            <div className="text-sm">
                              {Object.values(check.checklist).filter(Boolean).length}/
                              {Object.keys(check.checklist).length} items
                            </div>
                          </td>
                          <td className="max-w-xs truncate">{check.remarks || 'None'}</td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleApprove('daily-check', check._id)}
                                title="Approve"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '8px 12px',
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 500,
                                  transition: 'all 0.2s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                              >
                                <CheckCircle style={{height: 14, width: 14}} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject('daily-check', check._id)}
                                title="Reject"
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
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                              >
                                <X style={{height: 14, width: 14}} />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending daily checks</h3>
                  <p className="text-gray-500">All daily checks have been reviewed</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {pendingMonthlyReports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Vehicle ID</th>
                        <th>Driver</th>
                        <th>Month/Year</th>
                        <th>Issues</th>
                        <th>Cost</th>
                        <th>Images</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingMonthlyReports.map((report) => (
                        <tr key={report._id}>
                          <td className="font-medium">{report.vehicleId}</td>
                          <td>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              {report.completedBy}
                            </div>
                          </td>
                          <td>{report.month}/{report.year}</td>
                          <td className="max-w-xs truncate">{report.issues || 'None'}</td>
                          <td>Rs. {report.totalCost || 'N/A'}</td>
                          <td>
                            {report.images && report.images.length > 0 ? (
                              <div className="flex items-center text-blue-600">
                                <ImageIcon className="h-4 w-4 mr-1" />
                                {report.images.length}
                              </div>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleApprove('monthly-report', report._id)}
                                title="Approve"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '8px 12px',
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 500,
                                  transition: 'all 0.2s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                              >
                                <CheckCircle style={{height: 14, width: 14}} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject('monthly-report', report._id)}
                                title="Reject"
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
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                              >
                                <X style={{height: 14, width: 14}} />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending monthly reports</h3>
                  <p className="text-gray-500">All monthly reports have been reviewed</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
