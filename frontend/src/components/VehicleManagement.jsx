import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Truck,
  Calendar
} from 'lucide-react';
import { vehicleAPI } from '../services/api';
import toast from 'react-hot-toast';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [addForm, setAddForm] = useState({
    vehicleId: '',
    model: '',
    year: '',
    capacity: '',
    licensePlate: '',
    status: 'active',
    manufacturer: '',
    color: '',
    assignedDriver: ''
  });
  const [editForm, setEditForm] = useState({
    vehicleId: '',
    model: '',
    year: '',
    capacity: '',
    licensePlate: '',
    status: 'active',
    manufacturer: '',
    color: '',
    assignedDriver: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      };

      const response = await vehicleAPI.getAll(params);
      setVehicles(response.data.vehicles || []);
      setTotalPages(response.data.totalPages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleAPI.delete(id);
        toast.success('Vehicle deleted successfully');
        fetchVehicles();
      } catch (error) {
        toast.error('Failed to delete vehicle');
      }
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditForm({
      vehicleId: vehicle.vehicleId,
      model: vehicle.model,
      year: vehicle.year.toString(),
      capacity: vehicle.capacity.toString(),
      licensePlate: vehicle.licensePlate || '',
      status: vehicle.status,
      manufacturer: vehicle.manufacturer || '',
      color: vehicle.color || '',
      assignedDriver: vehicle.assignedDriver || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await vehicleAPI.update(editingVehicle.vehicleId, {
        ...editForm,
        year: Number(editForm.year),
        capacity: Number(editForm.capacity)
      });
      toast.success('Vehicle updated successfully');
      setShowEditModal(false);
      setEditingVehicle(null);
      setEditForm({
        vehicleId: '', model: '', year: '', capacity: '', licensePlate: '', 
        status: 'active', manufacturer: '', color: '', assignedDriver: ''
      });
      fetchVehicles();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'maintenance': return 'status-maintenance';
      default: return 'status-inactive';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 8px 0'
            }}>
              Vehicle Management
            </h1>
            <p style={{
              color: '#6b7280', 
              fontSize: '1.1rem',
              margin: 0
            }}>
              Manage your fleet of school buses
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            <Plus style={{height: 18, width: 18}} />
            Add Vehicle
          </button>
        </div>
      </div>
      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowAddModal(false)}>
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setAddLoading(true);
              try {
                await vehicleAPI.create({
                  ...addForm,
                  year: Number(addForm.year),
                  capacity: Number(addForm.capacity)
                });
                toast.success('Vehicle added successfully');
                setShowAddModal(false);
                setAddForm({
                  vehicleId: '', model: '', year: '', capacity: '', licensePlate: '', status: 'active', manufacturer: '', color: '', assignedDriver: ''
                });
                fetchVehicles();
              } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to add vehicle');
              } finally {
                setAddLoading(false);
              }
            }}>
              <div className="space-y-3">
                <input className="form-input w-full" required placeholder="Vehicle ID" value={addForm.vehicleId} onChange={e => setAddForm(f => ({...f, vehicleId: e.target.value}))} />
                <input className="form-input w-full" required placeholder="Model" value={addForm.model} onChange={e => setAddForm(f => ({...f, model: e.target.value}))} />
                <input className="form-input w-full" required type="number" min="1900" max="2100" placeholder="Year" value={addForm.year} onChange={e => setAddForm(f => ({...f, year: e.target.value}))} />
                <input className="form-input w-full" required type="number" min="1" placeholder="Capacity" value={addForm.capacity} onChange={e => setAddForm(f => ({...f, capacity: e.target.value}))} />
                <input className="form-input w-full" required placeholder="License Plate" value={addForm.licensePlate} onChange={e => setAddForm(f => ({...f, licensePlate: e.target.value}))} />
                <select className="form-select w-full" value={addForm.status} onChange={e => setAddForm(f => ({...f, status: e.target.value}))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <input className="form-input w-full" placeholder="Manufacturer" value={addForm.manufacturer} onChange={e => setAddForm(f => ({...f, manufacturer: e.target.value}))} />
                <input className="form-input w-full" placeholder="Color" value={addForm.color} onChange={e => setAddForm(f => ({...f, color: e.target.value}))} />
                <input className="form-input w-full" placeholder="Assigned Driver" value={addForm.assignedDriver} onChange={e => setAddForm(f => ({...f, assignedDriver: e.target.value}))} />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-4" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add Vehicle'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" 
              onClick={() => {
                setShowEditModal(false);
                setEditingVehicle(null);
                setEditForm({
                  vehicleId: '', model: '', year: '', capacity: '', licensePlate: '', 
                  status: 'active', manufacturer: '', color: '', assignedDriver: ''
                });
              }}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-3">
                <input 
                  className="form-input w-full" 
                  required 
                  placeholder="Vehicle ID" 
                  value={editForm.vehicleId} 
                  onChange={e => setEditForm(f => ({...f, vehicleId: e.target.value}))} 
                />
                <input 
                  className="form-input w-full" 
                  required 
                  placeholder="Model" 
                  value={editForm.model} 
                  onChange={e => setEditForm(f => ({...f, model: e.target.value}))} 
                />
                <input 
                  className="form-input w-full" 
                  required 
                  type="number" 
                  min="1900" 
                  max="2100" 
                  placeholder="Year" 
                  value={editForm.year} 
                  onChange={e => setEditForm(f => ({...f, year: e.target.value}))} 
                />
                <input 
                  className="form-input w-full" 
                  required 
                  type="number" 
                  min="1" 
                  placeholder="Capacity" 
                  value={editForm.capacity} 
                  onChange={e => setEditForm(f => ({...f, capacity: e.target.value}))} 
                />
                <input 
                  className="form-input w-full" 
                  required 
                  placeholder="License Plate" 
                  value={editForm.licensePlate} 
                  onChange={e => setEditForm(f => ({...f, licensePlate: e.target.value}))} 
                />
                <select 
                  className="form-select w-full" 
                  value={editForm.status} 
                  onChange={e => setEditForm(f => ({...f, status: e.target.value}))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <input 
                  className="form-input w-full" 
                  placeholder="Manufacturer" 
                  value={editForm.manufacturer} 
                  onChange={e => setEditForm(f => ({...f, manufacturer: e.target.value}))} 
                />
                <input 
                  className="form-input w-full" 
                  placeholder="Color" 
                  value={editForm.color} 
                  onChange={e => setEditForm(f => ({...f, color: e.target.value}))} 
                />
                <input 
                  className="form-input w-full" 
                  placeholder="Assigned Driver" 
                  value={editForm.assignedDriver} 
                  onChange={e => setEditForm(f => ({...f, assignedDriver: e.target.value}))} 
                />
              </div>
              <div className="flex space-x-3 mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary flex-1" 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingVehicle(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1" 
                  disabled={editLoading}
                >
                  {editLoading ? 'Updating...' : 'Update Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{flex: '1', minWidth: '300px'}}>
            <div style={{position: 'relative'}}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '18px',
                width: '18px',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>
          <div style={{minWidth: '200px'}}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.95rem',
                background: 'white',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Vehicles ({total})
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {vehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Vehicle ID</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>License Plate</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id}>
                      <td className="font-medium">{vehicle.vehicleId}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.licensePlate}</td>
                      <td>{vehicle.capacity}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(vehicle)}
                            title="Edit"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '8px 12px',
                              background: '#10b981',
                              color: 'white',
                              textDecoration: 'none',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                          >
                            <Edit style={{height: 14, width: 14}} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.vehicleId)}
                            title="Delete"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '8px 12px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                          >
                            <Trash2 style={{height: 14, width: 14}} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first vehicle'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <button className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;
