import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import ParentNavbar from '../ParentNavbar';
import { Button } from '../../ui/button';
import { Plus, Users, Search, Filter } from 'lucide-react';
import ChildList from './ChildList';
import ChildFormModern from './ChildFormModern';

const ChildrenManagement = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [editingChild, setEditingChild] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddChild = () => {
    setEditingChild(null);
    setCurrentView('form');
  };

  const handleEditChild = (child) => {
    setEditingChild(child);
    setCurrentView('form');
  };

  const handleViewChild = (child) => {
    // For now, just show edit form - in future could have separate view mode
    setEditingChild(child);
    setCurrentView('form');
  };

  const handleSaveChild = (savedChild) => {
    setCurrentView('list');
    setEditingChild(null);
    // Trigger refresh of child list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setCurrentView('list');
    setEditingChild(null);
  };

  const handleDeactivateChild = (child) => {
    // Trigger refresh after deactivation
    setRefreshTrigger(prev => prev + 1);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Modern Navbar */}
      <ParentNavbar
        user={user}
        onNavigate={() => {}}
        activeView="children"
      />

      {/* Main Content Area with Animation */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-16 min-h-screen"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentView === 'list' && (
              <>
                {/* Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary-600" />
                        My Children
                      </h1>
                      <p className="mt-2 text-neutral-600">
                        Manage your children's information and trip preferences
                      </p>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleAddChild}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 text-lg font-medium"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Child
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-medium border border-neutral-200 p-6 mb-8"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                      <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search children by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-2 min-w-fit">
                      <Filter className="w-5 h-5 text-neutral-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* Children List */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ChildList
                    key={refreshTrigger}
                    searchTerm={searchTerm}
                    filterStatus={filterStatus}
                    onEditChild={handleEditChild}
                    onViewChild={handleViewChild}
                    onDeactivateChild={handleDeactivateChild}
                  />
                </motion.div>
              </>
            )}

            {currentView === 'form' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChildFormModern
                  child={editingChild}
                  onSave={handleSaveChild}
                  onCancel={handleCancelForm}
                />
              </motion.div>
            )}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default ChildrenManagement;
