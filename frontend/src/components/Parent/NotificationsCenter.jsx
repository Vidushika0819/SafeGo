import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParentNavbar from './ParentNavbar';
import { Button } from '../ui/button';
import { Bell, BellRing, CheckCircle2, AlertTriangle, Info, X, MoreVertical, Phone, MessageSquare, MapPin, Clock } from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'trip-update',
    title: 'Emma arrived at school',
    message: 'Emma Johnson has been safely dropped off at Lincoln Elementary School.',
    timestamp: '2025-10-13T08:45:00',
    read: false,
    important: true,
    actions: ['View Details', 'Contact Driver'],
    child: 'Emma Johnson',
    school: 'Lincoln Elementary School'
  },
  {
    id: 2,
    type: 'trip-delay',
    title: 'Trip delay alert',
    message: 'Liam Johnson\'s pickup is delayed by 15 minutes due to traffic.',
    timestamp: '2025-10-13T07:30:00',
    read: false,
    important: true,
    actions: ['Call Driver', 'View Location'],
    child: 'Liam Johnson',
    delay: '15 minutes'
  },
  {
    id: 3,
    type: 'system',
    title: 'Weekly transportation report',
    message: 'Your weekly transportation summary is now available.',
    timestamp: '2025-10-12T09:00:00',
    read: true,
    important: false,
    actions: ['View Report'],
    weekNumber: 41
  },
  {
    id: 4,
    type: 'maintenance',
    title: 'Scheduled maintenance',
    message: 'SafeGo will be undergoing scheduled maintenance tonight from 11 PM - 3 AM.',
    timestamp: '2025-10-12T14:00:00',
    read: false,
    important: false,
    actions: ['Mark as Read']
  },
  {
    id: 5,
    type: 'trip-update',
    title: 'Emma departed from school',
    message: 'Emma Johnson has been picked up from Lincoln Elementary School and is on the way home.',
    timestamp: '2025-10-12T15:30:00',
    read: true,
    important: false,
    actions: ['View Route', 'Contact Driver'],
    child: 'Emma Johnson'
  }
];

const NotificationsCenter = () => {
  // Remove useAuth for now to avoid undefined errors
  const user = null; // Mock user or get from context later
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'important'
  const [showOptions, setShowOptions] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const importantCount = notifications.filter(n => n.important).length;

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trip-update':
        return <CheckCircle2 className="w-5 h-5 text-success-500" />;
      case 'trip-delay':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-primary-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-neutral-500" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'trip-update':
        return 'border-l-success-500';
      case 'trip-delay':
        return 'border-l-warning-500';
      case 'system':
        return 'border-l-primary-500';
      case 'maintenance':
        return 'border-l-neutral-500';
      default:
        return 'border-l-neutral-500';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'important') return notification.important;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Modern Navbar */}
      <ParentNavbar
        user={user}
        onNavigate={() => {}}
        activeView="notifications"
        unreadNotifications={unreadCount}
      />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16 min-h-screen"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-8 h-8 text-primary-600" />
                  <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-primary-500 text-white text-sm px-2 py-1 rounded-full font-medium"
                    >
                      {unreadCount} unread
                    </motion.span>
                  )}
                </div>
                <p className="text-neutral-600">
                  Stay updated with your children's transportation and account activities
                </p>
              </div>

              {unreadCount > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={markAllAsRead}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark All Read
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                  className="flex items-center gap-2"
                >
                  <BellRing className="w-4 h-4" />
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'important' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('important')}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Important ({importantCount})
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl shadow-medium border border-neutral-200"
              >
                <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No notifications</h3>
                <p className="text-neutral-600">
                  {filter === 'unread' && "You don't have any unread notifications"}
                  {filter === 'important' && "You don't have any important notifications"}
                  {filter === 'all' && "You don't have any notifications"}
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-white rounded-xl shadow-medium border border-neutral-200 border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-primary-50/30' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg bg-neutral-50`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${
                              notification.read ? 'text-neutral-900' : 'text-neutral-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-neutral-600 mt-1">
                              {notification.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 bg-primary-500 rounded-full"
                              />
                            )}

                            {/* Notification Options Dropdown */}
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowOptions(showOptions === notification.id ? null : notification.id)}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>

                              <AnimatePresence>
                                {showOptions === notification.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg p-2 min-w-32 z-10"
                                  >
                                    {!notification.read && (
                                      <button
                                        onClick={() => {
                                          markAsRead(notification.id);
                                          setShowOptions(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded"
                                      >
                                        Mark as Read
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        deleteNotification(notification.id);
                                        setShowOptions(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded"
                                    >
                                      Delete
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        {notification.child && (
                          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                            <span className="flex items-center gap-1">
                              👶 {notification.child}
                            </span>
                            {notification.school && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {notification.school}
                              </span>
                            )}
                            {notification.delay && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Delayed by {notification.delay}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex gap-2">
                              {notification.actions.map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Handle action clicks
                                    console.log(`Action: ${action} for notification ${notification.id}`);
                                    if (action === 'View Details' || action === 'View Report') {
                                      markAsRead(notification.id);
                                    }
                                  }}
                                >
                                  {action === 'Call Driver' && <Phone className="w-3 h-3 mr-1" />}
                                  {action === 'Contact Driver' && <MessageSquare className="w-3 h-3 mr-1" />}
                                  {action === 'View Location' && <MapPin className="w-3 h-3 mr-1" />}
                                  {action}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default NotificationsCenter;
