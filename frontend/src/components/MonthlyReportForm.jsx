import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { monthlyReportAPI, vehicleAPI } from '../services/api';

const MonthlyReportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      vehicleId: '',
      odometerReading: '',
      issues: '',
      actionsTaken: '',
      nextServiceDate: '',
      serviceProvider: '',
      totalCost: '',
      completedBy: `${user.firstName} ${user.lastName}`
    }
  });

  useEffect(() => {
    fetchVehicles();
    if (id) {
      fetchMonthlyReport();
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

  const handleDownloadPdf = () => {
    // Gather current form values
    const data = watch();

    // Use uploadedImages (base64 URLs) if present
    const imagesHtml = uploadedImages && uploadedImages.length > 0
      ? uploadedImages.map(img => `<div style="margin:8px 0;"><img src="${img.url}" style="max-width:260px;max-height:200px;object-fit:cover;border:1px solid #ddd;padding:4px"/></div>`).join('')
      : '';

    const html = `
      <html>
      <head>
        <title>Monthly Report</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #111 }
          h1 { font-size: 20px; margin-bottom: 8px }
          table { width: 100%; border-collapse: collapse; margin-top: 12px }
          td, th { border: 1px solid #ddd; padding: 8px; vertical-align: top }
          .label { width: 200px; background: #f7fafc; font-weight: 600 }
          .images { margin-top: 12px }
        </style>
      </head>
      <body>
        <h1>Monthly Service Report</h1>
        <p><strong>Vehicle:</strong> ${data.vehicleId || ''}</p>
        <p><strong>Completed by:</strong> ${data.completedBy || ''} &nbsp; <strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <table>
          <tr><td class="label">Odometer Reading</td><td>${data.odometerReading || 'N/A'}</td></tr>
          <tr><td class="label">Service Provider</td><td>${data.serviceProvider || 'N/A'}</td></tr>
          <tr><td class="label">Next Service Date</td><td>${data.nextServiceDate || 'N/A'}</td></tr>
          <tr><td class="label">Total Cost (Rs.)</td><td>${data.totalCost || 'N/A'}</td></tr>
          <tr><td class="label">Issues Identified</td><td>${(data.issues || '').replace(/\n/g, '<br/>') || 'None'}</td></tr>
          <tr><td class="label">Actions Taken</td><td>${(data.actionsTaken || '').replace(/\n/g, '<br/>') || 'None'}</td></tr>
        </table>
        <div class="images">
          ${imagesHtml}
        </div>
      </body>
      </html>
    `;

    // Open a new window and write the HTML, then print
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error('Unable to open print window (popup blocked)');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    // Wait a bit for images to load then trigger print
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (err) {
        console.warn('Print failed', err);
      }
    }, 500);
  };

  const fetchMonthlyReport = async () => {
    try {
      setIsLoading(true);
      const response = await monthlyReportAPI.getById(id);
      const report = response.data;
      
      reset({
        vehicleId: report.vehicleId,
        odometerReading: report.odometerReading || '',
        issues: report.issues || '',
        actionsTaken: report.actionsTaken || '',
        nextServiceDate: report.nextServiceDate ? new Date(report.nextServiceDate).toISOString().split('T')[0] : '',
        serviceProvider: report.serviceProvider || '',
        totalCost: report.totalCost || '',
        completedBy: report.completedBy
      });
    } catch (error) {
      toast.error('Failed to load monthly report');
      navigate('/monthly-reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (files) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // In a real application, you would upload to a cloud service like AWS S3, Cloudinary, etc.
        // For now, we'll simulate the upload and store the file info
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              url: e.target.result,
              file: file
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploadedFiles]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const reportData = {
        ...data,
        driverId: user.id,
        odometerReading: data.odometerReading ? parseInt(data.odometerReading) : undefined,
        totalCost: data.totalCost ? parseFloat(data.totalCost) : undefined,
        nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate) : undefined,
        attachmentUrl: uploadedImages.length > 0 ? uploadedImages.map(img => img.url).join(',') : undefined,
        images: uploadedImages // Include image data for admin review
      };

      if (id) {
        await monthlyReportAPI.update(id, reportData);
        toast.success('Monthly report updated successfully');
      } else {
        await monthlyReportAPI.create(reportData);
        toast.success('Monthly report created successfully');
        
        // Notify admin about new monthly report with images
        if (uploadedImages.length > 0) {
          toast.success(`Report submitted to admin with ${uploadedImages.length} image(s)`);
        }
      }
      
      navigate('/monthly-reports');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save monthly report');
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
          onClick={() => navigate('/monthly-reports')}
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
          Back to Monthly Reports
        </button>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          {id ? 'Edit Monthly Report' : 'New Monthly Report'}
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Submit monthly vehicle service and maintenance report
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
                <label className="form-label">Odometer Reading</label>
                <input
                  {...register('odometerReading')}
                  type="number"
                  className="form-input"
                  placeholder="Current mileage"
                />
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
                <label className="form-label">Issues Identified</label>
                <textarea
                  {...register('issues')}
                  rows={4}
                  className="form-textarea"
                  placeholder="Describe any issues or problems found during the month..."
                />
              </div>

              <div>
                <label className="form-label">Actions Taken</label>
                <textarea
                  {...register('actionsTaken')}
                  rows={4}
                  className="form-textarea"
                  placeholder="Describe what actions were taken to address the issues..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Service Provider</label>
                  <input
                    {...register('serviceProvider')}
                    type="text"
                    className="form-input"
                    placeholder="Service center or mechanic name"
                  />
                </div>

                <div>
                  <label className="form-label">Total Cost (Rs.)</label>
                  <input
                    {...register('totalCost')}
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Next Service Date</label>
                <input
                  {...register('nextServiceDate')}
                  type="date"
                  className="form-input"
                />
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

        {/* Image Upload Section */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Service Images (Send to Admin)</h3>
                <p className="text-sm text-gray-600 mt-1">Upload images of service work, receipts, or any relevant documentation</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="p-3 bg-blue-100 rounded-full mb-3">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {isUploading ? 'Uploading...' : 'Click to upload images or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <br></br>
                          (PNG, JPG, GIF up to 10MB each)
                  </p>
                </label>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
                    Uploaded Images ({uploadedImages.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate" title={image.name}>
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notification */}
              {uploadedImages.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">
                        Images will be sent to Admin
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        These images will be included in your monthly report and sent to the admin for review.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
            onClick={() => navigate('/monthly-reports')}
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
            type="button"
            onClick={handleDownloadPdf}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#059669'}
            onMouseLeave={(e) => e.target.style.background = '#10b981'}
          >
            Download PDF
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
            {id ? 'Update Report' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyReportForm;
