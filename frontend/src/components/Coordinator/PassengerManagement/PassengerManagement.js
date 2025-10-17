import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  Bus
} from 'lucide-react';
import { Button } from '../../ui/button';

const PassengerManagement = () => {
  const { getToken } = useAuth();
  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    inactive: 0
  });

  const mockPassengers = [
    {
      id: 1,
      childName: 'Emma Johnson',
      parentName: 'Sarah Johnson',
      grade: 'Grade 3',
      age: 8,
      route: 'Colombo → Kandy',
      currentTrip: 'TRIP-1001',
      status: 'active',
      assignedTrips: 12,
      lastTrip: '2025-10-17',
      contact: '+94 77 123 4567',
      email: 'sarah.j@email.com',
      address: '123 Main St, Colombo'
    },
    {
      id: 2,
      childName: 'Liam Chen',
      parentName: 'Mike Chen',
      grade: 'Grade 5',
      age: 10,
      route: 'Galle → Colombo',
      currentTrip: 'TRIP-1002',
      status: 'active',
      assignedTrips: 8,
      lastTrip: '2025-10-17',
      contact: '+94 77 234 5678',
      email: 'mike.c@email.com',
      address: '456 Oak Ave, Galle'
    },
    {
      id: 3,
      childName: 'Aisha Patel',
      parentName: 'Priya Patel',
      grade: 'Grade 2',
      age: 7,
      route: 'Colombo → Negombo',
      currentTrip: null,
      status: 'scheduled',
      assignedTrips: 15,
      lastTrip: '2025-10-16',
      contact: '+94 77 345 6789',
      email: 'priya.p@email.com',
      address: '789 Palm Rd, Negombo'
    },
    {
      id: 4,
      childName: 'Noah Fernando',
      parentName: 'David Fernando',
      grade: 'Grade 4',
      age: 9,
      route: null,
      currentTrip: null,
      status: 'inactive',
      assignedTrips: 0,
      lastTrip: null,
      contact: '+94 77 456 7890',
      email: 'david.f@email.com',
      address: '321 Pine St, Colombo'
    },
    {
      id: 5,
      childName: 'Zara Kumar',
      parentName: 'Ravi Kumar',
      grade: 'Grade 6',
      age: 11,
      route: 'Jaffna → Colombo',
      currentTrip: null,
      status: 'completed',
      assignedTrips: 25,
      lastTrip: '2025-10-17',
      contact: '+94 77 567 8901',
      email: 'ravi.k@email.com',
      address: '654 Cedar Ln, Jaffna'
    }
  ];

  useEffect(() => {
    const loadPassengers = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch('http://localhost:5005/api/children/coordinator/list', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch children data');
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        if (data.success && data.data) {
          console.log('Children data received:', data.data.length, 'children'); // Debug log
          console.log('Raw data sample:', data.data[0]); // Debug log

          // Transform the backend data to match our component structure
          const transformedPassengers = data.data.map(child => ({
            id: child._id,
            childName: child.firstName + ' ' + (child.lastName || ''),
            parentName: child.parent?.name || child.parent?.email || 'Unknown Parent',
            grade: child.grade ? child.grade.replace('grade', 'Grade ') : 'Not specified',
            age: child.age || 'Not specified',
            route: null, // This would need to be populated from trip assignments later
            currentTrip: null, // This would need to be populated from active assignments later
            status: child.status === 'active' && child.isActive ? 'active' : 'inactive',
            assignedTrips: 0, // This would need to be calculated from trip history later
            lastTrip: child.updatedAt ? new Date(child.updatedAt).toISOString().split('T')[0] : null,
            contact: child.parent?.phoneNumber || 'Not available',
            email: child.parent?.email || 'Not available',
            address: child.pickupLocation?.address || child.dropoffLocation?.address || 'Not available'
          }));

          console.log('Transformed passengers:', transformedPassengers); // Debug log

          setPassengers(transformedPassengers);
          setFilteredPassengers(transformedPassengers);
        } else {
          console.log('No success in API response, data:', data);
          // Keep as mock data for now but log the issue
        }
      } catch (error) {
        console.error('Error loading passengers from API:', error);
        // Fallback to mock data if API fails
        console.log('Falling back to mock data');
        setPassengers(mockPassengers);
        setFilteredPassengers(mockPassengers);
      } finally {
        setLoading(false);
      }
    };

    loadPassengers();
  }, [getToken]);

  useEffect(() => {
    let filtered = passengers.filter(passenger => {
      const matchesSearch = passenger.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           passenger.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           passenger.route?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || passenger.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredPassengers(filtered);
  }, [passengers, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-800 border-success-200';
      case 'scheduled': return 'bg-info-100 text-info-800 border-info-200';
      case 'completed': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'inactive': return 'bg-neutral-100 text-neutral-600 border-neutral-300';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle2;
      case 'scheduled': return Clock;
      case 'completed': return CheckCircle2;
      case 'inactive': return AlertTriangle;
      default: return Clock;
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
          {[...Array(4)].map((_, i) => (
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
            <Users className="w-6 h-6 text-primary-600" />
            Passenger Management
          </h2>
          <p className="text-neutral-600 mt-1">
            Manage student information, transportation assignments, and parent communications
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Passenger
          </Button>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Passengers', value: passengers.length, color: 'primary' },
          { label: 'Active Today', value: passengers.filter(p => p.status === 'active').length, color: 'success' },
          { label: 'Scheduled', value: passengers.filter(p => p.status === 'scheduled').length, color: 'info' },
          { label: 'No Assignments', value: passengers.filter(p => !p.route).length, color: 'neutral' }
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by child name, parent name, or route..."
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
              <option value="completed">Completed Today</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Passengers List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPassengers.map((passenger, index) => (
            <motion.div
              key={passenger.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold text-lg">
                      {passenger.childName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      {passenger.childName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                      <span>Parent: {passenger.parentName}</span>
                      <span>Grade {passenger.grade}</span>
                      <span>Age {passenger.age}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(passenger.status)} border`}>
                        {React.createElement(getStatusIcon(passenger.status), { className: "w-4 h-4" })}
                        <span className="capitalize">{passenger.status}</span>
                      </div>

                      {passenger.currentTrip && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium border border-primary-200">
                          <Bus className="w-4 h-4" />
                          Trip {passenger.currentTrip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-700">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-700">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {passenger.route && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-700">{passenger.route}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">
                    {passenger.assignedTrips} trips completed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">
                    Last trip: {passenger.lastTrip ? new Date(passenger.lastTrip).toLocaleDateString() : 'Never'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">
                    Satisfaction: 4.8/5
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {passenger.contact}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {passenger.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {passenger.address}
                  </span>
                </div>

                <div className="flex gap-2">
                  {passenger.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-warning-300 text-warning-700 hover:bg-warning-50"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Report Issue
                    </Button>
                  )}

                  {passenger.status === 'inactive' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-success-300 text-success-700 hover:bg-success-50"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Assign Route
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPassengers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-medium border border-neutral-200 p-12 text-center"
          >
            <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No passengers found</h3>
            <p className="text-neutral-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No passengers registered in the system yet'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Passenger
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PassengerManagement;
