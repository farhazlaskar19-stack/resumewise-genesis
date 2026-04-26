import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { fetchUserResume, saveUserResume, createBlueprint, generateBlueprintId } from './services/resumeService';

// --- TEMPLATE ARCHITECTURE ---
const templates = [
  { id: 'modernist', name: 'The Modernist', color: 'indigo', tag: 'Most Popular', desc: 'Sleek, high-contrast layout for tech professionals.' },
  { id: 'executive', name: 'Executive Elite', color: 'blue', tag: 'Traditional', desc: 'Clean, authoritative structure for leadership roles.' },
  { id: 'creative', name: 'Visual Creative', color: 'purple', tag: 'Design-First', desc: 'Bold use of whitespace and typography for artists.' },
  { id: 'simple', name: 'Paper Minimal', color: 'emerald', tag: 'ATS Optimized', desc: 'Pure focus on content. Maximum bot readability.' },
  { id: 'astraea', name: 'Astraea Pro', color: 'indigo', tag: 'Advanced Grid', desc: 'Our most sophisticated structural blueprint for experts.' }
];

const proTips = [
  "Did you know? Recruiters spend an average of 6 seconds on your first scan.",
  "Pro-Tip: Use action verbs like 'Architected' or 'Spearheaded' to increase impact.",
  "Tip: Modern ATS systems prefer clean, single-column layouts for high accuracy.",
  "Technical Insight: Vector-based PDFs preserve visual fidelity across all devices."
];

function TemplateSelector() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const timersRef = useRef([]);
  const [showGallery, setShowGallery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [hasRecent, setHasRecent] = useState(false);
  const [recentTemplate, setRecentTemplate] = useState('executive');

  // Cycle Pro-Tips during loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % proTips.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    let cancelled = false;
    async function checkRecent() {
      if (!user?.uid) return;
      try {
        const resume = await fetchUserResume(user.uid);
        if (cancelled) return;
        setHasRecent(resume.exists && !!resume.data);
        if (resume.template) setRecentTemplate(resume.template);
      } catch (e) {
        setHasRecent(false);
      }
    }
    checkRecent();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const handleSelect = async (id) => {
    setLoading(true);
    const logs = [
      "Analyzing Design Blueprint...",
      "Optimizing Typography Systems...",
      "Configuring Visual Hierarchy...",
      "Finalizing Engine Setup...",
      "System Ready."
    ];
    
    const timers = [];
    logs.forEach((line, index) => {
      const timer = setTimeout(() => {
        setStatus(line);
        if (index === logs.length - 1) {
          const finalTimer = setTimeout(async () => {
            try {
              const blueprintId = generateBlueprintId();
              if (user?.uid) {
                await createBlueprint(user.uid, id, {});
              }
              localStorage.setItem('selectedTemplate', id);
              localStorage.removeItem('pro_cv_complete_v5_final');
              navigate(`/editor?id=${blueprintId}&template=${id}&scratch=true`);
            } catch (error) {
              navigate(`/editor?template=${id}&scratch=true`);
            }
          }, 1000);
          timers.push(finalTimer);
        }
      }, index * 700);
      timers.push(timer);
    });
    
    timersRef.current.forEach(clearTimeout);
    timersRef.current = timers;
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleNeuralInjection = async () => {
    const code = prompt("Enter your existing Resume JSON code:");
    if (code) {
      try {
        const parsedData = JSON.parse(code);
        localStorage.setItem('pro_cv_complete_v5_final', code);
        if (user?.uid) {
          try {
            await saveUserResume(user.uid, { template: 'modernist', data: parsedData });
          } catch (firestoreError) {}
        }
        handleSelect('modernist'); 
      } catch (e) {
        alert("Invalid JSON format. Please check your structure and try again.");
      }
    }
  };

  const handleRestore = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsedData = JSON.parse(event.target.result);
          localStorage.setItem('pro_cv_complete_v5_final', event.target.result);
          if (user?.uid) {
            try {
              await saveUserResume(user.uid, { template: 'modernist', data: parsedData });
            } catch (firestoreError) {}
          }
          handleSelect('modernist');
        } catch (parseError) {
          alert("Invalid JSON format. Please check your file and try again.");
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 font-sans overflow-x-hidden relative">
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <Navbar />
      </div>

      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      </div>

      <div className="flex flex-col items-center justify-center p-4 md:p-8 pt-28 md:pt-32 relative z-10 min-h-screen">
      
      <AnimatePresence mode="wait">
        {!loading ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full max-w-7xl mx-auto"
          >
            {!showGallery ? (
              /* --- START SCREEN --- */
              <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-12 py-10 md:py-20">
                
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    Resume Builder Pro
                  </motion.div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                    Start Your Next <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Masterpiece.</span>
                  </h1>
                  <p className="text-slate-400 text-base md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                    Choose a professional template or pick up exactly where you left off. Engineered to bypass ATS systems.
                  </p>
                </div>

                <div className="w-full grid gap-4 max-w-md mx-auto">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowGallery(true)}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 border border-white/10 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-3 group"
                  >
                    <span>Start from Scratch</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </motion.button>

                  {user && hasRecent && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/editor?template=${encodeURIComponent(recentTemplate)}`)}
                      className="w-full py-5 bg-white/[0.03] text-white rounded-2xl font-semibold text-lg border border-white/10 hover:bg-white/[0.06] transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Continue Recent Draft
                    </motion.button>
                  )}
                  
                  <div className="flex items-center gap-4 py-4 w-full justify-center">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Or Import</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleNeuralInjection}
                      className="py-3 bg-white/[0.02] border border-white/10 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      JSON Code
                    </button>
                    <button 
                      onClick={handleRestore}
                      className="py-3 bg-white/[0.02] border border-white/10 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Backup File
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* --- TEMPLATE GALLERY --- */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="text-center relative px-4 flex flex-col items-center">
                  <button onClick={() => setShowGallery(false)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white flex items-center gap-2 font-medium transition-colors bg-white/5 px-4 py-2 rounded-xl">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back
                  </button>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">Select a <span className="text-indigo-400">Template</span></h2>
                  <p className="text-slate-400 max-w-xl text-center">Every template is engineered to pass Applicant Tracking Systems (ATS) while looking visually stunning.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4 pb-12">
                  {templates.map((tpl, i) => (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSelect(tpl.id)}
                      className="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-indigo-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 flex flex-col justify-between h-[380px] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-indigo-500/20">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                            {tpl.tag}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{tpl.name}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{tpl.desc}</p>
                      </div>
                      
                      <div className="relative z-10 pt-6 border-t border-white/10 mt-6 flex justify-between items-center">
                         <span className="text-sm font-semibold text-slate-500 group-hover:text-white transition-colors">Use Template</span>
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors text-white">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* --- LOADING SCREEN --- */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-[70vh] w-full z-50 text-center px-6"
          >
            <div className="relative w-24 h-24 mb-10">
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full border-2 border-indigo-500/30 rounded-full flex items-center justify-center border-t-indigo-500"
                >
                    <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
                </motion.div>
            </div>

            <div className="space-y-6">
                <motion.h2 
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-white"
                >
                    {status}
                </motion.h2>
                
                <div className="max-w-sm mx-auto p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
                   <AnimatePresence mode="wait">
                       <motion.p 
                        key={tipIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-slate-400 text-sm font-medium leading-relaxed"
                       >
                           {proTips[tipIndex]}
                       </motion.p>
                   </AnimatePresence>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default TemplateSelector;