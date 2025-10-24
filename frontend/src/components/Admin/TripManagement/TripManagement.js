import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../ui/table';
import jsPDF from 'jspdf';

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Trip_ID: '',
    date: '',
    start_time: '',
    end_time: '',
    start_location: '',
    route: '',
    status: 'scheduled',
    busId: '',
    driverId: '',
    coordinatorId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tripsRes, busesRes, driversRes, coordinatorsRes] = await Promise.all([
        axios.get('http://localhost:5005/api/trips'),
        axios.get('http://localhost:5005/buses'),
        axios.get('http://localhost:5005/drivers'),
        axios.get('http://localhost:5005/coordinators')
      ]);

      setTrips(tripsRes.data.trips || []);
      setBuses(busesRes.data.buses || []);
      setDrivers(driversRes.data.drivers || []);
      setCoordinators(coordinatorsRes.data.coordinators || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      Trip_ID: '',
      date: '',
      start_time: '',
      end_time: '',
      start_location: '',
      route: '',
      status: 'scheduled',
      busId: '',
      driverId: '',
      coordinatorId: ''
    });
    setEditingTrip(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrip) {
        // Update existing trip
        await axios.put(`http://localhost:5005/api/trips/${editingTrip._id}`, formData);
        alert('Trip updated successfully!');
      } else {
        // Create new trip
        await axios.post('http://localhost:5005/api/trips', formData);
        alert('Trip created successfully!');
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (trip) => {
    setFormData({
      Trip_ID: trip.Trip_ID,
      date: trip.date ? new Date(trip.date).toISOString().split('T')[0] : '',
      start_time: trip.start_time,
      end_time: trip.end_time,
      start_location: trip.start_location,
      route: trip.route,
      status: trip.status,
      busId: trip.busId?._id || trip.busId,
      driverId: trip.driverId?._id || trip.driverId,
      coordinatorId: trip.coordinatorId?._id || trip.coordinatorId
    });
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await axios.delete(`http://localhost:5005/api/trips/${tripId}`);
      alert('Trip deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#17a2b8';
      case 'ongoing': return '#ffc107';
      case 'completed': return '#28a745';
      case 'canceled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;

      // Add title
      pdf.setFontSize(20);
      pdf.text('Trip Management Report', pageWidth / 2, 20, { align: 'center' });

      // Add date and time of generation
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 35);

      let yPosition = 45;

      if (trips.length === 0) {
        pdf.setFontSize(14);
        pdf.text('No trips found in the system.', 20, yPosition);
      } else {
        // Add summary
        pdf.setFontSize(14);
        pdf.text(`Total Trips: ${trips.length}`, 20, yPosition);
        yPosition += 15;

        // Add table headers
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        const headers = ['Trip ID', 'Date', 'Time', 'Route', 'Status', 'Bus', 'Driver', 'Coordinator'];
        const columnWidths = [25, 25, 30, 35, 20, 15, 25, 25];
        let xPosition = 20;

        headers.forEach((header, index) => {
          pdf.text(header, xPosition, yPosition);
          xPosition += columnWidths[index];
        });

        yPosition += 8;

        // Add table rows
        pdf.setFont('helvetica', 'normal');
        trips.forEach((trip, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          xPosition = 20;
          let rowData = [
            trip.Trip_ID || 'N/A',
            new Date(trip.date).toLocaleDateString(),
            `${trip.start_time || 'N/A'} - ${trip.end_time || 'N/A'}`,
            `${trip.start_location || 'N/A'} to ${trip.route || 'N/A'}`.replace(/\s+/g, ' ').trim(),
            (trip.status || 'N/A').toUpperCase(),
            trip.busId?.busNumber || 'N/A',
            trip.driverId?.name || 'N/A',
            trip.coordinatorId?.name || 'N/A'
          ];

          let maxHeightInRow = 1; // Minimum height for row

          rowData.forEach((data, cellIndex) => {
            const maxWidth = columnWidths[cellIndex] - 4; // Leave more space for spacing
            const cleanedData = data.toString().replace(/\s+/g, ' ').trim(); // Clean whitespace
            const wrappedText = pdf.splitTextToSize(cleanedData, maxWidth);

            if (yPosition + (wrappedText.length * 5.5) > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }

            pdf.text(wrappedText, xPosition + 2, yPosition); // Add slight left margin
            xPosition += columnWidths[cellIndex];

            // Track the maximum height in this row
            if (wrappedText.length > maxHeightInRow) {
              maxHeightInRow = wrappedText.length;
            }
          });

          yPosition += Math.max(maxHeightInRow * 5.5, 12); // Better line spacing
        });

        // Add summary statistics at the end
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        yPosition += 20;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Summary Statistics:', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');

        const statusCounts = {};
        trips.forEach(trip => {
          const status = trip.status || 'Unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        Object.entries(statusCounts).forEach(([status, count]) => {
          pdf.text(`${status.charAt(0).toUpperCase() + status.slice(1)} Trips: ${count}`, 30, yPosition);
          yPosition += 7;
        });
      }

      // Save the PDF
      const fileName = `trip-management-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px' }}>Loading trip management...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">🚌 Trip Management</h2>
        <div className="flex gap-4">
          <Button onClick={handleDownloadPDF} variant="outline" disabled={trips.length === 0}>
            📄 Download PDF
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            ➕ Add New Trip
          </Button>
        </div>
      </div>

      {/* Trip Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {editingTrip ? '✏️ Edit Trip' : '➕ Add New Trip'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trip ID:</label>
                  <Input
                    type="text"
                    name="Trip_ID"
                    value={formData.Trip_ID}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date:</label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time:</label>
                  <Input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time:</label>
                  <Input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Location:</label>
                  <Input
                    type="text"
                    name="start_location"
                    value={formData.start_location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Route:</label>
                  <Input
                    type="text"
                    name="route"
                    value={formData.route}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status:</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bus:</label>
                  <select
                    name="busId"
                    value={formData.busId}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Bus</option>
                    {buses.map(bus => (
                      <option key={bus._id} value={bus._id}>
                        {bus.busNumber} - {bus.capacity} seats
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Driver:</label>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Driver</option>
                    {drivers.map(driver => (
                      <option key={driver._id} value={driver._id}>
                        {driver.name} - {driver.licenseNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Coordinator:</label>
                  <select
                    name="coordinatorId"
                    value={formData.coordinatorId}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Coordinator</option>
                    {coordinators.map(coordinator => (
                      <option key={coordinator._id} value={coordinator._id}>
                        {coordinator.fullName} - {coordinator.coordinatorId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  💾 {editingTrip ? 'Update Trip' : 'Create Trip'}
                </Button>
                <Button type="button" onClick={resetForm} variant="secondary">
                  ❌ Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Trips List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📋 All Trips ({trips.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-5xl mb-2">🚌</div>
              <p className="text-muted-foreground">No trips found. Create your first trip!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Coordinator</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map(trip => (
                  <TableRow key={trip._id}>
                    <TableCell>{trip.Trip_ID}</TableCell>
                    <TableCell>{new Date(trip.date).toLocaleDateString()}</TableCell>
                    <TableCell>{trip.start_time} - {trip.end_time}</TableCell>
                    <TableCell>{trip.start_location} → {trip.route}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : trip.status === 'ongoing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : trip.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {trip.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{trip.busId?.busNumber || 'N/A'}</TableCell>
                    <TableCell>{trip.driverId?.name || 'N/A'}</TableCell>
                    <TableCell>{trip.coordinatorId?.name || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => handleEdit(trip)}
                        variant="outline"
                        size="sm"
                        className="mr-2"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(trip._id)}
                        variant="destructive"
                        size="sm"
                      >
                        🗑️ Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripManagement;
