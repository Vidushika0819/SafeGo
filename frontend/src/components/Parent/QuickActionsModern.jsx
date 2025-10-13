import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Plus, UserPlus, Bus, Armchair, MessageSquare, AlertTriangle, History, Bell, CheckCircle2, Clock, Shield } from 'lucide-react';

const QuickActionsModern = ({ onNavigate }) => {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(3);
  const [recentBooking, setRecentBooking] = useState(null);

  useEffect(() => {
    // Auto-update available seats every 30 seconds
    const interval = setInterval(() => {
      // Simulate seat updates
      setAvailableSeats(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : 0)));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleBookSeat = async () => {
    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Fetch unassigned children
      const childrenResponse = await fetch('http://localhost:5005/api/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!childrenResponse.ok) throw new Error('Failed to load children');

      const childrenData = await childrenResponse.json();
      const unassignedChildren = childrenData.data.filter(child => !child.tripAssigned);

      if (unassignedChildren.length === 0) {
        alert('All your children are already assigned to trips. Check the trips section for status updates.');
        return;
      }

      // Check for available trips
      const tripsResponse = await fetch('http://localhost:5005/api/trips/available', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const tripsData = await tripsResponse.json();
      const availableTrips = tripsData.data.filter(trip => trip.availableSeats > 0);

      if (availableTrips.length === 0) {
        alert('No available seats found on any trips. Try again later or contact support.');
        return;
      }

      // Auto-assign first available child to first available trip
      const childToAssign = unassignedChildren[0];
      const selectedTrip = availableTrips[0];

      const assignmentResponse = await fetch('http://localhost:5005/api/trip-assignments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: childToAssign._id,
          tripId: selectedTrip._id,
          assignedBy: 'parent-auto-quickbook'
        })
      });

      if (assignmentResponse.ok) {
        const newBooking = {
          childName: `${childToAssign.firstName} ${childToAssign.lastName}`,
          tripName: selectedTrip.routeName,
          departureTime: selectedTrip.departureTime,
          busNumber: selectedTrip.busNumber,
          timestamp: new Date()
        };

        setRecentBooking(newBooking);
        setAvailableSeats(prev => Math.max(0, prev - 1));

        // Show success animation
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('trips');
          }
        }, 2000);
      } else {
        const errorData = await assignmentResponse.json();
        throw new Error(errorData.message || 'Assignment failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Failed to book seat: ${error.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleEmergencyContact = () => {
    alert('🚨 EMERGENCY SAFETY PROTOCOL\n\nIf this is a SAFETY EMERGENCY:\n📞 Call: (555) 911-SAFE immediately\n📱 Text: SAFE to 555-123\n\nFor transportation issues:\n📧 support@safego.com\n💬 Use Messages section below\n\nStay safe! 🛡️');
  };

  const quickActions = [
    {
      id: 'book-seat',
      title: 'Book a Seat Today',
      subtitle: availableSeats > 0 ? `${availableSeats} seats available` : 'No seats available',
      description: 'Instantly assign your child to an available trip',
      icon: <Armchair className="w-7 h-7" />,
      color: 'primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      iconBg: 'bg-primary-100',
      available: availableSeats > 0,
      highlight: availableSeats > 0,
      loading: bookingLoading
    },
    {
      id: 'add-child',
      title: 'Add New Child',
      subtitle: 'Register your child',
      description: 'Add a new child to the transportation system',
      icon: <UserPlus className="w-7 h-7" />,
      color: 'primary',
      bgColor: 'bg-neutral-50',
      borderColor: 'border-neutral-200',
      iconBg: 'bg-neutral-100'
    },
    {
      id: 'view-trips',
      title: 'View Active Trips',
      subtitle: 'Real-time monitoring',
      description: 'Track current and upcoming transportation',
      icon: <Bus className="w-7 h-7" />,
      color: 'success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconBg: 'bg-success-100'
    },
    {
      id: 'contact-admin',
      title: 'Contact Support',
      subtitle: 'Get help instantly',
      description: 'Message administrators and get instant support',
      icon: <MessageSquare className="w-7 h-7" />,
      color: 'secondary',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
      iconBg: 'bg-secondary-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Success Booking Animation */}
      <AnimatePresence>
        {recentBooking && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="bg-success-50 border border-success-200 rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <CheckCircle2 className="w-8 h-8 text-success-600" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-success-900 mb-2">
                  Seat Booked Successfully! 🎉
                </h3>
                <div className="bg-white rounded-lg p-4 border border-success-200">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-neutral-700">Child:</span>
                      <span className="text-neutral-900 ml-2">{recentBooking.childName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Trip:</span>
                      <span className="text-neutral-900 ml-2">{recentBooking.tripName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Departure:</span>
                      <span className="text-neutral-900 ml-2">
                        {new Date(recentBooking.departureTime).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700">Bus:</span>
                      <span className="text-neutral-900 ml-2">{recentBooking.busNumber}</span>
                    </div>
                  </div>
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
            Quick Actions
          </h2>
          <p className="text-neutral-600 mt-1">
            Fast access to essential transportation management tasks
          </p>
        </div>

        {/* Emergency Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleEmergencyContact}
            variant="outline"
            className="border-error-300 text-error-700 hover:bg-error-50 hover:border-error-400 px-4 py-2 h-auto"
          >
            <AlertTriangle className="w-4 h-4 mr-2 text-error-500" />
            Emergency
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
              scale: action.available ? 1.02 : 1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: action.available ? 0.98 : 1 }}
            className={`relative bg-white rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ${
              action.available
                ? `${action.borderColor} ${action.bgColor} hover:shadow-lg hover:border-opacity-60`
                : 'border-neutral-200 bg-neutral-50 cursor-not-allowed'
            }`}
            onClick={() => action.available && !action.loading && (
              action.id === 'book-seat' ? handleBookSeat() :
              action.id === 'add-child' && onNavigate ? onNavigate('children') :
              action.id === 'view-trips' && onNavigate ? onNavigate('trips') :
              action.id === 'contact-admin' && onNavigate ? onNavigate('messages') :
              null
            )}
          >
            {/* Highlight Badge */}
            {action.highlight && action.available && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-3 right-3 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10"
              >
                Available
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
                action.available
                  ? `${action.iconBg} text-primary-700`
                  : 'bg-neutral-200 text-neutral-400'
              }`}>
                {action.icon}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div>
                  <h3 className={`text-lg font-semibold ${
                    action.available ? 'text-neutral-900' : 'text-neutral-500'
                  }`}>
                    {action.title}
                  </h3>
                  {action.subtitle && (
                    <p className={`text-sm font-medium ${
                      action.available ? 'text-primary-600' : 'text-neutral-400'
                    }`}>
                      {action.subtitle}
                    </p>
                  )}
                </div>

                <p className={`text-sm leading-relaxed ${
                  action.available ? 'text-neutral-600' : 'text-neutral-400'
                }`}>
                  {action.description}
                </p>

                {/* Action Indicator */}
                {action.available && (
                  <div className="pt-2">
                    <span className={`inline-flex items-center text-sm font-medium ${
                      action.id === 'book-seat' ? 'text-primary-600' : 'text-neutral-600'
                    }`}>
                      {action.id === 'book-seat' ? 'Book Now →' : 'Go →'}
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
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Additional Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'trip-history',
              title: 'Trip History',
              description: 'View past transportation records',
              icon: <History className="w-5 h-5" />,
              onClick: () => onNavigate && onNavigate('trips')
            },
            {
              id: 'notifications',
              title: 'Notifications',
              description: 'Manage notification preferences',
              icon: <Bell className="w-5 h-5" />,
              onClick: () => onNavigate && onNavigate('notifications')
            },
            {
              id: 'safety',
              title: 'Safety Info',
              description: 'Transportation safety guidelines',
              icon: <Shield className="w-5 h-5" />,
              onClick: () => alert('Safety information will be available soon. Main priority is your child\'s safety! 🛡️')
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
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm opacity-90">Support Available</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/30"></div>
          <div>
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-sm opacity-90">On-Time Rate</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/30"></div>
          <div>
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm opacity-90">Safety Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsModern;
