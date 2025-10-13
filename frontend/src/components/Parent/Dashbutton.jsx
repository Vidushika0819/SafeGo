import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import QuickNotificationsWidget from './QuickNotificationsWidget';

const Dashbutton = ({ onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentCount, setRecentCount] = useState(3);
  const [urgentCount, setUrgentCount] = useState(1);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // Reset counts when opened
    if (!showNotifications) {
      setTimeout(() => {
        setRecentCount(0);
        setUrgentCount(0);
      }, 1000);
    }
  };

  return (
    <>
      {/* Floating Notification Button - TOP RIGHT CORNER - SAFE GO COLORS */}
      <motion.button
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 20px 40px rgba(59,130,246,0.3), 0 10px 20px rgba(245,158,11,0.2)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleNotifications}
        className="fixed top-6 right-6 z-50 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white rounded-2xl p-5 shadow-xl border-3 border-white/50 backdrop-blur-md transform-gpu group"
        style={{
          background: 'linear-gradient(135deg, #3B82F6, #2563EB, #F59E0B)',
          boxShadow: '0 12px 25px rgba(59,130,246,0.3), 0 6px 15px rgba(245,158,11,0.2), 0 3px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div className="relative">
          {/* Primary pulse glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-2xl bg-primary-400/20"
          />

          {/* Bell Icon */}
          <div className="relative z-10">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Bell className="w-6 h-6 text-white drop-shadow-lg" />
            </motion.div>
          </div>

          {/* Notification Badge - Modern Design */}
          {recentCount > 0 && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 400 }}
              className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] h-[20px] flex items-center justify-center border border-white/70 shadow-lg"
              style={{
                boxShadow: '0 3px 8px rgba(245,158,11,0.4), 0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {recentCount > 99 ? '99+' : recentCount}
            </motion.div>
          )}

          {/* Urgent Indicator - Subtle but visible */}
          {urgentCount > 0 && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1.5 -left-1.5 w-3 h-3 border-2 border-secondary-400 bg-secondary-300 rounded-full shadow-sm"
              style={{
                boxShadow: '0 0 6px rgba(245,158,11,0.6)'
              }}
            />
          )}

          {/* Floating notification particles */}
          {recentCount > 0 && (
            <>
              <motion.div
                animate={{
                  y: [-5, -15, -5],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 0
                }}
                className="absolute top-1 right-1 w-1 h-1 bg-secondary-200 rounded-full"
              />
              <motion.div
                animate={{
                  y: [-3, -12, -3],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute top-2 right-0.5 w-0.5 h-0.5 bg-primary-200 rounded-full"
              />
            </>
          )}
        </div>
      </motion.button>

      {/* Notification Tooltip */}
      <AnimatePresence>
        {!showNotifications && recentCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-40 bg-white rounded-lg shadow-xl border p-4 max-w-xs pointer-events-none"
          >
            <div className="flex items-start gap-3">
              {urgentCount > 0 ? (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="text-error-500"
                >
                  <AlertTriangle className="w-5 h-5" />
                </motion.div>
              ) : (
                <Bell className="w-5 h-5 text-primary-500" />
              )}
              <div>
                <h4 className="font-semibold text-neutral-900 text-sm">New Safety Notifications</h4>
                <p className="text-neutral-600 text-xs mt-1">
                  {urgentCount > 0
                    ? `${urgentCount} urgent alert${urgentCount > 1 ? 's' : ''} - Immediate action needed`
                    : `${recentCount} safety notification${recentCount > 1 ? 's' : ''} available`
                  }
                </p>
                <div className="flex items-center gap-1 mt-2 text-primary-600 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  Tap to view
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Notification Modal */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={toggleNotifications}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 left-4 right-4 bottom-20 bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <Bell className="w-7 h-7 text-primary-600" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">🛡️ Safety Notification Center</h2>
                    <p className="text-neutral-600 text-sm">Critical updates on your children's transportation safety</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleNotifications}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </motion.button>
              </div>

              {/* Safety Priority Banner */}
              {urgentCount > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="bg-error-50 border-b border-error-200 px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="p-2 bg-error-100 rounded-full"
                    >
                      <AlertTriangle className="w-5 h-5 text-error-600" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-error-900">🚨 URGENT SAFETY ALERTS</h3>
                      <p className="text-error-700 text-sm">Immediate action required for child safety concerns</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notification Content */}
              <div className="flex-1 overflow-auto">
                <QuickNotificationsWidget />
              </div>

              {/* Footer Actions */}
              <div className="border-t border-neutral-200 p-6 bg-neutral-50">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      toggleNotifications();
                      if (onNavigate) onNavigate('notifications');
                    }}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Bell className="w-5 h-5" />
                    Full Safety Center
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleNotifications}
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashbutton;
