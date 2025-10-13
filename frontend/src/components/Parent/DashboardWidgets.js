import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Bus, MessageSquare, Bell, AlertTriangle, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';

const DashboardWidgets = () => {
  const [realTimeData, setRealTimeData] = useState(null);

  // Enhanced mock data with real-time simulation
  const mockData = {
    children: {
      total: 2,
      active: 2,
      pendingApproval: 0,
      onTrip: 1
    },
    trips: {
      today: 2,
      thisWeek: 8,
      active: 1,
      completedToday: 1
    },
    stats: {
      messages: 3,
      notifications: 5,
      pendingActions: 1,
      alerts: 0
    },
    system: {
      routes: 12,
      buses: 8,
      drivers: 6,
      status: 'operational'
    },
    activeTrips: [
      {
        id: 1,
        childName: 'Emma Johnson',
        currentStatus: 'en-route',
        destination: 'School',
        estimatedArrival: '8:45 AM',
        driver: 'John Smith',
        lastUpdate: '2 min ago'
      }
    ]
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        timestamp: new Date().toLocaleTimeString()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      {/* Children Overview Widget */}
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
          >
            <Users className="w-6 h-6 text-primary-600" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">My Children</h3>
            <p className="text-sm text-neutral-600">Children registered in the system</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-1">
              {formatNumber(mockData.children.total)}
            </div>
            <div className="text-sm text-neutral-600">Total Children</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success-600">
                {mockData.children.onTrip} On Trip
              </span>
            </div>
            {mockData.children.pendingApproval > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <span className="text-sm font-medium text-warning-600">
                  {mockData.children.pendingApproval} Pending
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          className="w-full bg-primary-600 hover:bg-primary-700 text-white"
          onClick={() => window.location.href = '#/children'}
        >
          Manage Children
        </Button>
      </motion.div>

      {/* Real-Time Trip Status Widget */}
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
            animate={{
              rotate: mockData.trips.active > 0 ? [0, 360] : 0,
              transition: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          >
            <Bus className="w-6 h-6 text-secondary-600" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Active Trips</h3>
            <p className="text-sm text-neutral-600">Real-time trip monitoring</p>
          </div>
        </div>

        {/* Active Trip Display */}
        <div className="mb-4 space-y-3">
          {mockData.activeTrips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neutral-50 rounded-lg p-3 border border-neutral-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span className="font-medium text-sm">{trip.childName}</span>
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
                <span>→ {trip.destination}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{trip.estimatedArrival}</span>
                </div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Driver: {trip.driver} • Updated {trip.lastUpdate}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-600 mb-1">
              {formatNumber(mockData.trips.today)}
            </div>
            <div className="text-xs text-neutral-600">Today</div>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-success-600 mb-1">
              {formatNumber(mockData.trips.active)}
            </div>
            <div className="text-xs text-neutral-600">In Progress</div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50"
          onClick={() => window.location.href = '#/trips'}
        >
          View All Trips
        </Button>
      </motion.div>

      {/* Quick Notifications Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
      >
        <div className="flex items-center mb-4">
          <motion.div
            className="p-3 bg-accent-50 rounded-lg mr-4 relative"
            whileHover={{ scale: 1.1 }}
          >
            <Bell className="w-6 h-6 text-accent-600" />
            {mockData.stats.notifications > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 rounded-full flex items-center justify-center"
              >
                <span className="text-xs text-white font-medium">
                  {mockData.stats.notifications > 99 ? '99+' : mockData.stats.notifications}
                </span>
              </motion.div>
            )}
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Notifications</h3>
            <p className="text-sm text-neutral-600">Stay updated on activities</p>
          </div>
        </div>

        <div className="space-y-3">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-primary-500" />
              <div>
                <div className="text-sm font-medium text-neutral-900">Unread Messages</div>
                <div className="text-xs text-neutral-600">Check your inbox</div>
              </div>
            </div>
            <span className="text-sm font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
              {mockData.stats.messages}
            </span>
          </motion.div>

          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-secondary-500" />
              <div>
                <div className="text-sm font-medium text-neutral-900">System Alerts</div>
                <div className="text-xs text-neutral-600">Important updates</div>
              </div>
            </div>
            <span className="text-sm font-bold text-secondary-600 bg-secondary-100 px-2 py-1 rounded-full">
              {mockData.stats.notifications}
            </span>
          </motion.div>

          {mockData.stats.alerts > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-warning-600" />
                <div>
                  <div className="text-sm font-medium text-warning-900">Action Required</div>
                  <div className="text-xs text-warning-700">Review pending items</div>
                </div>
              </div>
              <span className="text-sm font-bold text-warning-600 bg-warning-100 px-2 py-1 rounded-full">
                {mockData.stats.alerts}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* System Health Widget */}
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
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">System Health</h3>
            <p className="text-sm text-neutral-600">SafeGo platform status</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xl font-bold text-primary-600 mb-1">
              {formatNumber(mockData.system.routes)}
            </div>
            <div className="text-xs text-neutral-600">Routes</div>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xl font-bold text-success-600 mb-1">
              {formatNumber(mockData.system.buses)}
            </div>
            <div className="text-xs text-neutral-600">Buses</div>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-xl font-bold text-accent-600 mb-1">
              {formatNumber(mockData.system.drivers)}
            </div>
            <div className="text-xs text-neutral-600">Drivers</div>
          </div>
          <div className="text-center p-3 bg-success-500 rounded-lg">
            <div className="text-xl font-bold text-white mb-1">
              ✓
            </div>
            <div className="text-xs text-white/90">Online</div>
          </div>
        </div>

        <div className={`text-center py-3 px-4 rounded-lg ${
          mockData.system.status === 'operational'
            ? 'bg-success-50 border border-success-200'
            : 'bg-error-50 border border-error-200'
        }`}>
          <div className={`text-sm font-semibold ${
            mockData.system.status === 'operational' ? 'text-success-800' : 'text-error-800'
          }`}>
            {mockData.system.status === 'operational' ? '✅ All Systems Operational' : '❌ System Issues'}
          </div>
          <div className={`text-xs mt-1 ${
            mockData.system.status === 'operational' ? 'text-success-700' : 'text-error-700'
          }`}>
            {mockData.system.status === 'operational'
              ? `Last updated ${realTimeData?.timestamp || new Date().toLocaleTimeString()}`
              : 'Please contact support'
            }
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardWidgets;
