import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [stats, setStats] = useState({
    activeBlueprints: 0,
    completedResumes: 0,
    accountAge: 0
  });

  const MAX_FREE_RESUMES = 3; // SaaS limit feature

  useEffect(() => {
    loadBlueprints();
  }, [user?.uid]);

  const loadBlueprints = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const blueprintData = await fetchAllBlueprints(user.uid);
      setBlueprints(blueprintData);
      
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

  const handleEdit = (blueprintId, templateId) => navigate(`/editor?id=${blueprintId}&template=${templateId}`);

  const handleDuplicate = async (blueprintId, name) => {
    if (blueprints.length >= MAX_FREE_RESUMES) {
      toast.error('Free tier limit reached. Please upgrade to Pro.');
      return;
    }
    try {
      await duplicateBlueprint(user.uid, blueprintId, name);
      toast.success('Blueprint duplicated successfully');
      loadBlueprints();
    } catch (error) {
      toast.error('Failed to duplicate blueprint');
    }
  };

  const handleDelete = async (blueprintId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    try {
      await deleteBlueprint(user.uid, blueprintId);
      toast.success('Blueprint deleted successfully');
      loadBlueprints();
    } catch (error) {
      toast.error('Failed to delete blueprint');
    }
  };

  const handleDownload = async (blueprintId, name) => {
    try {
      await updateBlueprintStatus(user.uid, blueprintId, 'Complete');
      toast.success('Resume marked as complete');
      const blueprint = blueprints.find(bp => bp.id === blueprintId);
      navigate(`/editor?id=${blueprintId}&template=${blueprint.template}&download=true`);
    } catch (error) {
      toast.error('Failed to prepare download');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // SVGs for Sidebar Icons
  const Icons = {
    Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Templates: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Billing: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    Bell: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'templates', label: 'Templates', icon: Icons.Templates, path: '/select' },
    { id: 'settings', label: 'Settings', icon: Icons.Settings, path: '/settings' },
    { id: 'billing', label: 'Billing & Pro', icon: Icons.Billing, badge: 'Upgrade' }
  ];

  if (loading) return <DashboardSkeleton />;

  const usagePercentage = Math.min(100, (stats.activeBlueprints / MAX_FREE_RESUMES) * 100);

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 flex font-sans overflow-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-screen border-r border-white/5 bg-white/[0.02] backdrop-blur-xl z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">R</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ResumeWise
            </span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  else setActiveTab(item.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon />
                <span className="font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          {/* SaaS Usage Widget */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">Free Plan Usage</span>
              <span className="text-xs text-indigo-400 font-bold">{stats.activeBlueprints} / {MAX_FREE_RESUMES}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${usagePercentage}%` }}
                className={`h-full rounded-full ${usagePercentage >= 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
              />
            </div>
            {usagePercentage >= 100 ? (
              <button className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                Upgrade to Pro
              </button>
            ) : (
              <p className="text-[11px] text-slate-500">You can create {MAX_FREE_RESUMES - stats.activeBlueprints} more resumes.</p>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('/settings')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || 'Pro User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#05050A]/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-lg font-bold text-white">ResumeWise</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-400 hover:text-white">
          <Icons.Menu />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="md:hidden fixed inset-0 z-40 bg-[#05050A] pt-20 px-6 flex flex-col"
          >
            <nav className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    else setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl ${
                    activeTab === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 border border-transparent'
                  }`}
                >
                  <item.icon />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-auto pb-8 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
                <p className="text-sm text-slate-300 mb-2">Usage: {stats.activeBlueprints}/{MAX_FREE_RESUMES}</p>
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 pt-20 md:pt-0">
        
        {/* Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 sticky top-0 bg-[#05050A]/80 backdrop-blur-md z-20 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back!</h2>
            <p className="text-sm text-slate-400 mt-1">Here's what's happening with your applications today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
              <Icons.Bell />
              <span className="absolute top-1 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (blueprints.length >= MAX_FREE_RESUMES) {
                  toast.error('Free limit reached. Upgrade to create more.');
                  return;
                }
                navigate('/select');
              }}
              className="px-5 py-2.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Blueprint
            </motion.button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { label: 'Active Blueprints', value: stats.activeBlueprints, icon: <Icons.Dashboard />, color: 'from-indigo-500/20 to-blue-500/5', text: 'text-indigo-400' },
              { label: 'Completed Resumes', value: stats.completedResumes, icon: <Icons.Templates />, color: 'from-emerald-500/20 to-teal-500/5', text: 'text-emerald-400' },
              { label: 'Account Age (Days)', value: stats.accountAge, icon: <Icons.Settings />, color: 'from-amber-500/20 to-orange-500/5', text: 'text-amber-400' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-all duration-300`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-[50px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100`}></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/5 ${stat.text}`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Blueprints Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                Recent Blueprints
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-slate-300 font-medium">
                  {blueprints.length}
                </span>
              </h3>
              {/* Mobile Only Create Button */}
              <button 
                onClick={() => navigate('/select')}
                className="md:hidden px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/20"
              >
                + New
              </button>
            </div>

            {blueprints.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/[0.02] border border-white/5 rounded-3xl"
              >
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(79,70,229,0.15)]">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No blueprints found</h3>
                <p className="text-slate-400 max-w-sm mb-8 text-sm">You haven't created any resumes yet. Start your journey to a better career by creating your first blueprint.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/select')}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  Create First Blueprint
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blueprints.map((blueprint, index) => (
                  <motion.div
                    key={blueprint.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {blueprint.metadata?.name || 'Untitled Blueprint'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                            blueprint.metadata?.status === 'Complete' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {blueprint.metadata?.status || 'Draft'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                            {blueprint.template || 'Default'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Dropdown Menu Toggle (Static visual only for space saving) */}
                      <button className="text-slate-500 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </div>

                    <div className="mb-6 flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Last Modified</p>
                      <p className="text-sm text-slate-300 font-medium flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {formatDate(blueprint.metadata?.lastModified)}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-auto">
                      <button
                        onClick={() => handleEdit(blueprint.id, blueprint.template)}
                        className="col-span-2 py-2 bg-white/10 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDuplicate(blueprint.id, blueprint.metadata?.name)}
                        className="py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center tooltip-trigger relative"
                        title="Duplicate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(blueprint.id, blueprint.metadata?.name)}
                        className="py-2 bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
