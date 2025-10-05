import React from 'react';

const ChildCard = ({ child, onEdit, onView, onDeactivate, onReactivate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGradeDisplay = (grade) => {
    const gradeMap = {
      preschool: 'Pre-School',
      kindergarten: 'Kindergarten',
      grade1: 'Grade 1',
      grade2: 'Grade 2',
      grade3: 'Grade 3',
      grade4: 'Grade 4',
      grade5: 'Grade 5',
      grade6: 'Grade 6',
      grade7: 'Grade 7',
      grade8: 'Grade 8',
      grade9: 'Grade 9',
      grade10: 'Grade 10',
      grade11: 'Grade 11',
      grade12: 'Grade 12'
    };
    return gradeMap[grade] || grade;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#27ae60';
      case 'inactive':
        return '#95a5a6';
      case 'suspended':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'suspended':
        return 'Suspended';
      default:
        return 'Unknown';
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #ecf0f1',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    >
      {/* Header with avatar and basic info */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #ecf0f1',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        {/* Avatar */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: child.gender === 'male' ? '#3498db' : child.gender === 'female' ? '#e91e63' : '#9c88ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {child.firstName?.charAt(0) || '?'}
        </div>

        {/* Basic info */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 5px 0',
            color: '#2c3e50',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {child.firstName} {child.lastName}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              backgroundColor: '#f8f9fa',
              color: '#2c3e50',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {getGradeDisplay(child.grade)}
            </span>
            <span style={{
              backgroundColor: getStatusColor(child.status),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {getStatusText(child.status)}
            </span>
            {child.age && (
              <span style={{
                color: '#7f8c8d',
                fontSize: '12px'
              }}>
                Age: {child.age}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details section */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              Date of Birth
            </div>
            <div style={{
              fontSize: '14px',
              color: '#2c3e50'
            }}>
              {formatDate(child.dateOfBirth)}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              School
            </div>
            <div style={{
              fontSize: '14px',
              color: '#2c3e50'
            }}>
              {child.schoolName || 'Not specified'}
            </div>
          </div>

          <div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              Emergency Contacts
            </div>
            <div style={{
              fontSize: '14px',
              color: '#2c3e50'
            }}>
              {child.emergencyContacts?.length || 0} contacts
            </div>
          </div>
        </div>

        {/* Special needs indicator */}
        {child.specialNeeds?.hasSpecialNeeds && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '6px',
            padding: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#856404',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              ⚠️ Special Needs/Accommodations
            </div>
            <div style={{
              fontSize: '12px',
              color: '#856404'
            }}>
              This child has special needs or accommodations. View details for more information.
            </div>
          </div>
        )}

        {/* Medical info indicator */}
        {(child.medicalInfo?.allergies?.length > 0 ||
          child.medicalInfo?.medications?.length > 0 ||
          child.medicalInfo?.conditions?.length > 0) && (
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            padding: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#721c24',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              🏥 Medical Information
            </div>
            <div style={{
              fontSize: '12px',
              color: '#721c24'
            }}>
              This child has medical information on file. View details for complete records.
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid #ecf0f1',
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView?.(child);
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          View Details
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(child);
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Edit
        </button>

        {child.status === 'active' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to deactivate ${child.firstName} ${child.lastName}?`)) {
                onDeactivate?.(child);
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Deactivate
          </button>
        ) : child.status === 'inactive' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to reactivate ${child.firstName} ${child.lastName}?`)) {
                onReactivate?.(child);
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Reactivate
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ChildCard;
