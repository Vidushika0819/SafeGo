import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Clock,
  Users,
  Bus,
  MapPin,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  Star
} from 'lucide-react';
import { Button } from '../../ui/button';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [timeRange, setTimeRange] = useState('today');
  const [selectedReport, setSelectedReport] = useState('overview');

  const mockReportData = {
    overview: {
      totalTrips: 145,
      completedTrips: 142,
      activeTrips: 8,
      totalPassengers: 245,
      onTimeRate: 94.7,
      avgTripDuration: '3.2 hrs',
      totalDistance: '1,247 km',
      fuelEfficiency: '8.5 L/100km'
    },
    performance: {
      onTimePerformance: [
        { period: 'Week 1', rate: 96.3 },
        { period: 'Week 2', rate: 94.7 },
        { period: 'Week 3', rate: 95.8 },
        { period: 'Week 4', rate: 93.2 }
      ],
      tripCompletionRate: [
        { period: 'Week 1', rate: 98.1 },
        { period: 'Week 2', rate: 97.8 },
        { period: 'Week 3', rate: 98.5 },
        { period: 'Week 4', rate: 97.2 }
      ],
      passengerSatisfaction: [
        { period: 'Week 1', score: 4.7 },
        { period: 'Week 2', score: 4.8 },
        { period: 'Week 3', score: 4.6 },
        { period: 'Week 4', score: 4.9 }
      ]
    },
    routes: [
      { name: 'Colombo → Kandy', trips: 45, avgDuration: '3.5h', satisfaction: 4.8 },
      { name: 'Galle → Colombo', trips: 32, avgDuration: '4.2h', satisfaction: 4.6 },
      { name: 'Colombo → Negombo', trips: 28, avgDuration: '1.8h', satisfaction: 4.9 },
      { name: 'Jaffna → Colombo', trips: 25, avgDuration: '8.5h', satisfaction: 4.5 },
      { name: 'Colombo → Matara', trips: 15, avgDuration: '5.1h', satisfaction: 4.7 }
    ],
    issues: {
      total: 12,
      resolved: 10,
      pending: 2,
      byType: [
        { type: 'Mechanical', count: 4 },
        { type: 'Weather', count: 3 },
        { type: 'Traffic', count: 3 },
        { type: 'Other', count: 2 }
      ]
    }
  };

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReportData(mockReportData);
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [timeRange]);

  const exportReport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
    // Simulate export functionality
  };

  const refreshData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-neutral-200 rounded w-64 animate-pulse"></div>
            <div className="h-5 bg-neutral-200 rounded w-96 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                <div className="h-8 bg-neutral-200 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            Reports & Analytics
          </h2>
          <p className="text-neutral-600 mt-1">
            Comprehensive insights and performance metrics for transportation operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={refreshData}
              variant="outline"
              className="border-primary-300 text-primary-700 hover:bg-primary-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6">
        <div className="flex flex-wrap gap-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'routes', label: 'Route Analysis', icon: MapPin },
            { id: 'issues', label: 'Issue Tracking', icon: AlertTriangle }
          ].map((report) => (
            <motion.button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                selectedReport === report.id
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <report.icon className="w-4 h-4" />
              {report.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Trips', value: reportData.overview.totalTrips, color: 'primary', icon: Bus },
              { label: 'Active Trips', value: reportData.overview.activeTrips, color: 'success', icon: Clock },
              { label: 'Total Passengers', value: reportData.overview.totalPassengers, color: 'secondary', icon: Users },
              { label: 'On-Time Rate', value: `${reportData.overview.onTimeRate}%`, color: 'accent', icon: TrendingUp }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">{metric.label}</p>
                    <p className={`text-2xl font-bold text-${metric.color}-600`}>
                      {metric.value}
                    </p>
                  </div>
                  <div className={`p-3 bg-${metric.color}-50 rounded-lg`}>
                    <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Trip Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-700">Avg Trip Duration</span>
                  <span className="font-semibold text-primary-600">{reportData.overview.avgTripDuration}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-700">Total Distance</span>
                  <span className="font-semibold text-secondary-600">{reportData.overview.totalDistance}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm text-neutral-700">Fuel Efficiency</span>
                  <span className="font-semibold text-accent-600">{reportData.overview.fuelEfficiency}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg">
                  <span className="text-sm text-neutral-700">Completion Rate</span>
                  <span className="font-semibold text-success-600">{reportData.overview.completedTrips}/{reportData.overview.totalTrips}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-info-50 rounded-lg">
                  <span className="text-sm text-neutral-700">System Uptime</span>
                  <span className="font-semibold text-info-600">99.9%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-warning-50 rounded-lg">
                  <span className="text-sm text-neutral-700">Avg Response Time</span>
                  <span className="font-semibold text-warning-600">2.3 min</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Export Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Export Report</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => exportReport('pdf')}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button
                onClick={() => exportReport('excel')}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button
                onClick={() => exportReport('csv')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Performance Report */}
      {selectedReport === 'performance' && reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                On-Time Performance
              </h3>
              <div className="space-y-3">
                {reportData.performance.onTimePerformance.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm text-neutral-700">{item.period}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary-600">{item.rate}%</span>
                      <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.rate}%` }}
                          transition={{ delay: index * 0.2, duration: 1 }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success-600" />
                Trip Completion Rate
              </h3>
              <div className="space-y-3">
                {reportData.performance.tripCompletionRate.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm text-neutral-700">{item.period}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-success-600">{item.rate}%</span>
                      <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.rate}%` }}
                          transition={{ delay: index * 0.2, duration: 1 }}
                          className="h-full bg-success-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-warning-600" />
                Passenger Satisfaction
              </h3>
              <div className="space-y-3">
                {reportData.performance.passengerSatisfaction.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm text-neutral-700">{item.period}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-warning-600">{item.score}/5</span>
                      <div className="flex">
                        {[...Array(5)].map((_, starIndex) => (
                          <motion.div
                            key={starIndex}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                              scale: starIndex < item.score ? 1 : starIndex < Math.floor(item.score) + 0.5 ? 0.8 : 0.5,
                              opacity: starIndex < item.score ? 1 : 0.3
                            }}
                            transition={{ delay: index * 0.1 + starIndex * 0.1 }}
                          >
                            <Star className="w-3 h-3 text-warning-500 fill-current" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Routes Report */}
      {selectedReport === 'routes' && reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Route Performance Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-900">Route</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-900">Total Trips</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-900">Avg Duration</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-900">Satisfaction</th>
                  <th className="text-center py-3 px-4 font-semibold text-neutral-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.routes.map((route, index) => (
                  <motion.tr
                    key={route.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span className="font-medium text-neutral-900">{route.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold text-primary-600">{route.trips}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700">{route.avgDuration}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-warning-500 fill-current" />
                        <span className="font-semibold text-warning-600">{route.satisfaction}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Issues Report */}
      {selectedReport === 'issues' && reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6 text-center"
            >
              <div className="text-3xl font-bold text-warning-600 mb-1">{reportData.issues.total}</div>
              <div className="text-sm text-neutral-600">Total Issues</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6 text-center"
            >
              <div className="text-3xl font-bold text-success-600 mb-1">{reportData.issues.resolved}</div>
              <div className="text-sm text-neutral-600">Resolved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6 text-center"
            >
              <div className="text-3xl font-bold text-error-600 mb-1">{reportData.issues.pending}</div>
              <div className="text-sm text-neutral-600">Pending</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-6">Issues by Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportData.issues.byType.map((issue, index) => (
                <div key={issue.type} className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">{issue.type}</span>
                    <span className="text-2xl font-bold text-primary-600">{issue.count}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(issue.count / reportData.issues.total) * 100}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                      className="bg-primary-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
