import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bus,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Activity,
  MapPinCheck,
  UserCheck,
  TrendingDown
} from 'lucide-react';
import { Button } from '../ui/button';

const CoordinatorStats = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coordinator-specific mock data with real-time simulation
  const mockData = {
    trips: {
      total: 145,
      active: 8,
      completedToday: 23,
      scheduled: 12,
      delayed: 1
    },
    passengers: {
      totalChildren: 245,
      totalParents: 189,
      activeToday: 67,
      awaitingPickup: 5
    },
    performance: {
      onTimeRate: 94.7,
      completionRate: 98.2,
      satisfactionScore: 4.8
    },
    system: {
      busesActive: 15,
      routesActive: 28,
      driversActive: 12,
      status: 'optimal'
    },
    alerts: {
      total: 2,
      critical: 0,
      warnings: 2
    },
    activeTrips: [
      {
        id: 1001,
        route: 'Colombo → Kandy',
        passengers: 42,
        status: 'en-route',
        eta: '45 min',
        driver: 'Sarah Johnson',
        lastUpdate: '5 min ago'
      },
      {
        id: 1002,
        route: 'Galle → Colombo',
        passengers: 38,
        status: 'boarding',
        eta: '10 min',
        driver: 'Mike Chen',
        lastUpdate: '2 min ago'
      }
    ]
  };

  // Simulate real-time updates and data fetching
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update with current timestamp for real-time feel
        setRealTimeData({
          ...mockData,
          timestamp: new Date().toLocaleTimeString(),
          lastUpdated: new Date().toLocaleString()
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching coordinator stats:', error);
        setLoading(false);
      }
    };

    fetchStats();

    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        timestamp: new Date().toLocaleTimeString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-16 bg-neutral-100 rounded-lg"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      {/* Active Trips Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
      >
        <div className="flex items-center mb-4">
          <motion.div
            className="p-3 bg-primary-50 rounded-lg mr-4"
            whileHover={{ scale: 1.1 }}
            animate={{
              rotate: mockData.trips.active > 0 ? [0, 360] : 0,
              transition: { duration: 3, repeat: Infinity, ease: "linear" }
            }}
          >
            <Bus className="w-6 h-6 text-primary-600" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Active Trips</h3>
            <p className="text-sm text-neutral-600">Currently in operation</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {formatNumber(mockData.trips.active)}
            </div>
            <div className="text-sm text-neutral-600">Running Now</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success-600">
                {mockData.trips.scheduled} Scheduled
              </span>
            </div>
            {mockData.trips.delayed > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <span className="text-sm font-medium text-warning-600">
                  {mockData.trips.delayed} Delayed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Active Trip Preview */}
        <div className="mb-4 space-y-2">
          {mockData.activeTrips.slice(0, 1).map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neutral-50 rounded-lg p-3 border border-neutral-200"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span className="font-medium text-sm">Trip #{trip.id}</span>
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                  className="w-2 h-2 bg-success-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>{trip.route}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>ETA: {trip.eta}</span>
                </div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {trip.passengers} passengers • Driver: {trip.driver.split(' ')[0]}
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
          onClick={() => window.location.href = '#/coordinator/trips'}
        >
          Manage Trips
        </Button>
      </motion.div>

      {/* Passenger Overview Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
      >
        <div className="flex items-center mb-4">
          <motion.div
            className="p-3 bg-secondary-50 rounded-lg mr-4"
            whileHover={{ scale: 1.1 }}
          >
            <Users className="w-6 h-6 text-secondary-600" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Passengers</h3>
            <p className="text-sm text-neutral-600">Children and parents</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {formatNumber(mockData.passengers.totalChildren)}
            </div>
            <div className="text-xs text-neutral-600">Children</div>
          </div>
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-600 mb-1">
              {formatNumber(mockData.passengers.totalParents)}
            </div>
            <div className="text-xs text-neutral-600">Parents</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-success-600" />
            <span className="text-sm font-medium text-neutral-900">
              {mockData.passengers.activeToday} Active Today
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning-600" />
            <span className="text-sm font-medium text-neutral-700">
              {mockData.passengers.awaitingPickup} Waiting
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50"
          onClick={() => window.location.href = '#/coordinator/passengers'}
        >
          View Passenger Lists
        </Button>
      </motion.div>

      {/* Performance Metrics Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
      >
        <div className="flex items-center mb-4">
          <motion.div
            className="p-3 bg-accent-50 rounded-lg mr-4"
            whileHover={{ scale: 1.1 }}
          >
            <TrendingUp className="w-6 h-6 text-accent-600" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Performance</h3>
            <p className="text-sm text-neutral-600">Today's metrics</p>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <span className="text-sm text-neutral-700">On-Time Rate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-success-600">
                {formatPercentage(mockData.performance.onTimeRate)}
              </span>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <TrendingUp className="w-3 h-3 text-success-600" />
              </motion.div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPinCheck className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-neutral-700">Completion Rate</span>
            </div>
            <span className="font-semibold text-primary-600">
              {formatPercentage(mockData.performance.completionRate)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-secondary-600" />
              <span className="text-sm text-neutral-700">Satisfaction</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-secondary-600">
                {mockData.performance.satisfactionScore}/5
              </span>
              <span className="text-xs text-neutral-500">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-success-50 to-primary-50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-lg font-bold text-primary-600 mb-1">
              {mockData.trips.completedToday}
            </div>
            <div className="text-xs text-neutral-600">Trips Completed Today</div>
          </div>
        </div>
      </motion.div>

      {/* System Status & Alerts Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
      >
        <div className="flex items-center mb-4">
          <motion.div
            className="p-3 bg-success-50 rounded-lg mr-4 relative"
            whileHover={{ scale: 1.1 }}
          >
            <CheckCircle2 className="w-6 h-6 text-success-600" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
              className="absolute top-0 right-0 w-2 h-2 bg-success-500 rounded-full"
            />
            {mockData.alerts.critical > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 rounded-full flex items-center justify-center"
              >
                <span className="text-xs text-white font-medium">
                  {mockData.alerts.critical}
                </span>
              </motion.div>
            )}
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">System Status</h3>
            <p className="text-sm text-neutral-600">Fleet and operations</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xl font-bold text-primary-600 mb-1">
              {formatNumber(mockData.system.busesActive)}
            </div>
            <div className="text-xs text-neutral-600">Buses Active</div>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xl font-bold text-success-600 mb-1">
              {formatNumber(mockData.system.driversActive)}
            </div>
            <div className="text-xs text-neutral-600">Drivers</div>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xl font-bold text-accent-600 mb-1">
              {formatNumber(mockData.system.routesActive)}
            </div>
            <div className="text-xs text-neutral-600">Routes</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            mockData.system.status === 'optimal'
              ? 'bg-success-500'
              : 'bg-warning-500'
          }`}>
            <div className="text-xl font-bold text-white mb-1">
              ✓
            </div>
            <div className="text-xs text-white/90">Optimal</div>
          </div>
        </div>

        {/* Alerts Section */}
        {mockData.alerts.total > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-neutral-200 pt-4 mt-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-warning-600" />
              <span className="text-sm font-medium text-neutral-900">
                {mockData.alerts.total} Alerts Require Attention
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-warning-300 text-warning-700 hover:bg-warning-50"
            >
              View Details
            </Button>
          </motion.div>
        )}

        <div className={`text-center py-3 px-4 rounded-lg ${
          mockData.system.status === 'optimal'
            ? 'bg-success-50 border border-success-200'
            : 'bg-warning-50 border border-warning-200'
        }`}>
          <div className={`text-sm font-semibold ${
            mockData.system.status === 'optimal' ? 'text-success-800' : 'text-warning-800'
          }`}>
            {mockData.system.status === 'optimal' ? '✅ All Systems Optimal' : '⚠️ Performance Issues'}
          </div>
          <div className={`text-xs mt-1 ${
            mockData.system.status === 'optimal' ? 'text-success-700' : 'text-warning-700'
          }`}>
            Updated {realTimeData?.timestamp || new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoordinatorStats;
