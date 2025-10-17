import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import {
  Plus,
  Bus,
  Users,
  BarChart3,
  AlertTriangle,
  MessageSquare,
  Clock,
  CheckCircle2,
  MapPin,
  UserCheck,
  TrendingUp,
  Settings,
  Shield
} from 'lucide-react';

const CoordinatorActions = ({ onNavigate }) => {
  const [tripsLoading, setTripsLoading] = useState(false);
  const [passengersLoading, setPassengersLoading] = useState(false);
  const [activeTrips, setActiveTrips] = useState(8);
  const [awaitingPassengers, setAwaitingPassengers] = useState(5);
  const [recentAction, setRecentAction] = useState(null);

  useEffect(() => {
    // Auto-update stats every 30 seconds
    const interval = setInterval(() => {
      // Simulate stat updates
      setActiveTrips(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0)));
      setAwaitingPassengers(prev => Math.max(0, prev + (Math.random() > 0.6 ? 1 : 0) - (Math.random() > 0.7 ? 1 : 0)));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateTrip = async () => {
    setTripsLoading(true);
    try {
      // Simulate API call for creating trip
      await new Promise(resolve => setTimeout(resolve, 1500));

      setRecentAction({
        type: 'trip',
        title: 'New Trip Created',
        description: 'Morning route Colombo → Kandy has been scheduled',
        timestamp: new Date(),
        success: true
      });

      setActiveTrips(prev => prev + 1);

      // Navigate to trips view after success
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('trips');
        }
      }, 2000);
    } catch (error) {
      console.error('Trip creation error:', error);
      setRecentAction({
        type: 'error',
        title: 'Trip Creation Failed',
        description: 'Please check your inputs and try again',
        timestamp: new Date(),
        success: false
      });
    } finally {
      setTripsLoading(false);
    }
  };

  const handlePassengerAction = async () => {
    setPassengersLoading(true);
    try {
      // Simulate API call for passenger management
      await new Promise(resolve => setTimeout(resolve, 1200));

      setRecentAction({
        type: 'passenger',
        title: 'Passengers Updated',
        description: '5 passengers have been assigned to morning routes',
        timestamp: new Date(),
        success: true
      });

      setAwaitingPassengers(prev => Math.max(0, prev - 5));

      // Navigate to passengers view after success
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('passengers');
        }
      }, 1500);
    } catch (error) {
      console.error('Passenger action error:', error);
      setRecentAction({
        type: 'error',
        title: 'Update Failed',
        description: 'Passenger assignments could not be completed',
        timestamp: new Date(),
        success: false
      });
    } finally {
      setPassengersLoading(false);
    }
  };

  const handleEmergencyProtocol = () => {
    alert('🚨 COORDINATOR EMERGENCY PROTOCOL\n\nImmediate Actions Required:\n\n1. 📞 Notify all bus drivers immediately\n2. 🔄 Activate emergency routes if needed\n3. 👥 Account for all passengers on active trips\n4. 📱 Communicate with parents directly\n5. 📊 Update system status to EMERGENCY\n\nEmergency Contact:\n📞 Emergency Hotline: (555) 911-COORD\n📧 Emergency Support: emergency@safego.com\n\nStay calm and follow safety protocols! 🛡️');
  };

  const quickActions = [
    {
      id: 'create-trip',
      title: 'Schedule New Trip',
      subtitle: `${activeTrips} trips running`,
      description: 'Create and schedule a new transportation route',
      icon: <Plus className="w-7 h-7" />,
      color: 'primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      iconBg: 'bg-primary-100',
      available: true,
      highlight: true,
      loading: tripsLoading,
      onClick: handleCreateTrip
    },
    {
      id: 'student-tracking',
      title: 'Student Tracking',
      subtitle: 'Check-in/check-out',
      description: 'Monitor and update student boarding status during trips',
      icon: <UserCheck className="w-7 h-7" />,
      color: 'info',
      bgColor: 'bg-info-50',
      borderColor: 'border-info-200',
      iconBg: 'bg-info-100',
      available: true,
      highlight: true,
      loading: false,
      onClick: () => onNavigate && onNavigate('student-tracking')
    },
    {
      id: 'manage-passengers',
      title: 'Manage Passengers',
      subtitle: `${awaitingPassengers} awaiting assignment`,
      description: 'Assign passengers and manage trip capacity',
      icon: <Users className="w-7 h-7" />,
      color: 'success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconBg: 'bg-success-100',
      available: awaitingPassengers > 0,
      highlight: awaitingPassengers > 0,
      loading: passengersLoading,
      onClick: handlePassengerAction
    },
    {
      id: 'monitor-trips',
      title: 'Live Monitoring',
      subtitle: 'Real-time tracking',
      description: 'Monitor active trips and driver locations',
      icon: <MapPin className="w-7 h-7" />,
      color: 'secondary',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
      iconBg: 'bg-secondary-100',
      available: activeTrips > 0
    },
    {
      id: 'generate-reports',
      title: 'Analytics Report',
      subtitle: 'Daily performance',
      description: 'Generate comprehensive trip and performance reports',
      icon: <BarChart3 className="w-7 h-7" />,
      color: 'accent',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
      iconBg: 'bg-accent-100',
      available: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Success Action Animation */}
      <AnimatePresence>
        {recentAction && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.3 } }}
            className={`border rounded-xl p-6 shadow-soft ${
              recentAction.success
                ? 'bg-success-50 border-success-200'
                : 'bg-error-50 border-error-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={recentAction.success ? {
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                } : {
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                {recentAction.success ? (
                  <CheckCircle2 className="w-8 h-8 text-success-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-error-600" />
                )}
              </motion.div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${
                  recentAction.success ? 'text-success-900' : 'text-error-900'
                }`}>
                  {recentAction.title} {recentAction.success ? '✅' : '❌'}
                </h3>
                <div className={`bg-white rounded-lg p-4 border ${
                  recentAction.success ? 'border-success-200' : 'border-error-200'
                }`}>
                  <p className={`text-sm ${
                    recentAction.success ? 'text-success-800' : 'text-error-800'
                  }`}>
                    {recentAction.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <span className="text-primary-600">⚡</span>
            Coordinator Actions
          </h2>
          <p className="text-neutral-600 mt-1">
            Quick access to essential coordination and management tasks
          </p>
        </div>

        {/* Emergency Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleEmergencyProtocol}
            variant="outline"
            className="border-error-300 text-error-700 hover:bg-error-50 hover:border-error-400 px-4 py-2 h-auto"
          >
            <AlertTriangle className="w-4 h-4 mr-2 text-error-500" />
            Emergency Protocol
          </Button>
        </motion.div>
      </div>

      {/* Main Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              scale: action.available && !action.loading ? 1.02 : 1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: action.available && !action.loading ? 0.98 : 1 }}
            className={`relative bg-white rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ${
              action.available && !action.loading
                ? `${action.borderColor} ${action.bgColor} hover:shadow-lg hover:border-opacity-60`
                : 'border-neutral-200 bg-neutral-50 cursor-not-allowed'
            }`}
            onClick={() => action.available && !action.loading && action.onClick && action.onClick()}
          >
            {/* Highlight Badge */}
            {action.highlight && action.available && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-3 right-3 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10"
              >
                {action.id === 'create-trip' ? 'Priority' : 'Urgent'}
              </motion.div>
            )}

            {/* Loading Overlay */}
            {action.loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"
                />
              </div>
            )}

            <div className="p-6">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center ${
                action.available && !action.loading
                  ? `${action.iconBg} text-primary-700`
                  : 'bg-neutral-200 text-neutral-400'
              }`}>
                {action.icon}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div>
                  <h3 className={`text-lg font-semibold ${
                    action.available && !action.loading ? 'text-neutral-900' : 'text-neutral-500'
                  }`}>
                    {action.title}
                  </h3>
                  {action.subtitle && (
                    <p className={`text-sm font-medium ${
                      action.available && !action.loading ? 'text-primary-600' : 'text-neutral-400'
                    }`}>
                      {action.subtitle}
                    </p>
                  )}
                </div>

                <p className={`text-sm leading-relaxed ${
                  action.available && !action.loading ? 'text-neutral-600' : 'text-neutral-400'
                }`}>
                  {action.description}
                </p>

                {/* Action Indicator */}
                {action.available && !action.loading && (
                  <div className="pt-2">
                    <span className="inline-flex items-center text-sm font-medium text-primary-600">
                      Execute →
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Actions */}
      <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'system-status',
              title: 'System Health',
              description: 'Monitor fleet and system performance',
              icon: <Settings className="w-5 h-5" />,
              onClick: () => onNavigate && onNavigate('settings')
            },
            {
              id: 'communication',
              title: 'Team Communication',
              description: 'Coordinate with drivers and staff',
              icon: <MessageSquare className="w-5 h-5" />,
              onClick: () => alert('Communication center coming soon! 📱')
            },
            {
              id: 'safety-checks',
              title: 'Safety Protocols',
              description: 'Review and update safety measures',
              icon: <Shield className="w-5 h-5" />,
              onClick: () => alert('Safety protocol manager launching soon! 🛡️')
            }
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={item.onClick}
              className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-900 text-sm">{item.title}</h4>
                  <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-center gap-8 text-center">
          <div>
            <Bus className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">{activeTrips}</div>
            <div className="text-sm opacity-90">Trips Active</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/30"></div>
          <div>
            <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">{awaitingPassengers}</div>
            <div className="text-sm opacity-90">Awaiting Assignment</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/30"></div>
          <div>
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">94.7%</div>
            <div className="text-sm opacity-90">On-Time Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorActions;
