import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const ChildForm = ({ child, onSave, onCancel }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    grade: '',

    // School Information
    schoolName: '',
    studentId: '',

    // Emergency Contacts
    emergencyContacts: [
      {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        isPrimary: true
      },
      {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        isPrimary: false
      }
    ],

    // Medical Information
    medicalInfo: {
      allergies: [],
      medications: [],
      conditions: [],
      doctorName: '',
      doctorPhone: '',
      insuranceProvider: '',
      insuranceNumber: ''
    },

    // Special Needs
    specialNeeds: {
      hasSpecialNeeds: false,
      needs: [],
      accommodations: [],
      assistiveDevices: []
    },

    // Transportation
    transportationNotes: '',
    pickupLocation: {
      address: '',
      specialInstructions: ''
    },
    dropoffLocation: {
      address: '',
      specialInstructions: ''
    }
  });

  // Load existing child data if editing
  useEffect(() => {
    if (child) {
      setFormData({
        firstName: child.firstName || '',
        lastName: child.lastName || '',
        dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
        gender: child.gender || '',
        grade: child.grade || '',
        schoolName: child.schoolName || '',
        studentId: child.studentId || '',
        emergencyContacts: child.emergencyContacts?.length >= 2
          ? child.emergencyContacts
          : [
              {
                name: child.emergencyContacts?.[0]?.name || '',
                relationship: child.emergencyContacts?.[0]?.relationship || '',
                phone: child.emergencyContacts?.[0]?.phone || '',
                email: child.emergencyContacts?.[0]?.email || '',
                isPrimary: true
              },
              {
                name: child.emergencyContacts?.[1]?.name || '',
                relationship: child.emergencyContacts?.[1]?.relationship || '',
                phone: child.emergencyContacts?.[1]?.phone || '',
                email: child.emergencyContacts?.[1]?.email || '',
                isPrimary: false
              }
            ],
        medicalInfo: {
          allergies: child.medicalInfo?.allergies || [],
          medications: child.medicalInfo?.medications || [],
          conditions: child.medicalInfo?.conditions || [],
          doctorName: child.medicalInfo?.doctorName || '',
          doctorPhone: child.medicalInfo?.doctorPhone || '',
          insuranceProvider: child.medicalInfo?.insuranceProvider || '',
          insuranceNumber: child.medicalInfo?.insuranceNumber || ''
        },
        specialNeeds: {
          hasSpecialNeeds: child.specialNeeds?.hasSpecialNeeds || false,
          needs: child.specialNeeds?.needs || [],
          accommodations: child.specialNeeds?.accommodations || [],
          assistiveDevices: child.specialNeeds?.assistiveDevices || []
        },
        transportationNotes: child.transportationNotes || '',
        pickupLocation: {
          address: child.pickupLocation?.address || '',
          specialInstructions: child.pickupLocation?.specialInstructions || ''
        },
        dropoffLocation: {
          address: child.dropoffLocation?.address || '',
          specialInstructions: child.dropoffLocation?.specialInstructions || ''
        }
      });
    }
  }, [child]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      emergencyContacts: updatedContacts
    }));
  };

  const handleMedicalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        [field]: value
      }
    }));
  };

  const handleSpecialNeedsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specialNeeds: {
        ...prev.specialNeeds,
        [field]: value
      }
    }));
  };

  const handleLocationChange = (locationType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [locationType]: {
        ...prev[locationType],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of birth is required';
        } else {
          // Validate age (must be between 3 and 18 years old)
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 3 || age > 18) {
            newErrors.dateOfBirth = 'Child must be between 3 and 18 years old';
          }
        }
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.grade) newErrors.grade = 'Grade is required';
        if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
        break;

      case 2: // Emergency Contacts
        formData.emergencyContacts.forEach((contact, index) => {
          if (!contact.name.trim()) newErrors[`emergencyContacts.${index}.name`] = 'Contact name is required';
          if (!contact.relationship) newErrors[`emergencyContacts.${index}.relationship`] = 'Relationship is required';
          if (!contact.phone.trim()) {
            newErrors[`emergencyContacts.${index}.phone`] = 'Phone number is required';
          } else {
            // Basic phone validation
            const cleanPhone = contact.phone.replace(/[\s\-\(\)]/g, '');
            if (!/^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone)) {
              newErrors[`emergencyContacts.${index}.phone`] = 'Please enter a valid phone number';
            }
          }
          if (contact.email && contact.email.trim()) {
            // Email validation if provided
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contact.email)) {
              newErrors[`emergencyContacts.${index}.email`] = 'Please enter a valid email address';
            }
          }
        });

        // Check that exactly one contact is primary
        const primaryContacts = formData.emergencyContacts.filter(c => c.isPrimary);
        if (primaryContacts.length !== 1) {
          newErrors.primaryContact = 'Exactly one emergency contact must be marked as primary';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate all steps
    for (let step = 1; step <= 3; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = child ? 'PUT' : 'POST';
      const url = child
        ? `http://localhost:5005/api/children/${child._id}`
        : 'http://localhost:5005/api/children';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save child');
      }

      const result = await response.json();
      onSave(result.data);
    } catch (error) {
      console.error('Error saving child:', error);
      alert(`Failed to ${child ? 'update' : 'create'} child: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: '👶' },
    { id: 2, title: 'Emergency Contacts', icon: '📞' },
    { id: 3, title: 'Additional Information', icon: '📋' }
  ];

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px'
    }}>
      {steps.map((step) => (
        <div
          key={step.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 15px'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: currentStep >= step.id ? '#3498db' : '#ecf0f1',
            color: currentStep >= step.id ? 'white' : '#7f8c8d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>
            {step.icon}
          </div>
          <div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d',
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}>
              Step {step.id}
            </div>
            <div style={{
              fontSize: '14px',
              color: currentStep >= step.id ? '#3498db' : '#7f8c8d',
              fontWeight: currentStep >= step.id ? 'bold' : 'normal'
            }}>
              {step.title}
            </div>
          </div>
          {step.id < steps.length && (
            <div style={{
              width: '30px',
              height: '2px',
              backgroundColor: currentStep > step.id ? '#3498db' : '#ecf0f1',
              marginLeft: '15px'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const renderBasicInformation = () => (
    <div>
      <h3 style={{
        margin: '0 0 20px 0',
        color: '#2c3e50',
        fontSize: '20px'
      }}>
        Basic Information
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.firstName ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
              {errors.firstName}
            </div>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.lastName ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
              {errors.lastName}
            </div>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.dateOfBirth ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          {errors.dateOfBirth && (
            <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
              {errors.dateOfBirth}
            </div>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.gender ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
              {errors.gender}
            </div>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Grade *
          </label>
          <select
            value={formData.grade}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.grade ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            <option value="">Select grade</option>
            <option value="preschool">Pre-School</option>
            <option value="kindergarten">Kindergarten</option>
            <option value="grade1">Grade 1</option>
            <option value="grade2">Grade 2</option>
            <option value="grade3">Grade 3</option>
            <option value="grade4">Grade 4</option>
            <option value="grade5">Grade 5</option>
            <option value="grade6">Grade 6</option>
            <option value="grade7">Grade 7</option>
            <option value="grade8">Grade 8</option>
            <option value="grade9">Grade 9</option>
            <option value="grade10">Grade 10</option>
            <option value="grade11">Grade 11</option>
            <option value="grade12">Grade 12</option>
          </select>
          {errors.grade && (
            <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
              {errors.grade}
            </div>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            School Name *
          </label>
          <input
            type="text"
            value={formData.schoolName}
            onChange={(e) => handleInputChange('schoolName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.schoolName ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="Enter school name"
          />
          {errors.schoolName && (
            <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
              {errors.schoolName}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>
          Student ID (Optional)
        </label>
        <input
          type="text"
          value={formData.studentId}
          onChange={(e) => handleInputChange('studentId', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ecf0f1',
            borderRadius: '6px',
            fontSize: '16px'
          }}
          placeholder="Enter student ID if available"
        />
      </div>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div>
      <h3 style={{
        margin: '0 0 20px 0',
        color: '#2c3e50',
        fontSize: '20px'
      }}>
        Emergency Contacts
      </h3>
      <p style={{
        margin: '0 0 20px 0',
        color: '#7f8c8d',
        fontSize: '14px'
      }}>
        At least 2 emergency contacts are required. One must be marked as primary.
      </p>

      {formData.emergencyContacts.map((contact, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h4 style={{
              margin: 0,
              color: '#2c3e50',
              fontSize: '16px'
            }}>
              Contact {index + 1} {contact.isPrimary && '(Primary)'}
            </h4>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <input
                type="checkbox"
                checked={contact.isPrimary}
                onChange={(e) => {
                  const updatedContacts = [...formData.emergencyContacts];
                  // Uncheck all others if this one is checked
                  if (e.target.checked) {
                    updatedContacts.forEach((c, i) => {
                      updatedContacts[i].isPrimary = i === index;
                    });
                  }
                  setFormData(prev => ({
                    ...prev,
                    emergencyContacts: updatedContacts
                  }));
                }}
              />
              Primary Contact
            </label>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#2c3e50',
                fontSize: '14px'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${errors[`emergencyContacts.${index}.name`] ? '#e74c3c' : '#ecf0f1'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter full name"
              />
              {errors[`emergencyContacts.${index}.name`] && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errors[`emergencyContacts.${index}.name`]}
                </div>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#2c3e50',
                fontSize: '14px'
              }}>
                Relationship *
              </label>
              <select
                value={contact.relationship}
                onChange={(e) => handleEmergencyContactChange(index, 'relationship', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${errors[`emergencyContacts.${index}.relationship`] ? '#e74c3c' : '#ecf0f1'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="grandparent">Grandparent</option>
                <option value="aunt">Aunt</option>
                <option value="uncle">Uncle</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
              {errors[`emergencyContacts.${index}.relationship`] && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errors[`emergencyContacts.${index}.relationship`]}
                </div>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#2c3e50',
                fontSize: '14px'
              }}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${errors[`emergencyContacts.${index}.phone`] ? '#e74c3c' : '#ecf0f1'}`,
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter phone number"
              />
              {errors[`emergencyContacts.${index}.phone`] && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errors[`emergencyContacts.${index}.phone`]}
                </div>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#2c3e50',
                fontSize: '14px'
              }}>
                Email (Optional)
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => handleEmergencyContactChange(index, 'email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #ecf0f1',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAdditionalInformation = () => (
    <div>
      <h3 style={{
        margin: '0 0 20px 0',
        color: '#2c3e50',
        fontSize: '20px'
      }}>
        Additional Information
      </h3>

      {/* Transportation Notes */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>
          Transportation Notes (Optional)
        </label>
        <textarea
          value={formData.transportationNotes}
          onChange={(e) => handleInputChange('transportationNotes', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ecf0f1',
            borderRadius: '6px',
            fontSize: '14px',
            minHeight: '80px',
            resize: 'vertical'
          }}
          placeholder="Any special transportation requirements or notes..."
        />
      </div>

      {/* Pickup Location */}
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#2c3e50',
          fontSize: '16px'
        }}>
          Pickup Location (Optional)
        </h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Address
          </label>
          <input
            type="text"
            value={formData.pickupLocation.address}
            onChange={(e) => handleLocationChange('pickupLocation', 'address', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ecf0f1',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            placeholder="Enter pickup address"
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Special Instructions
          </label>
          <textarea
            value={formData.pickupLocation.specialInstructions}
            onChange={(e) => handleLocationChange('pickupLocation', 'specialInstructions', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ecf0f1',
              borderRadius: '6px',
              fontSize: '14px',
              minHeight: '60px',
              resize: 'vertical'
            }}
            placeholder="Any special pickup instructions..."
          />
        </div>
      </div>

      {/* Dropoff Location */}
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#2c3e50',
          fontSize: '16px'
        }}>
          Dropoff Location (Optional)
        </h4>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Address
          </label>
          <input
            type="text"
            value={formData.dropoffLocation.address}
            onChange={(e) => handleLocationChange('dropoffLocation', 'address', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ecf0f1',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            placeholder="Enter dropoff address"
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Special Instructions
          </label>
          <textarea
            value={formData.dropoffLocation.specialInstructions}
            onChange={(e) => handleLocationChange('dropoffLocation', 'specialInstructions', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ecf0f1',
              borderRadius: '6px',
              fontSize: '14px',
              minHeight: '60px',
              resize: 'vertical'
            }}
            placeholder="Any special dropoff instructions..."
          />
        </div>
      </div>

      {/* Medical Information Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#2c3e50',
          fontSize: '16px'
        }}>
          🏥 Medical Information (Optional)
        </h4>
        <p style={{
          margin: '0 0 20px 0',
          color: '#7f8c8d',
          fontSize: '14px'
        }}>
          This information helps ensure your child's safety during transportation.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '14px'
            }}>
              Doctor Name
            </label>
            <input
              type="text"
              value={formData.medicalInfo.doctorName}
              onChange={(e) => handleMedicalInfoChange('doctorName', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ecf0f1',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter doctor's name"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '14px'
            }}>
              Doctor Phone
            </label>
            <input
              type="tel"
              value={formData.medicalInfo.doctorPhone}
              onChange={(e) => handleMedicalInfoChange('doctorPhone', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ecf0f1',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter doctor's phone"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderEmergencyContacts();
      case 3:
        return renderAdditionalInformation();
      default:
        return renderBasicInformation();
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: '24px'
        }}>
          {child ? 'Edit Child Information' : 'Add New Child'}
        </h2>
        <p style={{
          margin: 0,
          opacity: 0.9,
          fontSize: '16px'
        }}>
          {child ? 'Update your child\'s information' : 'Register a new child for transportation services'}
        </p>
      </div>

      {/* Step Indicator */}
      <div style={{ padding: '30px 30px 0 30px' }}>
        {renderStepIndicator()}
      </div>

      {/* Form Content */}
      <div style={{ padding: '0 30px 30px 30px' }}>
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div style={{
        padding: '20px 30px',
        borderTop: '1px solid #ecf0f1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Cancel
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f8f9fa',
                color: '#2c3e50',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Saving...' : (child ? 'Update Child' : 'Add Child')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildForm;
