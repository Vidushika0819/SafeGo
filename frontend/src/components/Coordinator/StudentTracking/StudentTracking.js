import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import {
  Users,
  Bus,
  UserCheck,
  UserX,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react';
import { Button } from '../../ui/button';

const StudentTracking = () => {
  const { getToken } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch real trips data from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = getToken();
        const response = await fetch('http://localhost:5005/api/trips', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();

          if (data.trips && Array.isArray(data.trips)) {
            // Transform trips data to match component structure
            const formattedTrips = data.trips.map(trip => ({
              _id: trip._id,
              tripName: trip.Trip_ID || `Trip ${trip._id}`,
              date: trip.date || new Date().toISOString().split('T')[0],
              startTime: trip.start_time || 'TBD',
              vehicle: trip.busId ? (trip.busId.busNumber || 'Bus TBD') : 'Bus TBD',
              start_location: trip.start_location || 'N/A',
              route: trip.route || 'N/A',
              end_location: trip.end_location || 'N/A',
              driver: trip.driverId ? trip.driverId.name : 'TBD'
            }));

            setTrips(formattedTrips);
          } else {
            console.error('Failed to fetch trips - invalid response format');
          }
        } else {
          console.error('Failed to fetch trips - HTTP error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      fetchStudentsForTrip();
    }
  }, [selectedTrip]);

  const fetchStudentsForTrip = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5005/api/trip-assignments/students-for-checkin?tripId=${selectedTrip}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStudents(data.data);
        }
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  const handleCheckin = async (assignmentId, studentName) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5005/api/trip-assignments/${assignmentId}/checkin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchStudentsForTrip(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Check-in failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error checking in student:', error);
      alert('Failed to check in student');
    }
  };

  const handleCheckout = async (assignmentId, studentName) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5005/api/trip-assignments/${assignmentId}/checkout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchStudentsForTrip(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Check-out failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error checking out student:', error);
      alert('Failed to check out student');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checked_in': return <CheckCircle2 className="w-4 h-4" />;
      case 'dropped_off': return <UserCheck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked_in': return 'bg-green-100 text-green-800 border-green-200';
      case 'dropped_off': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'checked_in': return 'On Board';
      case 'dropped_off': return 'Dropped Off';
      default: return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Bus className="w-6 h-6 text-blue-600" />
            Student Tracking
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor and update student check-in/check-out status during transportation
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={selectedTrip ? fetchStudentsForTrip : undefined}
            disabled={!selectedTrip || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>
      </div>

      {/* Trip Selection */}
      <div className="bg-white rounded-xl shadow-medium border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trip to Track
            </label>
            <select
              value={selectedTrip}
              onChange={(e) => setSelectedTrip(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a trip...</option>
              {trips.map(trip => (
                <option key={trip._id} value={trip._id}>
                  {trip.tripName} - {trip.route} - {trip.vehicle} ({trip.startTime})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      {selectedTrip && (
        <div className="bg-white rounded-xl shadow-medium border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Students on Selected Trip
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {students.length} students assigned
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No students found</h4>
              <p className="text-gray-500">No students are assigned to this trip or all have been processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {students.map((assignment) => (
                <motion.div
                  key={assignment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {assignment.child.firstName.charAt(0)}{assignment.child.lastName?.charAt(0) || ''}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {assignment.child.firstName} {assignment.child.lastName || ''}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Grade {assignment.child.grade} • Parent: {assignment.parent?.email || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Status Badge */}
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(assignment.checkinStatus)}`}>
                        {getStatusIcon(assignment.checkinStatus)}
                        <span>{getStatusText(assignment.checkinStatus)}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {assignment.checkinStatus === 'pending' && (
                          <Button
                            onClick={() => handleCheckin(assignment._id, `${assignment.child.firstName} ${assignment.child.lastName}`)}
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Check In
                          </Button>
                        )}

                        {assignment.checkinStatus === 'checked_in' && (
                          <Button
                            onClick={() => handleCheckout(assignment._id, `${assignment.child.firstName} ${assignment.child.lastName}`)}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Check Out
                          </Button>
                        )}

                        {assignment.checkinStatus === 'dropped_off' && (
                          <div className="text-sm text-gray-500">
                            Completed
                            {assignment.checkoutTimestamp && (
                              <div className="text-xs">
                                {new Date(assignment.checkoutTimestamp).toLocaleString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedTrip && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <Bus className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-blue-900 mb-2">Select a Trip to Begin Tracking</h3>
          <p className="text-blue-700">
            Choose a trip from the dropdown above to view and manage student check-in/checkout status.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentTracking;
