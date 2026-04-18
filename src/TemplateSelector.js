import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const templates = [
  { id: 'modernist', name: 'The Modernist', color: 'indigo', tag: 'Most Popular', desc: 'Sleek, high-contrast layout for tech professionals.' },
  { id: 'executive', name: 'Executive Elite', color: 'blue', tag: 'Traditional', desc: 'Clean, authoritative structure for leadership roles.' },
  { id: 'creative', name: 'Visual Creative', color: 'purple', tag: 'Design-First', desc: 'Bold use of whitespace and typography for artists.' },
  { id: 'minimalist', name: 'Paper Minimal', color: 'emerald', tag: 'ATS Optimized', desc: 'Pure focus on content. Maximum bot readability.' }
];

const proTips = [
  "Did you know? Recruiters spend an average of 6 seconds on your first scan.",
  "Pro-Tip: Use action verbs like 'Architected' or 'Spearheaded' to increase impact.",
  "Tip: Modern ATS systems prefer clean, single-column layouts for high accuracy.",
  "Technical Insight: Vector-based PDFs preserve visual fidelity across all devices."
];

function TemplateSelector() {
  const navigate = useNavigate();
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
    const logs = [
      "> Initializing Vector Engine V9...",
      "> Structuring ATS Semantic Metadata...",
      "> Optimizing PDF Grid Coordinates...",
      "> Injecting Visual Hierarchy...",
      "> Finalizing Encryption Handshake...",
      "> System Ready."
    ];
    
    logs.forEach((line, index) => {
      setTimeout(() => {
        setStatus(line);
        setLogLines((prev) => [...prev, line].slice(-4)); // Keep last 4 lines
        if (index === logs.length - 1) {
          setTimeout(() => navigate(`/editor?template=${id}`), 1000);
        }
      }, index * 700);
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col items-center justify-start p-8 overflow-hidden relative">
      
      {/* BACKGROUND PARTICLE FIELD (Activated on Loading) */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.4 }} 
            className="fixed inset-0 pointer-events-none z-0"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -10, x: Math.random() * window.innerWidth }}
                animate={{ y: window.innerHeight + 10 }}
                transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, ease: "linear" }}
                className="absolute w-1 h-1 bg-white rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {!loading ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="z-10 w-full max-w-7xl pt-12"
          >
            {/* --- INITIALIZATION PROTOCOLS --- */}
            <div className="mb-20 text-center">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-4">Initialization Protocol</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div onClick={() => handleSelect('executive')} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.05] transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl mb-6 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">➕</div>
                        <h4 className="text-sm font-black uppercase italic tracking-tighter">Clean Slate</h4>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Manual Construction</p>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.05] transition-all cursor-pointer group relative overflow-hidden">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl mb-6 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{"{ }"}</div>
                        <h4 className="text-sm font-black uppercase italic tracking-tighter">Neural Injection</h4>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Paste JSON Code</p>
                        <div className="absolute top-2 right-4 text-[8px] font-black text-emerald-500 animate-pulse uppercase">Advanced</div>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-white/[0.05] transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-2xl mb-6 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💾</div>
                        <h4 className="text-sm font-black uppercase italic tracking-tighter">Legacy Recovery</h4>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">Upload Backup File</p>
                    </div>
                </div>
            </div>

            {/* --- TEMPLATE GRID --- */}
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
                    Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Blueprints</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium italic opacity-50">Choose a framework to wrap your data.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              {templates.map((tpl) => (
                <motion.div
                  key={tpl.id}
                  whileHover={{ y: -10 }}
                  onClick={() => handleSelect(tpl.id)}
                  className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 text-left cursor-pointer hover:border-indigo-500/50 transition-all group relative overflow-hidden h-[380px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full mb-6 inline-block italic">
                        {tpl.tag}
                    </span>
                    <h3 className="text-2xl font-black italic uppercase mb-4 group-hover:text-indigo-400 transition-colors">{tpl.name}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-bold uppercase">{tpl.desc}</p>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-4 h-1 bg-white/10 rounded-full group-hover:bg-indigo-500/50" />)}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black group-hover:bg-indigo-600 transition-all">→</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* --- CYBERNETIC HUD LOADING SCREEN --- */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-screen w-full z-50 px-6"
          >
            <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Hexagon Grid Animation */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {/* Scanner Line */}
                <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent z-10 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                />

                <div className="relative z-20 flex flex-col items-center">
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-4"
                    >
                        💠
                    </motion.div>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">Initializing</p>
                </div>

                {/* LOG TERMINAL SIDEBAR */}
                <div className="absolute left-full ml-12 hidden lg:block w-64 border-l border-white/10 pl-6 h-32 flex flex-col justify-center">
                   {logLines.map((line, i) => (
                       <motion.p 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-[9px] font-mono text-emerald-500/70 mb-1"
                       >
                           {line}
                       </motion.p>
                   ))}
                </div>
            </div>

            <div className="mt-20 text-center max-w-lg">
                <motion.h2 
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-black italic uppercase tracking-tighter mb-8 h-8"
                >
                    {status}
                </motion.h2>
                
                {/* PRO TIP CAROUSEL */}
                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] backdrop-blur-3xl min-h-[100px] flex items-center justify-center">
                   <AnimatePresence mode="wait">
                       <motion.p 
                        key={tipIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="text-slate-400 text-sm font-medium italic leading-relaxed"
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
  );
}

export default TemplateSelector;