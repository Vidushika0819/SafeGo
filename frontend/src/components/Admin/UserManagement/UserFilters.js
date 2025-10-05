import React, { useState } from 'react';

const UserFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      role: '',
      status: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.search || localFilters.role || localFilters.status;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'flex-end'
    }}>
      {/* Search Input */}
      <div style={{ flex: '1', minWidth: '200px' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 'bold',
          color: '#343a40',
          fontSize: '0.9rem'
        }}>
          🔍 Search Users
        </label>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={localFilters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '1rem',
            backgroundColor: 'white'
          }}
        />
      </div>

      {/* Role Filter */}
      <div style={{ minWidth: '150px' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 'bold',
          color: '#343a40',
          fontSize: '0.9rem'
        }}>
          👤 Filter by Role
        </label>
        <select
          value={localFilters.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '1rem',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="coordinator">Coordinator</option>
          <option value="driver">Driver</option>
        </select>
      </div>

      {/* Status Filter */}
      <div style={{ minWidth: '150px' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 'bold',
          color: '#343a40',
          fontSize: '0.9rem'
        }}>
          📊 Filter by Status
        </label>
        <select
          value={localFilters.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '1rem',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div>
          <button
            onClick={handleClearFilters}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              height: '48px'
            }}
          >
            🗑️ Clear Filters
          </button>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div style={{
          marginLeft: 'auto',
          padding: '0.75rem',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#495057'
        }}>
          <strong>Active Filters:</strong>
          {localFilters.search && <span> Search: "{localFilters.search}"</span>}
          {localFilters.role && <span> Role: {localFilters.role}</span>}
          {localFilters.status && <span> Status: {localFilters.status}</span>}
        </div>
      )}
    </div>
  );
};

export default UserFilters;
