import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { maintenanceAPI, vehicleAPI } from '../services/api';


const MaintenanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      vehicleId: '',
      serviceType: '',
      description: '',
      scheduledDate: '',
      estimatedCost: '',
      priority: 'Medium',
      status: 'Planned',
      actualCost: '',
      mechanicDetails: '',
      remarks: '',
      completedBy: ''
    }
  });

  useEffect(() => {
    fetchVehicles();
    if (id) {
      fetchMaintenanceLog();
    }
  }, [id]);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll();
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      toast.error('Failed to load vehicles');
    }
  };

  const fetchMaintenanceLog = async () => {
    try {
      setIsLoading(true);
      const response = await maintenanceAPI.getById(id);
      const log = response.data;
      
      reset({
        vehicleId: log.vehicleId,
        serviceType: log.serviceType,
        description: log.description,
        scheduledDate: log.scheduledDate ? new Date(log.scheduledDate).toISOString().split('T')[0] : '',
        estimatedCost: log.estimatedCost || '',
        priority: log.priority,
        status: log.status,
        actualCost: log.actualCost || '',
        mechanicDetails: log.mechanicDetails || '',
        remarks: log.remarks || '',
        completedBy: log.completedBy || ''
      });
    } catch (error) {
      toast.error('Failed to load maintenance log');
      navigate('/maintenance');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const maintenanceData = {
        ...data,
        driverId: user.id,
        estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : undefined,
        actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined
      };

      if (id) {
        await maintenanceAPI.update(id, maintenanceData);
        toast.success('Maintenance log updated successfully');
      } else {
        await maintenanceAPI.create(maintenanceData);
        toast.success('Maintenance log created successfully');
      }
      
      navigate('/maintenance');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save maintenance log');
    } finally {
      setIsSubmitting(false);
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
    <div style={{maxWidth: '1024px', margin: '0 auto', padding: '0 16px'}}>
      <div style={{marginBottom: '32px'}}>
        <button
          onClick={() => navigate('/maintenance')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
            fontSize: '0.95rem',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#1f2937'}
          onMouseLeave={(e) => e.target.style.color = '#6b7280'}
        >
          <ArrowLeft style={{height: 16, width: 16}} />
          Back to Maintenance
        </button>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {id ? 'Edit Maintenance Log' : 'New Maintenance Log'}
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Record vehicle maintenance tasks and service details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Select Vehicle *</label>
                <select
                  {...register('vehicleId', { required: 'Vehicle selection is required' })}
                  className="form-select"
                >
                  <option value="">Choose a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                      {vehicle.vehicleId} - {vehicle.model} ({vehicle.licensePlate})
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Service Type *</label>
                <select
                  {...register('serviceType', { required: 'Service type is required' })}
                  className="form-select"
                >
                  <option value="">Select service type</option>
                  <option value="Routine Maintenance">Routine Maintenance</option>
                  <option value="Repair">Repair</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Replacement">Replacement</option>
                  <option value="Other">Other</option>
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="form-label">Description *</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="form-textarea"
                  placeholder="Describe the maintenance task or issue..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Scheduled Date</label>
                  <input
                    {...register('scheduledDate')}
                    type="date"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Priority *</label>
                  <select
                    {...register('priority', { required: 'Priority is required' })}
                    className="form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Status *</label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="form-select"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Cost & Service Provider</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Estimated Cost (Rs.)</label>
                <input
                  {...register('estimatedCost')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="form-label">Actual Cost (Rs.)</label>
                <input
                  {...register('actualCost')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="form-label">Mechanic Details</label>
                <input
                  {...register('mechanicDetails')}
                  type="text"
                  className="form-input"
                  placeholder="Mechanic name and contact info"
                />
              </div>

              <div>
                <label className="form-label">Completed By</label>
                <input
                  {...register('completedBy')}
                  type="text"
                  className="form-input"
                  placeholder="Person who completed the work"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label">Additional Remarks</label>
              <textarea
                {...register('remarks')}
                rows={3}
                className="form-textarea"
                placeholder="Any additional notes or observations..."
              />
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
          marginTop: '32px'
        }}>
          <button
            type="button"
            onClick={() => navigate('/maintenance')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: isSubmitting ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.target.style.background = '#2563eb';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.target.style.background = '#3b82f6';
            }}
          >
            {isSubmitting ? (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              <Save style={{height: 16, width: 16}} />
            )}
            {id ? 'Update Log' : 'Create Log'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;
