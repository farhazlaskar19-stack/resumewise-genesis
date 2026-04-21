import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { fetchUserResume, saveUserResume } from './services/resumeService';

// --- TEMPLATE ARCHITECTURE ---
// FIXED: Added Astraea and Synced minimalist to "simple" to match Editor.js logic
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
  const [showGallery, setShowGallery] = useState(false); // State to separate Step 1 and Step 2
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [logLines, setLogLines] = useState([]);
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

  const handleSelect = (id) => {
    setLoading(true);
    // PROFESSIONAL TRANSITION STEPS
    const logs = [
      "Analyzing Design Blueprint...",
      "Optimizing Typography Systems...",
      "Configuring Visual Hierarchy...",
      "Finalizing Engine Setup...",
      "System Ready."
    ];
    
    // Store timers for cleanup
    const timers = [];
    logs.forEach((line, index) => {
      const timer = setTimeout(() => {
        setStatus(line);
        setLogLines((prev) => [...prev, line].slice(-4)); 
        if (index === logs.length - 1) {
          const finalTimer = setTimeout(() => navigate(`/editor?template=${id}`), 1000);
          timers.push(finalTimer);
        }
      }, index * 700);
      timers.push(timer);
    });
    
    // Store timers in ref for cleanup and clear previous ones
    timersRef.current.forEach(clearTimeout);
    timersRef.current = timers;
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // --- ADDED WORKING LOGIC FOR ENTRY BUTTONS ---
  
  const handleNeuralInjection = async () => {
    const code = prompt("Enter your existing Resume JSON code:");
    if (code) {
      try {
        // Validate JSON structure
        const parsedData = JSON.parse(code);
        
        // Save to localStorage for immediate use
        localStorage.setItem('pro_cv_complete_v5_final', code);
        
        // Save to Firestore if user is authenticated
        if (user?.uid) {
          try {
            await saveUserResume(user.uid, { template: 'modernist', data: parsedData });
            console.log('Resume data saved to Firestore');
          } catch (firestoreError) {
            console.warn('Failed to save to Firestore, data saved locally:', firestoreError);
            // Still proceed to editor even if Firestore save fails
          }
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
          // Validate JSON structure
          const parsedData = JSON.parse(event.target.result);
          
          // Save to localStorage for immediate use
          localStorage.setItem('pro_cv_complete_v5_final', event.target.result);
          
          // Save to Firestore if user is authenticated
          if (user?.uid) {
            try {
              await saveUserResume(user.uid, { template: 'modernist', data: parsedData });
              console.log('Resume data saved to Firestore');
            } catch (firestoreError) {
              console.warn('Failed to save to Firestore, data saved locally:', firestoreError);
              // Still proceed to editor even if Firestore save fails
            }
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
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden relative">
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center p-4 md:p-8 pt-28 md:pt-32">
      
      {/* BACKGROUND PARTICLE FIELD (Preserved logic) */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.4 }} 
            className="fixed inset-0 pointer-events-none z-0"
          >
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * window.innerWidth }}
                animate={{ y: window.innerHeight + 20 }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "linear" }}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 blur-[100px] md:blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[100px] md:blur-[150px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {!loading ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="z-10 w-full max-w-7xl pt-4 md:pt-12"
          >
            {!showGallery ? (
              /* --- CENTERED PROFESSIONAL ENTRY PORTAL --- */
              <div className="flex flex-col items-center justify-center text-center space-y-10 md:space-y-16 py-10 md:py-20">
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]"
                  >
                    Genesis Engine v1.0
                  </motion.div>
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase">
                    Design Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white/40">Blueprint.</span>
                  </h1>
                  <p className="max-w-lg mx-auto text-slate-500 text-base md:text-lg font-medium italic opacity-80 px-4">High-performance structural frameworks for the modern professional.</p>
                </div>

                <div className="w-full max-w-md space-y-6 px-4">
                  <div className={`grid gap-4 ${user && hasRecent ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowGallery(true)}
                      className="w-full py-6 md:py-8 bg-indigo-600 rounded-[28px] md:rounded-[32px] font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-2xl"
                    >
                      Start from Scratch
                    </motion.button>

                    {user && hasRecent ? (
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255, 255, 255, 0.08)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(`/editor?template=${encodeURIComponent(recentTemplate)}`)}
                        className="w-full py-6 md:py-8 bg-white/5 border border-white/10 rounded-[28px] md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all text-white/80 hover:text-white hover:bg-white/10"
                      >
                        Continue Recent Blueprint
                      </motion.button>
                    ) : null}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleNeuralInjection}
                      className="py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-[20px] md:rounded-[24px] font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                    >
                      Import Code
                    </button>
                    <button 
                      onClick={handleRestore}
                      className="py-4 md:py-5 bg-white/[0.03] border border-white/10 rounded-[20px] md:rounded-[24px] font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                    >
                      Upload File
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* --- REFINED TEMPLATE GALLERY --- */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 md:space-y-16">
                <div className="text-center relative px-4">
                  <button onClick={() => setShowGallery(false)} className="md:absolute left-0 top-1/2 md:-translate-y-1/2 text-slate-600 hover:text-indigo-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all mb-6 md:mb-0 block mx-auto md:inline">← Back to Start</button>
                  <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter">Choose Your <span className="text-indigo-500">Framework</span></h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4 md:px-4 pb-10">
                  {templates.map((tpl) => (
                    <motion.div
                      key={tpl.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      onClick={() => handleSelect(tpl.id)}
                      className="bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-left cursor-pointer hover:border-indigo-500/50 transition-all group h-[380px] md:h-[420px] flex flex-col justify-between relative overflow-hidden backdrop-blur-3xl"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-2xl mb-6 md:mb-8 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-indigo-500/40 rounded-sm rotate-45" />
                        </div>
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full mb-4 md:mb-6 inline-block italic">
                            {tpl.tag}
                        </span>
                        <h3 className="text-lg md:text-xl font-black italic uppercase mb-2 md:mb-4 group-hover:text-indigo-400 transition-colors leading-tight">{tpl.name}</h3>
                        <p className="text-slate-500 text-[9px] md:text-[10px] leading-relaxed font-bold uppercase tracking-tighter">{tpl.desc}</p>
                      </div>
                      <div className="pt-4 md:pt-6 border-t border-white/5 flex justify-between items-center">
                         <span className="text-[8px] md:text-[9px] font-black uppercase text-white/20 group-hover:text-white transition-colors tracking-widest">Select Style</span>
                         <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-all text-xs">→</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* --- HIGH-END MINIMALIST LOADING SCREEN --- */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-screen w-full z-50 text-center px-6"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 mb-12 md:mb-16">
                <motion.div 
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0], borderRadius: ["20px", "40px", "20px"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full border-2 border-indigo-500 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]"
                >
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-indigo-500 rounded-lg animate-pulse" />
                </motion.div>
                <div className="absolute inset-0 border border-white/5 rounded-3xl scale-125 opacity-30" />
            </div>

            <div className="space-y-8 md:space-y-10">
                <motion.h2 
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white"
                >
                    {status}
                </motion.h2>
                
                <div className="max-w-xs md:max-w-sm mx-auto p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[24px] md:rounded-[32px] backdrop-blur-3xl">
                   <AnimatePresence mode="wait">
                       <motion.p 
                        key={tipIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-slate-400 text-[10px] md:text-xs font-medium italic leading-relaxed"
                       >
                           {proTips[tipIndex]}
                       </motion.p>
                   </AnimatePresence>
                </div>
                
                <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.5em] md:tracking-[0.6em] animate-pulse">Establishing Session Data</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default TemplateSelector;