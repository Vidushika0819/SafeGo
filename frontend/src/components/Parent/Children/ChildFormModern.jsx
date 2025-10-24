import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../context/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ChevronLeft, ChevronRight, User, Phone } from 'lucide-react';
import { basicInfoSchema, emergencySchema } from './validation';

const ChildFormModern = ({
  child,
  onSave,
  onCancel
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Initialize form data
  const defaultFormData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: null,
    grade: null,
    schoolName: '',
    primaryContact: {
      name: '',
      relationship: undefined,
      phone: ''
    },
    secondaryContact: {
      name: '',
      relationship: undefined,
      phone: ''
    }
  };

  // Load existing data if editing
  const formData = child ? {
    firstName: child.firstName || '',
    lastName: child.lastName || '',
    dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
    gender: child.gender || undefined,
    grade: child.grade || undefined,
    schoolName: child.schoolName || '',
    primaryContact: child.emergencyContacts?.find((c) => c.isPrimary) ? {
      name: child.emergencyContacts.find((c) => c.isPrimary).name || '',
      relationship: child.emergencyContacts.find((c) => c.isPrimary).relationship || undefined,
      phone: child.emergencyContacts.find((c) => c.isPrimary).phone || ''
    } : {
      name: '',
      relationship: undefined,
      phone: ''
    },
    secondaryContact: child.emergencyContacts?.find((c) => !c.isPrimary) ? {
      name: child.emergencyContacts.find((c) => !c.isPrimary).name || '',
      relationship: child.emergencyContacts.find((c) => !c.isPrimary).relationship || undefined,
      phone: child.emergencyContacts.find((c) => !c.isPrimary).phone || ''
    } : {
      name: '',
      relationship: undefined,
      phone: ''
    }
  } : defaultFormData;

  const form = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Emergency Contacts', icon: Phone }
  ];

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Get all form values using getValues()
      const data = form.getValues();
      console.log('Raw form data using getValues():', data);

      // Log individual field values for debugging
      console.log('Individual field check:');
      console.log('firstName:', form.getValues('firstName'));
      console.log('lastName:', form.getValues('lastName'));
      console.log('dateOfBirth:', form.getValues('dateOfBirth'));
      console.log('gender:', form.getValues('gender'));
      console.log('grade:', form.getValues('grade'));
      console.log('schoolName:', form.getValues('schoolName'));

      // Basic date validation
      if (!data.dateOfBirth || data.dateOfBirth === '') {
        console.error('Date of birth is empty:', data.dateOfBirth);
        throw new Error('Date of birth is required');
      }

      const submitData = {
        firstName: (data.firstName || '').trim(),
        lastName: (data.lastName || '').trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        grade: data.grade,
        schoolName: (data.schoolName || '').trim(),
        emergencyContacts: [
          {
            name: (data.primaryContact?.name || '').trim(),
            relationship: data.primaryContact?.relationship,
            phone: (data.primaryContact?.phone || '').replace(/[\s\-\(\)]/g, ''),
            isPrimary: true
          },
          {
            name: (data.secondaryContact?.name || '').trim(),
            relationship: data.secondaryContact?.relationship,
            phone: (data.secondaryContact?.phone || '').replace(/[\s\-\(\)]/g, ''),
            isPrimary: false
          }
        ]
      };

      // Debug logging
      console.log('Submitting child data:', submitData);

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
        body: JSON.stringify(submitData)
      });

      // Log response for debugging
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend validation errors:', errorData);
        throw new Error(errorData.message || `Failed to ${child ? 'update' : 'create'} child`);
      }

      const result = await response.json();
      console.log('Success:', result);
      onSave(result.data);
    } catch (error) {
      console.error('Error saving child:', error);
      alert(`Failed to ${child ? 'update' : 'create'} child: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div className={`flex items-center ${currentStep >= step.id ? 'text-primary-600' : 'text-neutral-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.id ? 'border-primary-600 bg-primary-50' : 'border-neutral-300 bg-white'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <div className="text-xs font-medium text-neutral-500 uppercase">
                  Step {step.id}
                </div>
                <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  {step.title}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-primary-600' : 'bg-neutral-300'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderBasicInformation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          Child Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date of Birth *
          </label>
          <input
            id="dateOfBirth"
            type="date"
            {...form.register('dateOfBirth')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade *</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="preschool">Pre-School</SelectItem>
                    <SelectItem value="kindergarten">Kindergarten</SelectItem>
                    <SelectItem value="grade1">Grade 1</SelectItem>
                    <SelectItem value="grade2">Grade 2</SelectItem>
                    <SelectItem value="grade3">Grade 3</SelectItem>
                    <SelectItem value="grade4">Grade 4</SelectItem>
                    <SelectItem value="grade5">Grade 5</SelectItem>
                    <SelectItem value="grade6">Grade 6</SelectItem>
                    <SelectItem value="grade7">Grade 7</SelectItem>
                    <SelectItem value="grade8">Grade 8</SelectItem>
                    <SelectItem value="grade9">Grade 9</SelectItem>
                    <SelectItem value="grade10">Grade 10</SelectItem>
                    <SelectItem value="grade11">Grade 11</SelectItem>
                    <SelectItem value="grade12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="schoolName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter school name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary-600" />
            Primary Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="primaryContact.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryContact.relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship *</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="grandparent">Grandparent</SelectItem>
                    <SelectItem value="aunt">Aunt</SelectItem>
                    <SelectItem value="uncle">Uncle</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryContact.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-neutral-600" />
            Secondary Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="secondaryContact.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryContact.relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship *</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="grandparent">Grandparent</SelectItem>
                    <SelectItem value="aunt">Aunt</SelectItem>
                    <SelectItem value="uncle">Uncle</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryContact.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden mb-6">
        <div className="bg-primary-600 text-white p-6">
          <h1 className="text-2xl font-bold">
            {child ? 'Edit Child Information' : 'Add New Child'}
          </h1>
          <p className="mt-2 opacity-90">
            {child ? 'Update your child\'s information' : 'Register a new child for transportation services'}
          </p>
        </div>

        <div className="p-6">
          {renderStepIndicator()}
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: currentStep === 1 ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentStep === 1 ? -100 : 100 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderBasicInformation()}
              {currentStep === 2 && renderEmergencyContacts()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={loading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}

              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Saving...' : (child ? 'Update Child' : 'Add Child')}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChildFormModern;
