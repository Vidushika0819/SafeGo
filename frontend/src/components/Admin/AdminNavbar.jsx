import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, Users, Bus, Route, BarChart3, Settings, Bell, User, LogOut, Menu, Home, AlertCircle, Database, DollarSign, Ticket } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

const AdminNavbar = ({ user, onNavigate, activeTab, unreadNotifications = 0 }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'trips', label: 'Trips', icon: Bus },
    { id: 'buses', label: 'Buses', icon: Home },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'finance', label: 'Finance', icon: DollarSign, externalUrl: 'http://localhost:3000/admin/finance' },
    { id: 'seats', label: 'Seats', icon: Ticket, externalUrl: 'http://localhost:3000/admin/seat Reservation' },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'system', label: 'System', icon: Database },
  ];

  const mobileTabs = [
    { id: 'dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { id: 'users', icon: Users, color: 'text-green-600' },
    { id: 'trips', icon: Bus, color: 'text-purple-600' },
    { id: 'buses', icon: Home, color: 'text-orange-600' },
    { id: 'reports', icon: BarChart3, color: 'text-red-600' },
    { id: 'settings', icon: Settings, color: 'text-gray-600' },
    { id: 'system', icon: Database, color: 'text-indigo-600' },
  ];

  const handleTabChange = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && tab.externalUrl) {
      window.location.href = tab.externalUrl;
    } else {
      onNavigate(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Add logout logic here
    window.location.href = '/login';
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
            : 'bg-white shadow-soft'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">SafeGo</span>
                <span className="text-xs text-gray-500 block -mt-1">Admin Portal</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                    >
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-24">
                        {user?.name || 'Administrator'}
                      </div>
                      <div className="text-xs text-gray-500">Admin</div>
                    </div>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('notifications')}>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <motion.div
                className="md:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <span className="text-lg font-bold text-gray-900">SafeGo Admin</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <tab.icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 backdrop-blur-md">
        <div className="grid grid-cols-7 h-16">
          {mobileTabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center relative ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? tab.color : ''}`} />
              {activeTab === tab.id && (
                <motion.div
                  className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"
                  layoutId="activeMobileTab"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Add bottom spacing for mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default AdminNavbar;
