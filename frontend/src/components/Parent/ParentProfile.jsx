import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ParentNavbar from './ParentNavbar';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Settings, Shield, Bell, Key, Save, X, Camera, Mail, Phone, MapPin, Calendar, Globe, Lock } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const ParentProfile = () => {
  const { user, getUserDisplayName } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data for notifications and security
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    tripUpdates: true,
    emergencyAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true,
    deviceTracking: true
  });

  // Form schemas
  const profileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    DOB: z.string().min(1, 'Date of birth is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
  });

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  // Form hooks
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      DOB: '',
      email: '',
      address: '',
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  // Load profile data
  useEffect(() => {
    if (user?.role === 'parent' && user?.email) {
      loadParentProfile();
    }
  }, [user]);

  const loadParentProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5005/parents/email/${user.email}`);
      const parent = response.data.parent;

      profileForm.reset({
        fullName: parent.fullName || '',
        phoneNumber: parent.phoneNumber || '',
        DOB: parent.DOB ? new Date(parent.DOB).toISOString().split('T')[0] : '',
        email: parent.email || '',
        address: parent.address || '',
      });
    } catch (error) {
      console.error('Error loading parent profile:', error);
      // Use auth context data as fallback
      profileForm.reset({
        fullName: user.name || '',
        phoneNumber: user.phone || '',
        DOB: '',
        email: user.email || '',
        address: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);

      let parentExists = false;
      let parentId = null;

      try {
        const response = await axios.get(`http://localhost:5005/parents/email/${user.email}`);
        parentExists = true;
        parentId = response.data.parent._id;
      } catch (error) {
        parentExists = false;
      }

      if (parentExists) {
        await axios.put(`http://localhost:5005/parents/${parentId}`, data);
      } else {
        await axios.post('http://localhost:5005/parents', {
          ...data,
          parentId: `P${Date.now()}`,
        });
      }

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setLoading(true);
      // Mock password change - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Password changed successfully!');
      passwordForm.reset();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSecurityChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Modern Navbar */}
      <ParentNavbar
        user={user}
        onNavigate={() => {}}
        activeView="profile"
      />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16 min-h-screen"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                className="mb-6 bg-success-50 border border-success-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-success-800 font-medium">{successMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <User className="w-8 h-8 text-primary-600" />
              Account Settings
            </h1>
            <p className="mt-2 text-neutral-600">
              Manage your account information and preferences
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Preferences
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-medium border border-neutral-200 p-8"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-3xl font-bold text-white">
                        {(profileForm.watch('fullName') || 'P').charAt(0).toUpperCase()}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
                      >
                        <Camera className="w-4 h-4 text-neutral-600" />
                      </motion.button>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      {profileForm.watch('fullName') || 'Parent Account'}
                    </h2>
                    <p className="text-neutral-600">Manage your personal information</p>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address
                        </label>
                        <input
                          {...profileForm.register('email')}
                          type="email"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="your@email.com"
                        />
                        {profileForm.formState.errors.email && (
                          <p className="mt-1 text-sm text-error-600">{profileForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone Number
                        </label>
                        <input
                          {...profileForm.register('phoneNumber')}
                          type="tel"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                        {profileForm.formState.errors.phoneNumber && (
                          <p className="mt-1 text-sm text-error-600">{profileForm.formState.errors.phoneNumber.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        <input
                          {...profileForm.register('fullName')}
                          type="text"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="John Doe"
                        />
                        {profileForm.formState.errors.fullName && (
                          <p className="mt-1 text-sm text-error-600">{profileForm.formState.errors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Date of Birth
                        </label>
                        <input
                          {...profileForm.register('DOB')}
                          type="date"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                        />
                        {profileForm.formState.errors.DOB && (
                          <p className="mt-1 text-sm text-error-600">{profileForm.formState.errors.DOB.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Address
                        </label>
                        <textarea
                          {...profileForm.register('address')}
                          rows="3"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical"
                          placeholder="Enter your full address"
                        />
                        {profileForm.formState.errors.address && (
                          <p className="mt-1 text-sm text-error-600">{profileForm.formState.errors.address.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => profileForm.reset()}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reset Changes
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-medium border border-neutral-200 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-neutral-900">Password & Security</h2>
                  </div>

                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Lock className="w-4 h-4 inline mr-2" />
                          Current Password
                        </label>
                        <input
                          {...passwordForm.register('currentPassword')}
                          type="password"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="Enter current password"
                        />
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="mt-1 text-sm text-error-600">{passwordForm.formState.errors.currentPassword.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Key className="w-4 h-4 inline mr-2" />
                          New Password
                        </label>
                        <input
                          {...passwordForm.register('newPassword')}
                          type="password"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="Enter new password"
                        />
                        {passwordForm.formState.errors.newPassword && (
                          <p className="mt-1 text-sm text-error-600">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          {...passwordForm.register('confirmPassword')}
                          type="password"
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          placeholder="Confirm new password"
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="mt-1 text-sm text-error-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>

                  {/* Two-Factor Authentication */}
                  <div className="mt-8 pt-6 border-t border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-neutral-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleSecurityChange('twoFactorEnabled', !securitySettings.twoFactorEnabled)}
                        className={securitySettings.twoFactorEnabled ? 'bg-success-50 text-success-700 border-success-300' : ''}
                      >
                        {securitySettings.twoFactorEnabled ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-medium border border-neutral-200 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-neutral-900">Notification Preferences</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Trip Notifications */}
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Trip Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'tripUpdates', label: 'Real-time Trip Updates', desc: 'Get notified when children are picked up or dropped off' },
                          { key: 'emergencyAlerts', label: 'Emergency Alerts', desc: 'Critical safety notifications and delays' },
                          { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive important updates via text message' },
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-neutral-900">{label}</p>
                              <p className="text-sm text-neutral-600">{desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationSettings[key]}
                                onChange={(e) => handleNotificationChange(key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account Notifications */}
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Account Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', desc: 'General account updates and receipts' },
                          { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly summary of your children\'s transportation' },
                          { key: 'marketingEmails', label: 'Marketing Communications', desc: 'Product updates and promotional offers' },
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-neutral-900">{label}</p>
                              <p className="text-sm text-neutral-600">{desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationSettings[key]}
                                onChange={(e) => handleNotificationChange(key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-medium border border-neutral-200 p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-neutral-900">Account Preferences</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Language & Region */}
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Language & Region</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            <Globe className="w-4 h-4 inline mr-2" />
                            Language
                          </label>
                          <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Timezone
                          </label>
                          <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
                            <option value="UTC-5">Eastern Time</option>
                            <option value="UTC-6">Central Time</option>
                            <option value="UTC-7">Mountain Time</option>
                            <option value="UTC-8">Pacific Time</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-neutral-900">Profile Visibility</p>
                            <p className="text-sm text-neutral-600">Allow other parents to see your profile</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-neutral-900">Data Analytics</p>
                            <p className="text-sm text-neutral-600">Help improve SafeGo by sharing usage data</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default ParentProfile;
