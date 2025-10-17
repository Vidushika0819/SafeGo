import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Activity as ActivityIcon,
  RefreshCw,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';

const ActivityFeed = ({ maxItems = 8 }) => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLive, setIsLive] = useState(true);

  // Mock activity data with real-time updates
  const mockActivities = [
    {
      id: 1,
      type: 'trip',
      icon: Bus,
      title: 'Trip #1001 Started',
      description: 'Colombo → Kandy route commenced on schedule',
      details: 'Driver: Sarah Johnson • Bus: SG-456 • Capacity: 42/50',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: 'active',
      color: 'primary'
    },
    {
      id: 2,
      type: 'passenger',
      icon: Users,
      title: 'Passengers Assigned',
      description: '12 children assigned to afternoon trips',
      details: 'Routes: Colombo → Negombo (3), Colombo → Galle (9)',
      timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      status: 'completed',
      color: 'success'
    },
    {
      id: 3,
      type: 'location',
      icon: MapPin,
      title: 'Location Update',
      description: 'Trip #999 reached Kandy checkpoint',
      details: 'ETA: 2:30 PM • Passengers: 38 • Status: On Time',
      timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
      status: 'active',
      color: 'secondary'
    },
    {
      id: 4,
      type: 'alert',
      icon: AlertCircle,
      title: 'Weather Alert',
      description: 'Heavy rainfall expected on Colombo → Galle route',
      details: 'Alternative routes activated • Parents notified',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      status: 'warning',
      color: 'warning'
    },
    {
      id: 5,
      type: 'completion',
      icon: CheckCircle2,
      title: 'Trip Completed',
      description: 'Trip #995 completed successfully',
      details: 'Colombo → Jaffna • All passengers delivered safely',
      timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
      status: 'completed',
      color: 'success'
    },
    {
      id: 6,
      type: 'system',
      icon: ActivityIcon,
      title: 'System Update',
      description: 'GPS tracking enhanced for better accuracy',
      details: 'Real-time location updates now within 30 seconds',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'info',
      color: 'info'
    },
    {
      id: 7,
      type: 'passenger',
      icon: Users,
      title: 'Parent Communication',
      description: '25 parents contacted regarding trip updates',
      details: 'Automated notifications sent • 98% delivery rate',
      timestamp: new Date(Date.now() - 52 * 60 * 1000), // 52 minutes ago
      status: 'completed',
      color: 'secondary'
    },
    {
      id: 8,
      type: 'trip',
      icon: Bus,
      title: 'New Trip Scheduled',
      description: 'Evening route added for parent requests',
      details: 'Colombo → Mount Lavinia • Departs: 5:00 PM',
      timestamp: new Date(Date.now() - 67 * 60 * 1000), // 1 hour 7 minutes ago
      status: 'scheduled',
      color: 'primary'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    setActivities(mockActivities);

    // Live updates every 30 seconds
    if (isLive) {
      const interval = setInterval(() => {
        // Simulate new activities
        const newActivity = {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'trip' : 'passenger',
          icon: Math.random() > 0.5 ? Bus : Users,
          title: Math.random() > 0.5 ? `Trip Update #${Math.floor(Math.random() * 100)}` : 'Passenger Update',
          description: Math.random() > 0.5 ? 'Location checkpoint reached' : 'Passengers boarded successfully',
          details: 'Real-time system update',
          timestamp: new Date(),
          status: 'active',
          color: 'primary'
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-primary-500';
      case 'completed': return 'bg-success-500';
      case 'warning': return 'bg-warning-500';
      case 'scheduled': return 'bg-secondary-500';
      case 'info': return 'bg-info-500';
      default: return 'bg-neutral-500';
    }
  };

  const getActivityIconColor = (color) => {
    switch (color) {
      case 'primary': return 'text-primary-600 bg-primary-50';
      case 'success': return 'text-success-600 bg-success-50';
      case 'warning': return 'text-warning-600 bg-warning-50';
      case 'secondary': return 'text-secondary-600 bg-secondary-50';
      case 'info': return 'text-info-600 bg-info-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const toggleLive = () => {
    setIsLive(!isLive);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <ActivityIcon className="w-6 h-6 text-primary-600" />
            Activity Feed
          </h2>
          <p className="text-neutral-600 mt-1">
            Real-time updates on trips, passengers, and system status
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Toggle */}
          <motion.button
            onClick={toggleLive}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              isLive
                ? 'bg-success-100 text-success-700 border border-success-300'
                : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={isLive ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isLive ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
            {isLive ? 'Live' : 'Paused'}
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'all', label: 'All Activities', count: activities.length },
          { key: 'trip', label: 'Trips', count: activities.filter(a => a.type === 'trip').length },
          { key: 'passenger', label: 'Passengers', count: activities.filter(a => a.type === 'passenger').length },
          { key: 'alert', label: 'Alerts', count: activities.filter(a => a.type === 'alert').length }
        ].map((filterOption) => (
          <motion.button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              filter === filterOption.key
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{filterOption.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              filter === filterOption.key
                ? 'bg-primary-200 text-primary-800'
                : 'bg-neutral-200 text-neutral-700'
            }`}>
              {filterOption.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredActivities.slice(0, maxItems).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:shadow-sm transition-all duration-200"
            >
              {/* Icon and Status */}
              <div className="flex-shrink-0">
                <div className={`relative w-12 h-12 rounded-lg flex items-center justify-center ${getActivityIconColor(activity.color)}`}>
                  <activity.icon className="w-6 h-6" />
                  <motion.div
                    animate={activity.status === 'active' ? {
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(activity.status)}`}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 text-sm mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-neutral-700 text-sm mb-2">
                      {activity.description}
                    </p>
                    <p className="text-neutral-600 text-xs leading-relaxed">
                      {activity.details}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <ActivityIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No activities found</h3>
            <p className="text-neutral-500 text-sm">
              {filter === 'all' ? 'Activities will appear here in real-time' : `No ${filter} activities found`}
            </p>
          </motion.div>
        )}
      </div>

      {/* Load More Button */}
      {filteredActivities.length > maxItems && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="border-primary-300 text-primary-700 hover:bg-primary-50"
          >
            Load More Activities
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityFeed;
