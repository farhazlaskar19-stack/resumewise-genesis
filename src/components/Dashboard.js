import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchAllBlueprints, deleteBlueprint, duplicateBlueprint, updateBlueprintStatus } from '../services/resumeService';
import { useToast } from './Toast';
import { DashboardSkeleton } from './SkeletonLoader';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBlueprints: 0,
    completedResumes: 0,
    accountAge: 0
  });

  useEffect(() => {
    loadBlueprints();
  }, [user?.uid]);

  const loadBlueprints = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const blueprintData = await fetchAllBlueprints(user.uid);
      setBlueprints(blueprintData);
      
      // Calculate stats
      const activeCount = blueprintData.length;
      const completedCount = blueprintData.filter(bp => bp.metadata?.status === 'Complete').length;
      const accountAge = user?.metadata?.creationTime ? 
        Math.floor((Date.now() - user.metadata.creationTime) / (1000 * 60 * 60 * 24)) : 0;
      
      setStats({
        activeBlueprints: activeCount,
        completedResumes: completedCount,
        accountAge: accountAge
      });
    } catch (error) {
      console.error('Failed to load blueprints:', error);
      toast.error('Failed to load your blueprints');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blueprintId, templateId) => {
    navigate(`/editor?id=${blueprintId}&template=${templateId}`);
  };

  const handleDuplicate = async (blueprintId, name) => {
    try {
      const newBlueprintId = await duplicateBlueprint(user.uid, blueprintId, name);
      toast.success('Blueprint duplicated successfully');
      loadBlueprints(); // Refresh the list
    } catch (error) {
      console.error('Failed to duplicate blueprint:', error);
      toast.error('Failed to duplicate blueprint');
    }
  };

  const handleDelete = async (blueprintId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteBlueprint(user.uid, blueprintId);
      toast.success('Blueprint deleted successfully');
      loadBlueprints(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete blueprint:', error);
      toast.error('Failed to delete blueprint');
    }
  };

  const handleDownload = async (blueprintId, name) => {
    try {
      // Mark as complete when downloading
      await updateBlueprintStatus(user.uid, blueprintId, 'Complete');
      toast.success('Resume marked as complete');
      
      // Navigate to editor for download
      const blueprint = blueprints.find(bp => bp.id === blueprintId);
      navigate(`/editor?id=${blueprintId}&template=${blueprint.template}&download=true`);
    } catch (error) {
      console.error('Failed to prepare download:', error);
      toast.error('Failed to prepare download');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Incomplete':
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-3xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Blueprints</h1>
              <p className="text-slate-400 mt-2">Manage your resume collection</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create New Blueprint
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-3xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Blueprints</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.activeBlueprints}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-3xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Completed Resumes</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.completedResumes}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-3xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Account Age</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.accountAge}d</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blueprints.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No blueprints yet</h3>
            <p className="text-slate-400 mb-6">Create your first resume blueprint to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Your First Blueprint
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprints.map((blueprint, index) => (
              <motion.div
                key={blueprint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {blueprint.metadata?.name || 'Untitled Blueprint'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(blueprint.metadata?.status)}`}>
                        {blueprint.metadata?.status || 'Incomplete'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {blueprint.template || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Last Modified */}
                <div className="mb-6">
                  <p className="text-sm text-slate-400">Last edited</p>
                  <p className="text-sm text-white">{formatDate(blueprint.metadata?.lastModified)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(blueprint.id, blueprint.template)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Edit
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDuplicate(blueprint.id, blueprint.metadata?.name)}
                    className="px-3 py-2 bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(blueprint.id, blueprint.metadata?.name)}
                    disabled={blueprint.metadata?.status !== 'Complete'}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      blueprint.metadata?.status === 'Complete'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(blueprint.id, blueprint.metadata?.name)}
                    className="px-3 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
