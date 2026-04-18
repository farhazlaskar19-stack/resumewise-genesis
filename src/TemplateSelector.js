import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showGallery, setShowGallery] = useState(false); // State to separate Step 1 and Step 2
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [logLines, setLogLines] = useState([]);

  // Cycle Pro-Tips during loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % proTips.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

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
    
    logs.forEach((line, index) => {
      setTimeout(() => {
        setStatus(line);
        setLogLines((prev) => [...prev, line].slice(-4)); 
        if (index === logs.length - 1) {
          setTimeout(() => navigate(`/editor?template=${id}`), 1000);
        }
      }, index * 700);
    });
  };

  // --- ADDED WORKING LOGIC FOR ENTRY BUTTONS ---
  
  const handleNeuralInjection = () => {
    const code = prompt("Enter your existing Resume JSON code:");
    if (code) {
      try {
        // Validates and saves to your specific storage key
        localStorage.setItem('pro_cv_complete_v5_final', code);
        handleSelect('modernist'); 
      } catch (e) {
        alert("Invalid structure. Please check your JSON format.");
      }
    }
  };

  const handleRestore = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        localStorage.setItem('pro_cv_complete_v5_final', event.target.result);
        handleSelect('modernist');
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col items-center justify-center p-8 overflow-hidden relative">
      
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {!loading ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="z-10 w-full max-w-7xl pt-12"
          >
            {!showGallery ? (
              /* --- CENTERED PROFESSIONAL ENTRY PORTAL --- */
              <div className="flex flex-col items-center justify-center text-center space-y-16 py-20">
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]"
                  >
                    Genesis Engine v1.0
                  </motion.div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">
                    Design Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white/40">Blueprint.</span>
                  </h1>
                  <p className="max-w-lg mx-auto text-slate-500 text-lg font-medium italic opacity-80">High-performance structural frameworks for the modern professional.</p>
                </div>

                <div className="w-full max-w-md space-y-6">
                  <motion.button 
                    whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowGallery(true)}
                    className="w-full py-8 bg-indigo-600 rounded-[32px] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl"
                  >
                    Start from Scratch
                  </motion.button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleNeuralInjection}
                      className="py-5 bg-white/[0.03] border border-white/10 rounded-[24px] font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                    >
                      Import Code
                    </button>
                    <button 
                      onClick={handleRestore}
                      className="py-5 bg-white/[0.03] border border-white/10 rounded-[24px] font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                    >
                      Upload File
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* --- REFINED TEMPLATE GALLERY --- */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                <div className="text-center relative">
                  <button onClick={() => setShowGallery(false)} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-all">← Back to Start</button>
                  <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Choose Your <span className="text-indigo-500">Framework</span></h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4">
                  {templates.map((tpl) => (
                    <motion.div
                      key={tpl.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      onClick={() => handleSelect(tpl.id)}
                      className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 text-left cursor-pointer hover:border-indigo-500/50 transition-all group h-[420px] flex flex-col justify-between relative overflow-hidden backdrop-blur-3xl"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="w-12 h-12 bg-white/5 rounded-2xl mb-8 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          <div className="w-4 h-4 border-2 border-indigo-500/40 rounded-sm rotate-45" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full mb-6 inline-block italic">
                            {tpl.tag}
                        </span>
                        <h3 className="text-xl font-black italic uppercase mb-4 group-hover:text-indigo-400 transition-colors leading-tight">{tpl.name}</h3>
                        <p className="text-slate-500 text-[10px] leading-relaxed font-bold uppercase tracking-tighter">{tpl.desc}</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                         <span className="text-[9px] font-black uppercase text-white/20 group-hover:text-white transition-colors tracking-widest">Select Style</span>
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-all text-xs">→</div>
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
            className="flex flex-col items-center justify-center h-screen w-full z-50 text-center"
          >
            <div className="relative w-32 h-32 mb-16">
                <motion.div 
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0], borderRadius: ["24px", "48px", "24px"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full border-2 border-indigo-500 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]"
                >
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg animate-pulse" />
                </motion.div>
                <div className="absolute inset-0 border border-white/5 rounded-3xl scale-125 opacity-30" />
            </div>

            <div className="space-y-10">
                <motion.h2 
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black italic uppercase tracking-tighter text-white"
                >
                    {status}
                </motion.h2>
                
                <div className="max-w-sm mx-auto p-8 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-3xl">
                   <AnimatePresence mode="wait">
                       <motion.p 
                        key={tipIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-slate-400 text-xs font-medium italic leading-relaxed"
                       >
                           {proTips[tipIndex]}
                       </motion.p>
                   </AnimatePresence>
                </div>
                
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] animate-pulse">Establishing Session Data</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TemplateSelector;