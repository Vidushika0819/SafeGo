import React, { useState, useEffect } from 'react';
import { Truck, ChevronDown } from 'lucide-react';
import { vehicleAPI } from '../services/api';
import toast from 'react-hot-toast';

const VehicleSelector = ({ selectedVehicle, onVehicleSelect, disabled = false, className = '' }) => {
  const [vehicles, setVehicles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await vehicleAPI.getAll({ status: 'active' });
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    onVehicleSelect(vehicle);
    setIsOpen(false);
  };

  const selectedVehicleData = vehicles.find(v => v.vehicleId === selectedVehicle);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
        }`}
      >
        <div className="flex items-center">
          <Truck className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm">
            {selectedVehicleData ? (
              `${selectedVehicleData.vehicleId} - ${selectedVehicleData.model} (${selectedVehicleData.licensePlate})`
            ) : (
              'Select a vehicle'
            )}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500 flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Loading vehicles...
            </div>
          ) : vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <button
                key={vehicle.vehicleId}
                onClick={() => handleVehicleSelect(vehicle.vehicleId)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center ${
                  selectedVehicle === vehicle.vehicleId ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <Truck className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <div className="font-medium">{vehicle.vehicleId}</div>
                  <div className="text-xs text-gray-500">
                    {vehicle.model} - {vehicle.licensePlate}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No vehicles available
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default VehicleSelector;
