import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { dailyCheckAPI } from '../services/api';
import VehicleSelector from './VehicleSelector';

const DailyCheckForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      vehicleId: '',
      checklist: {
        brakes: false,
        tires: false,
        lights: false,
        fuel: false,
        firstAidKit: false,
        engine: false,
        mirrors: false,
        seatbelts: false,
        horn: false,
        wipers: false
      },
      finalDecision: '',
      remarks: '',
      completedBy: `${user.firstName} ${user.lastName}`
    }
  });

  const watchedChecklist = watch('checklist');

  useEffect(() => {
    if (id) {
      fetchDailyCheck();
    }
  }, [id]);

  const fetchDailyCheck = async () => {
    try {
      setIsLoading(true);
      const response = await dailyCheckAPI.getById(id);
      const check = response.data;
      
      reset({
        vehicleId: check.vehicleId,
        checklist: check.checklist,
        finalDecision: check.finalDecision,
        remarks: check.remarks,
        completedBy: check.completedBy
      });
    } catch (error) {
      toast.error('Failed to load daily check');
      navigate('/daily-checks');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const checkData = {
        ...data,
        driverId: user.id,
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        submittedToAdmin: true, // Flag to indicate this was submitted to admin
        adminNotification: {
          submittedAt: new Date(),
          driverName: data.completedBy,
          vehicleId: data.vehicleId,
          status: data.finalDecision,
          requiresAttention: data.finalDecision !== 'Ready'
        }
      };

      if (id) {
        await dailyCheckAPI.update(id, checkData);
        toast.success('Daily check updated successfully');
      } else {
        await dailyCheckAPI.create(checkData);
        toast.success('Daily check created successfully');
        
        // Notify admin about daily check submission
        if (data.finalDecision !== 'Ready') {
          toast.success(`Daily check submitted to admin - Status: ${data.finalDecision}`);
        } else {
          toast.success('Daily check submitted to admin - Vehicle Ready');
        }
      }
      
      navigate('/daily-checks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save daily check');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChecklistChange = (item, checked) => {
    setValue(`checklist.${item}`, checked);
  };

  const getCheckedCount = () => {
    return Object.values(watchedChecklist).filter(Boolean).length;
  };

  const getTotalCount = () => {
    return Object.keys(watchedChecklist).length;
  };

  const getCompletionPercentage = () => {
    return Math.round((getCheckedCount() / getTotalCount()) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/daily-checks')}
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
          Back to Daily Checks
        </button>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {id ? 'Edit Daily Check' : 'New Daily Check'}
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Complete the vehicle safety checklist and submit your decision
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
                <VehicleSelector
                  selectedVehicle={watch('vehicleId')}
                  onVehicleSelect={(vehicleId) => setValue('vehicleId', vehicleId)}
                  disabled={!!id}
                />
                {errors.vehicleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Completed By *</label>
                <input
                  {...register('completedBy', { required: 'Completed by is required' })}
                  type="text"
                  className="form-input"
                  placeholder="Driver name"
                />
                {errors.completedBy && (
                  <p className="mt-1 text-sm text-red-600">{errors.completedBy.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Safety Checklist</h3>
              <div className="text-sm text-gray-600">
                {getCheckedCount()}/{getTotalCount()} items checked ({getCompletionPercentage()}%)
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(watchedChecklist).map(([item, checked]) => (
                <div key={item} className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id={item}
                    checked={checked}
                    onChange={(e) => handleChecklistChange(item, e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor={item} className="text-sm font-medium text-gray-700 capitalize">
                    {item.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Final Decision</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="form-label">Vehicle Status *</label>
                <select
                  {...register('finalDecision', { required: 'Final decision is required' })}
                  className="form-select"
                >
                  <option value="">Select vehicle status</option>
                  <option value="Ready">Ready - All checks passed</option>
                  <option value="Not Ready">Not Ready - Minor issues</option>
                  <option value="Needs Service">Needs Service - Requires maintenance</option>
                  <option value="Unsafe">Unsafe - Do not operate</option>
                </select>
                {errors.finalDecision && (
                  <p className="mt-1 text-sm text-red-600">{errors.finalDecision.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Additional Remarks</label>
                <textarea
                  {...register('remarks')}
                  rows={4}
                  className="form-textarea"
                  placeholder="Any additional notes or observations..."
                />
              </div>

              {/* Admin Submission Notification */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">
                      This daily check will be submitted to Admin
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your daily check form will be automatically sent to the admin for review and record keeping.
                      {watch('finalDecision') && watch('finalDecision') !== 'Ready' && (
                        <span className="block mt-1 font-medium">
                          ⚠️ This vehicle requires attention and will be flagged for admin review.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/daily-checks')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex items-center"
          >
            {isSubmitting ? (
              <div className="spinner mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {id ? 'Update Check' : 'Submit Check'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyCheckForm;
