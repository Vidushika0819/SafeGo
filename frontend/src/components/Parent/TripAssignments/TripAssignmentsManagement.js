import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import ParentNavbar from '../ParentNavbar';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Bus, Plus, History, Clock, MapPin, User, Calendar, CheckCircle2 } from 'lucide-react';
import TripAssignmentList from './TripAssignmentList';
import TripSelector from './TripSelector';
import AssignmentForm from './AssignmentForm';

const TripAssignmentsManagement = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'select-trip', 'create-form', 'edit-form'
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5005/api/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChildren(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToTrip = () => {
    setCurrentView('select-trip');
    setSelectedChild(null);
  };

  const handleTripSelected = (selectionData) => {
    // Move to create form with pre-selected data
    setSelectedChild(children.find(c => c._id === selectionData.childId));
    setCurrentView('create-form');
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setCurrentView('edit-form');
  };

  const handleCancelAssignment = () => {
    // Handled by TripAssignmentList component
  };

  const handleSaveAssignment = (assignment) => {
    // Refresh data and go back to list
    setCurrentView('list');
    setSelectedChild(null);
    setSelectedAssignment(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedChild(null);
    setSelectedAssignment(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'select-trip':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={handleCancel} className="back-btn">← Back</button>
              <h2>Assign Child to Trip</h2>
            </div>
            <div className="view-content">
              <div className="child-selection">
                <h3>Select a Child</h3>
                <div className="children-grid">
                  {children.map(child => (
                    <div
                      key={child._id}
                      className={`child-card ${selectedChild?._id === child._id ? 'selected' : ''}`}
                      onClick={() => setSelectedChild(child)}
                    >
                      <div className="child-avatar">
                        {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                      </div>
                      <div className="child-info">
                        <h4>{child.firstName} {child.lastName}</h4>
                        <p>Grade: {child.grade}</p>
                        <p>{child.schoolName}</p>
                      </div>
                      {selectedChild?._id === child._id && (
                        <div className="selection-indicator">✓ Selected</div>
                      )}
                    </div>
                  ))}
                </div>
                {selectedChild && (
                  <div className="next-step">
                    <button
                      onClick={() => setCurrentView('trip-selector')}
                      className="next-btn"
                    >
                      Next: Choose Trip
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'trip-selector':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={() => setCurrentView('select-trip')} className="back-btn">← Back</button>
              <h2>Select Trip for {selectedChild?.firstName}</h2>
            </div>
            <div className="view-content">
              <TripSelector
                selectedChild={selectedChild}
                onTripSelect={handleTripSelected}
                onCancel={() => setCurrentView('select-trip')}
              />
            </div>
          </div>
        );

      case 'create-form':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={handleCancel} className="back-btn">← Back</button>
              <h2>Create Trip Assignment</h2>
            </div>
            <div className="view-content">
              <AssignmentForm
                children={children}
                onSave={handleSaveAssignment}
                onCancel={handleCancel}
              />
            </div>
          </div>
        );

      case 'edit-form':
        return (
          <div className="view-container">
            <div className="view-header">
              <button onClick={handleCancel} className="back-btn">← Back</button>
              <h2>Edit Trip Assignment</h2>
            </div>
            <div className="view-content">
              <AssignmentForm
                assignment={selectedAssignment}
                children={children}
                onSave={handleSaveAssignment}
                onCancel={handleCancel}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="view-container">
            <div className="view-header">
              <h2>Trip Assignments</h2>
              <button onClick={handleAssignToTrip} className="primary-btn">
                + Assign to Trip
              </button>
            </div>
            <div className="view-content">
              <TripAssignmentList
                onEdit={handleEditAssignment}
                onCancel={handleCancelAssignment}
              />
            </div>
          </div>
        );
    }
  };

  const [activeTab, setActiveTab] = useState('active');
  const mockActiveTrips = [
    {
      id: 1,
      childName: 'Emma Johnson',
      destination: 'Lincoln Elementary School',
      estimatedArrival: '8:45 AM',
      driver: 'John Smith',
      bus: 'Bus 12',
      status: 'en-route',
      lastUpdate: '2 min ago',
      mapLocation: '2.4 km from school'
    },
    {
      id: 2,
      childName: 'Liam Johnson',
      destination: 'Riverside Middle School',
      estimatedArrival: '7:30 AM',
      driver: 'Sarah Davis',
      bus: 'Bus 8',
      status: 'picked-up',
      lastUpdate: '15 min ago',
      mapLocation: 'Boarded at 7:15 AM'
    }
  ];

  const mockHistoryTrips = [
    {
      id: 3,
      childName: 'Emma Johnson',
      destination: 'Lincoln Elementary School',
      date: 'Yesterday',
      time: '8:40 AM - 9:05 AM',
      driver: 'John Smith',
      bus: 'Bus 12',
      status: 'completed',
      feedback: 'Arrived on time'
    },
    {
      id: 4,
      childName: 'Emma Johnson',
      destination: 'Lincoln Elementary School',
      date: '2 days ago',
      time: '8:35 AM - 9:00 AM',
      driver: 'John Smith',
      bus: 'Bus 12',
      status: 'completed',
      feedback: 'Arrived early'
    },
    {
      id: 5,
      childName: 'Liam Johnson',
      destination: 'Riverside Middle School',
      date: 'Yesterday',
      time: '7:25 AM - 7:50 AM',
      driver: 'Sarah Davis',
      bus: 'Bus 8',
      status: 'completed',
      feedback: 'Smooth ride'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Modern Navbar */}
      <ParentNavbar
        user={user}
        onNavigate={() => {}}
        activeView="trips"
      />

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                  <Bus className="w-8 h-8 text-primary-600" />
                  Trip Assignments
                </h1>
                <p className="mt-2 text-neutral-600">
                  Monitor and manage your children's transportation in real-time
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAssignToTrip}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 text-lg font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Assign to Trip
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Trip Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Active Trips
                  <span className="ml-2 bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                    {mockActiveTrips.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Trip History
                  <span className="ml-2 bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">
                    {mockHistoryTrips.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Active Trips Tab */}
              <TabsContent value="active" className="space-y-6">
                {mockActiveTrips.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white rounded-xl shadow-medium border border-neutral-200"
                  >
                    <Bus className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Active Trips</h3>
                    <p className="text-neutral-600 mb-6">Your children are currently not on any trips</p>
                    <Button onClick={handleAssignToTrip} className="bg-primary-600 hover:bg-primary-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Assign to Trip
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid gap-6">
                    {mockActiveTrips.map((trip, index) => (
                      <motion.div
                        key={trip.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex items-start gap-4 flex-1">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="relative"
                            >
                              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-primary-600" />
                              </div>
                              <motion.div
                                animate={{
                                  scale: trip.status === 'en-route' ? [1, 1.2, 1] : 1,
                                  opacity: trip.status === 'en-route' ? [0.5, 1, 0.5] : 0.3
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                                  trip.status === 'en-route' ? 'bg-success-500' : 'bg-warning-500'
                                }`}
                              />
                            </motion.div>

                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                {trip.childName}
                              </h3>
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-neutral-500" />
                                  <span className="text-neutral-700">{trip.destination}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-neutral-500" />
                                  <span className="text-neutral-700">ETA: {trip.estimatedArrival}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-neutral-500" />
                                  <span className="text-neutral-700">Driver: {trip.driver}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Bus className="w-4 h-4 text-neutral-500" />
                                  <span className="text-neutral-700">{trip.bus}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  trip.status === 'en-route'
                                    ? 'bg-success-100 text-success-700'
                                    : 'bg-warning-100 text-warning-700'
                                }`}>
                                  {trip.status === 'en-route' ? 'En Route' : 'Picked Up'}
                                </span>
                                <span>•</span>
                                <span>Updated {trip.lastUpdate}</span>
                                <span>•</span>
                                <span>{trip.mapLocation}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 lg:flex-none">
                              View Map
                            </Button>
                            <Button variant="outline" className="flex-1 lg:flex-none">
                              Contact Driver
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Trip History Tab */}
              <TabsContent value="history" className="space-y-6">
                {mockHistoryTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-success-600" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            {trip.childName}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-neutral-500" />
                              <span className="text-neutral-700">{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-neutral-500" />
                              <span className="text-neutral-700">{trip.date} • {trip.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-neutral-500" />
                              <span className="text-neutral-700">Driver: {trip.driver}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bus className="w-4 h-4 text-neutral-500" />
                              <span className="text-neutral-700">{trip.bus}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                              Completed
                            </span>
                            <span className="text-sm text-neutral-600 ml-2">{trip.feedback}</span>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" className="flex-1 lg:flex-none">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default TripAssignmentsManagement;
