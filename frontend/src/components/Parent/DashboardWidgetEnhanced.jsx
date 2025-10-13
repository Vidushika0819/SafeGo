import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import QuickNotificationsWidget from './QuickNotificationsWidget';

const DashboardWidgetEnhanced = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Dashboard Cards */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Children Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 bg-primary-50 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Users className="w-6 h-6 text-primary-600" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-600">2</h3>
                  <p className="text-neutral-600">Active Children</p>
                </div>
              </div>
              <div className="text-right">
                <Button
                  size="sm"
                  onClick={() => window.location.href = '#/children'}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Manage
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Trips Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 bg-success-50 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Bus className="w-6 h-6 text-success-600" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-success-600">1</h3>
                  <p className="text-neutral-600">Active Trip</p>
                </div>
              </div>
              <div className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = '#/trips'}
                  className="border-success-300 text-success-700 hover:bg-success-50"
                >
                  Track
                </Button>
              </div>
            </div>

            {/* Real-time Trip Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 pt-4 border-t border-neutral-100"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Emma Johnson</span>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-green-600 font-medium">En Route</span>
                </div>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Driver: John Smith • ETA: 8:45 AM
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Safety Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="p-3 bg-green-100 rounded-full"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Safety Status: All Clear</h3>
                <p className="text-green-700 text-sm">All children are being monitored and no safety alerts are active</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-sm font-medium text-green-900">0 Alerts</div>
                <div className="text-xs text-green-600">Active</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={() => window.location.href = '#/notifications'}
              >
                View Safety Log
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Notifications Widget */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <QuickNotificationsWidget />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardWidgetEnhanced;
