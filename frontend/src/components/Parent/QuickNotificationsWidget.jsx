import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle2, MessageSquare, Clock, X, ArrowRight, Phone, Users } from 'lucide-react';
import { Button } from '../ui/button';

const QuickNotificationsWidget = () => {
  // Remove useAuth dependency for now - use mock data instead
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchRecentNotifications();
  }, []);

  const fetchRecentNotifications = async () => {
    try {
      setLoading(true);
      // Mock notifications - replace with real API call
      const mockNotifications = [
        {
          id: 1,
          type: 'trip-update',
          title: 'Emma picked up successfully',
          message: 'Emma Johnson has been safely picked up from school.',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          read: false,
          urgent: false,
          child: 'Emma Johnson',
          icon: '🚌'
        },
        {
          id: 2,
          type: 'trip-delay',
          title: 'Trip delay alert',
          message: 'Liam Johnson\'s drop-off is delayed by 10 minutes due to traffic.',
          timestamp: new Date(Date.now() - 900000), // 15 minutes ago
          read: false,
          urgent: true,
          child: 'Liam Johnson',
          icon: '⏰'
        },
        {
          id: 3,
          type: 'system',
          title: 'New message from coordinator',
          message: 'John Smith sent you a message regarding tomorrow\'s schedule.',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          read: true,
          urgent: false,
          icon: '💬'
        },
        {
          id: 4,
          type: 'safety',
          title: 'Safety check completed',
          message: 'All safety protocols verified for today\'s transportation.',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          read: true,
          urgent: false,
          icon: '🛡️'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationColor = (type, urgent) => {
    if (urgent) return 'border-l-error-500 bg-error-50/30';
    switch (type) {
      case 'safety': return 'border-l-green-500 bg-green-50/30';
      case 'system': return 'border-l-blue-500 bg-blue-50/30';
      default: return 'border-l-yellow-500 bg-yellow-50/30';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.urgent && !n.read).length;
  const displayNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
      id="notifications-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative p-3 bg-accent-50 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            <Bell className="w-6 h-6 text-accent-600" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full flex items-center justify-center"
              >
                <span className="text-xs text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.div>
            )}
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Notifications Center</h3>
            <p className="text-sm text-neutral-600">Stay updated on your children's safety</p>
          </div>
        </div>

        {urgentCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 bg-error-100 border border-error-200 rounded-full"
          >
            <AlertTriangle className="w-4 h-4 text-error-600 animate-pulse" />
            <span className="text-sm font-semibold text-error-700">
              {urgentCount} Urgent
            </span>
          </motion.div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="animate-pulse bg-neutral-100 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Notifications List */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {displayNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-neutral-900 mb-1">All caught up!</h4>
                <p className="text-neutral-600">No new notifications at this time.</p>
              </motion.div>
            ) : (
              <>
                {displayNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative border-l-4 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      notification.urgent
                        ? 'bg-error-50 border-error-300 hover:bg-error-100/50'
                        : `bg-neutral-50 ${getNotificationColor(notification.type)}`
                    } ${!notification.read ? 'ring-1 ring-inset ring-blue-200' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.urgent
                          ? 'bg-error-100 text-error-600'
                          : notification.type === 'safety'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <span className="text-lg">{notification.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${
                            notification.urgent
                              ? 'text-error-900'
                              : notification.read
                              ? 'text-neutral-700'
                              : 'text-neutral-900'
                          }`}>
                            {notification.title}
                          </h4>

                          {/* Unread Indicator */}
                          {!notification.read && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"
                            />
                          )}
                        </div>

                        <p className="text-sm text-neutral-600 mb-2 leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3 text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {notification.child && (
                              <span className="bg-neutral-200 px-2 py-0.5 rounded-full">
                                👶 {notification.child}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {notification.type === 'trip-update' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                              >
                                <Phone className="w-3 h-3" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-1 text-neutral-500 hover:bg-neutral-100 rounded"
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Show All / Show Less Toggle */}
                {notifications.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-3 border-t border-neutral-200"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setShowAll(!showAll)}
                      className="w-full text-accent-600 hover:text-accent-700 hover:bg-accent-50"
                    >
                      <span className="flex items-center gap-2">
                        {showAll ? 'Show Less' : `View ${notifications.length - 3} More`}
                        <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
                      </span>
                    </Button>
                  </motion.div>
                )}

                {/* Footer Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-neutral-200"
                >
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-accent-300 text-accent-700 hover:bg-accent-50"
                      onClick={() => window.location.href = '#/notifications'}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Full Notifications
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setNotifications([])}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Access Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-4 border-t border-neutral-200"
      >
        <div className="flex items-center justify-center gap-3 text-sm text-neutral-600">
          <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
            🛡️ Safety First
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            📡 Real-time Updates
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            ✅ Instant Alerts
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickNotificationsWidget;
