import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { Button } from '../../ui/button';

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const mockTrips = [
    {
      id: 1001,
      tripId: 'TRIP-1001',
      route: 'Colombo → Kandy',
      status: 'active',
      passengers: 42,
      capacity: 50,
      driver: 'Sarah Johnson',
      bus: 'SG-456',
      startTime: '08:00 AM',
      endTime: '12:00 PM',
      date: '2025-10-17',
      eta: '45 min',
      progress: 65
    },
    {
      id: 1002,
      tripId: 'TRIP-1002',
      route: 'Galle → Colombo',
      status: 'active',
      passengers: 38,
      capacity: 45,
      driver: 'Mike Chen',
      bus: 'SG-789',
      startTime: '02:00 PM',
      endTime: '06:00 PM',
      date: '2025-10-17',
      eta: '10 min',
      progress: 90
    },
    {
      id: 1003,
      tripId: 'TRIP-1003',
      route: 'Colombo → Negombo',
      status: 'scheduled',
      passengers: 0,
      capacity: 40,
      driver: 'Priya Fernando',
      bus: 'SG-234',
      startTime: '09:30 AM',
      endTime: '10:30 AM',
      date: '2025-10-17',
      eta: null,
      progress: 0
    },
    {
      id: 1004,
      tripId: 'TRIP-1004',
      route: 'Jaffna → Colombo',
      status: 'completed',
      passengers: 35,
      capacity: 40,
      driver: 'Ravi Kumar',
      bus: 'SG-567',
      startTime: '06:00 AM',
      endTime: '02:00 PM',
      date: '2025-10-17',
      eta: null,
      progress: 100
    },
    {
      id: 1005,
      tripId: 'TRIP-1005',
      route: 'Colombo → Matara',
      status: 'delayed',
      passengers: 28,
      capacity: 45,
      driver: 'Anjali Patel',
      bus: 'SG-890',
      startTime: '01:00 PM',
      endTime: '07:00 PM',
      date: '2025-10-17',
      eta: '2 hours',
      progress: 30
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const loadTrips = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTrips(mockTrips);
        setFilteredTrips(mockTrips);
      } catch (error) {
        console.error('Error loading trips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  useEffect(() => {
    let filtered = trips.filter(trip => {
      const matchesSearch = trip.tripId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trip.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trip.driver.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredTrips(filtered);
  }, [trips, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800 border-success-200';
      case 'scheduled': return 'bg-info-100 text-info-800 border-info-200';
      case 'completed': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'delayed': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'canceled': return 'bg-error-100 text-error-800 border-error-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle2;
      case 'scheduled': return Clock;
      case 'completed': return CheckCircle2;
      case 'delayed': return AlertTriangle;
      case 'canceled': return XCircle;
      default: return Clock;
    }
  };

  const handleCreateTrip = () => {
    setSelectedTrip(null);
    setShowForm(true);
  };

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    // Could open a modal or navigate to detailed view
    console.log('Viewing trip:', trip);
  };

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setShowForm(true);
  };

  const handleDeleteTrip = async (trip) => {
    if (!window.confirm(`Are you sure you want to delete Trip ${trip.tripId}?`)) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setTrips(prev => prev.filter(t => t.id !== trip.id));
      console.log('Trip deleted:', trip.tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
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

        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
            >
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-neutral-200 rounded w-32"></div>
                  <div className="h-6 bg-neutral-200 rounded w-20"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                </div>
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
            <Bus className="w-6 h-6 text-primary-600" />
            Trip Management
          </h2>
          <p className="text-neutral-600 mt-1">
            Monitor and manage transportation routes and schedules
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleCreateTrip}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Trip
          </Button>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search trips by ID, route, or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trip Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: trips.length, color: 'primary' },
          { label: 'Active Now', value: trips.filter(t => t.status === 'active').length, color: 'success' },
          { label: 'Scheduled', value: trips.filter(t => t.status === 'scheduled').length, color: 'info' },
          { label: 'Completed Today', value: trips.filter(t => t.status === 'completed').length, color: 'neutral' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-medium border border-neutral-200 p-6`}
          >
            <div className="text-center">
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Bus className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-neutral-900">{trip.tripId}</span>
                  </div>

                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)} border`}>
                    {React.createElement(getStatusIcon(trip.status), { className: "w-4 h-4" })}
                    <span className="capitalize">{trip.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewTrip(trip)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTrip(trip)}
                    className="text-neutral-600 hover:text-neutral-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTrip(trip)}
                    className="text-error-600 hover:text-error-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">{trip.route}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">
                    {trip.startTime} - {trip.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">
                    {trip.passengers}/{trip.capacity} passengers
                  </span>
                </div>

                <div className="text-sm text-neutral-600">
                  <span className="font-medium">{trip.driver}</span> • Bus {trip.bus}
                </div>
              </div>

              {/* Progress Bar for Active Trips */}
              {trip.status === 'active' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700">Trip Progress</span>
                    <span className="text-sm text-neutral-600">{trip.progress}% complete</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trip.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-primary-600 h-2 rounded-full"
                    />
                  </div>
                  {trip.eta && (
                    <div className="text-xs text-neutral-500 mt-1">
                      Estimated arrival: {trip.eta}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div className="text-xs text-neutral-500">
                  Last updated: 2 minutes ago
                </div>

                <div className="flex gap-2">
                  {trip.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-warning-300 text-warning-700 hover:bg-warning-50"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Report Issue
                    </Button>
                  )}

                  {trip.status === 'scheduled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-success-300 text-success-700 hover:bg-success-50"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Start Trip
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTrips.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-12 text-center"
          >
            <Bus className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No trips found</h3>
            <p className="text-neutral-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first trip to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={handleCreateTrip} className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create First Trip
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TripManagement;
