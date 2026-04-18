import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- ELITE COMPONENTS ---

// FIXED: Text-Based Architect Logo (Moved to top to prevent double-declaration error)
const LogoArchitect = ({ onClick }) => (
  <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
    <div className="relative w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:rotate-[360deg] transition-transform duration-700">
      <div className="w-5 h-5 border-2 border-white/90 rounded-sm rotate-45 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      </div>
    </div>
    <div className="flex flex-col text-left">
      <span className="text-lg md:text-xl font-black italic tracking-tighter leading-none text-white uppercase group-hover:text-indigo-400 transition-colors">
        Resume<span className="text-indigo-500 group-hover:text-white transition-colors">Wise</span>
      </span>
      <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.5em] text-slate-500 group-hover:text-slate-300 transition-colors">Genesis Core V1.0</span>
    </div>
  </div>
);

const GlassWidget = ({ icon, label, sub, color, className }) => (
  <motion.div 
    initial={{ x: 30, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.8, duration: 0.8 }}
    className={`absolute z-30 p-3 md:p-5 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[24px] flex items-center gap-3 md:gap-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group hover:border-${color}-500/50 transition-all ${className}`}
  >
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-xl md:text-2xl bg-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform shadow-inner`}>
      {icon}
    </div>
    <div className="hidden sm:block text-left">
      <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-white/90">{label}</p>
      <p className="text-[7px] md:text-[9px] font-bold text-white/30 uppercase mt-0.5">{sub}</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 md:p-10 bg-white/[0.02] border border-white/10 rounded-[40px] hover:bg-white/[0.05] transition-all group relative overflow-hidden text-left"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 border border-white/5 shadow-xl group-hover:shadow-indigo-500/20 transition-all text-3xl">
      {icon}
    </div>
    <h4 className="text-2xl font-black mb-4 italic uppercase tracking-tighter text-white/90">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6 md:py-8">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left group focus:outline-none">
        <span className={`text-lg md:text-xl font-bold transition-all ${isOpen ? 'text-indigo-400' : 'text-white/70 group-hover:text-white'}`}>{question}</span>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${isOpen ? 'rotate-180 bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/40' : ''}`}>
           <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="mt-4 md:mt-6 text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl text-left">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function LandingPage() {
  const navigate = useNavigate();
  const templateRef = useRef(null);
  const logicRef = useRef(null);
  const faqRef = useRef(null);
  const workflowRef = useRef(null);
  const teamRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Responsive Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const templates = [
    { id: 'modernist', name: 'Modernist', desc: 'Clean, bold, and high-impact.' },
    { id: 'executive', name: 'Executive', desc: 'The gold standard for leadership.' },
    { id: 'creative', name: 'Creative', desc: 'Designed to stand out in a crowd.' },
    { id: 'simple', name: 'Simple', desc: 'Elegant minimalism at its best.' },
    { id: 'astraea', name: 'Astraea', desc: 'Our most advanced visual grid.' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* --- ENHANCED BACKGROUND GRAPHICS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/15 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[160px]" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* --- NAV BAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-[1000] px-6 md:px-12 py-4 md:py-6 flex justify-between items-center transition-all duration-500 border-b ${scrolled ? 'bg-[#020617]/80 backdrop-blur-2xl border-white/10 shadow-2xl py-3 md:py-4' : 'bg-transparent border-transparent'}`}>
        <LogoArchitect onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
        
        <div className="hidden lg:flex gap-8 xl:gap-12">
          <button onClick={() => scrollToSection(workflowRef)} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Workflow</button>
          <button onClick={() => scrollToSection(templateRef)} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Templates</button>
          <button onClick={() => scrollToSection(teamRef)} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Team</button>
          <button onClick={() => scrollToSection(logicRef)} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Technology</button>
          <button onClick={() => scrollToSection(faqRef)} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">FAQ</button>
        </div>

        <div className="flex items-center gap-4">
           <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/select')} 
            className="px-5 md:px-8 py-2.5 md:py-3.5 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shadow-xl"
           >
             Create CV
           </motion.button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 md:pt-48 pb-20 md:pb-40 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24">
        
        <div className="flex-1 space-y-8 md:space-y-12 text-center lg:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">✨ Intelligent Career Architect</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-[100px] font-black tracking-tighter leading-[0.9] md:leading-[0.85] uppercase italic"
          >
            Command <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-blue-400">Attention.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-xl text-slate-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            Professional CV generation powered by advanced visual hierarchy. Designed to bridge the gap between your skills and your next big opportunity.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4 justify-center lg:justify-start">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(99,102,241,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/select')}
              className="group relative px-10 md:px-14 py-5 md:py-7 bg-indigo-600 rounded-[24px] overflow-hidden shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 font-black text-xs md:text-sm uppercase tracking-[0.3em] group-hover:text-black transition-colors text-white">Generate CV Now →</span>
            </motion.button>
            <button onClick={() => scrollToSection(templateRef)} className="px-8 md:px-12 py-5 md:py-7 bg-white/5 border border-white/10 rounded-[24px] font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:bg-white/10 transition-all focus:outline-none">View Styles</button>
          </div>
        </div>

        {/* Right Side Mockup */}
        <div className="flex-1 relative w-full h-[400px] md:h-[650px] flex items-center justify-center">
           <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/10 blur-[100px] md:blur-[120px] rounded-full" />
           <motion.div 
             initial={{ rotateY: -20, rotateX: 10, opacity: 0 }}
             animate={{ rotateY: 0, rotateX: 0, opacity: 1 }}
             transition={{ duration: 1.2 }}
             className="relative z-20 w-[260px] md:w-[360px] h-[380px] md:h-[500px] bg-slate-800 rounded-[40px] md:rounded-[48px] border border-white/20 shadow-2xl overflow-hidden p-3"
           >
              <div className="w-full h-full bg-white rounded-[32px] md:rounded-[38px] p-6 md:p-8 flex flex-col text-slate-800 relative shadow-inner">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 border-2 border-indigo-100" />
                    <div className="text-left">
                       <div className="w-24 md:w-32 h-2.5 md:h-3 bg-indigo-600 rounded-full mb-2" />
                       <div className="w-16 md:w-20 h-2 bg-slate-300 rounded-full" />
                    </div>
                 </div>
                 <div className="space-y-3 opacity-60">
                    <div className="w-full h-1.5 md:h-2 bg-slate-200 rounded-full" />
                    <div className="w-full h-1.5 md:h-2 bg-slate-200 rounded-full" />
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="w-20 md:w-24 h-2 bg-indigo-400 rounded-full mb-4" />
                    <div className="space-y-4">
                       {[1, 2].map(i => (
                         <div key={i} className="flex gap-3 items-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                            <div className="w-full h-1 bg-slate-100 rounded-full" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </motion.div>
           <GlassWidget icon="🎯" label="ATS Friendly" sub="Safe" color="emerald" className="-top-5 -right-2 md:top-10 md:-right-12 scale-75 md:scale-100" />
           <GlassWidget icon="🛡️" label="Secure" sub="Privacy" color="blue" className="bottom-0 left-0 md:top-1/2 md:left-1/2 md:translate-x-32 scale-75 md:scale-100" />
        </div>
      </section>

      {/* --- WORKFLOW --- */}
      <section ref={workflowRef} className="py-20 md:py-40 px-6 md:px-12 bg-indigo-600/[0.02]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-16 md:mb-24">The <span className="text-indigo-500">Workflow</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left relative overflow-hidden">
               <span className="absolute top-4 right-8 text-6xl md:text-8xl font-black opacity-5 italic">01</span>
               <div className="w-12 h-12 bg-indigo-500 rounded-xl mb-6 flex items-center justify-center font-bold">✎</div>
               <h4 className="text-2xl font-black uppercase mb-4">Input Data</h4>
               <p className="text-slate-400 font-medium text-sm md:text-base">Simple, guided forms to enter your education, experience, and key skills.</p>
            </div>
            <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left relative overflow-hidden">
               <span className="absolute top-4 right-8 text-6xl md:text-8xl font-black opacity-5 italic">02</span>
               <div className="w-12 h-12 bg-emerald-500 rounded-xl mb-6 flex items-center justify-center font-bold">✨</div>
               <h4 className="text-2xl font-black uppercase mb-4">Select Style</h4>
               <p className="text-slate-400 font-medium text-sm md:text-base">Choose from a library of professional templates tested for readability.</p>
            </div>
            <div className="p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left relative overflow-hidden">
               <span className="absolute top-4 right-8 text-6xl md:text-8xl font-black opacity-5 italic">03</span>
               <div className="w-12 h-12 bg-blue-500 rounded-xl mb-6 flex items-center justify-center font-bold">⬇</div>
               <h4 className="text-2xl font-black uppercase mb-4">Instant PDF</h4>
               <p className="text-slate-400 font-medium text-sm md:text-base">Download your high-resolution, print-ready document in one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SPECS --- */}
      <section ref={logicRef} className="py-20 md:py-40 px-6 md:px-12 bg-white/[0.01] border-y border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight mb-16 md:mb-24 text-white">System Engineering</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                <FeatureCard title="Dynamic UI" icon="⚛️" desc="Built with a modular architecture that updates your document preview in real-time as you type." />
                <FeatureCard title="Vector Scaling" icon="📐" desc="Uses mathematical coordinate systems to ensure text remains perfectly sharp on any screen or printer." />
                <FeatureCard title="Eye Tracking" icon="👁️" desc="Layouts optimized based on how recruiters read documents, ensuring your best points are seen first." />
            </div>
        </div>
      </section>

      {/* --- TEMPLATES SECTION --- */}
      <section ref={templateRef} className="py-20 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">Design <span className="text-indigo-500">Blueprints</span></h2>
          <p className="text-slate-500 font-medium italic">Select a framework to begin your career journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
            {templates.map((tpl) => (
              <motion.div 
                key={tpl.id}
                whileHover={{ scale: 1.02 }} 
                className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] group flex flex-col justify-between h-[300px] md:h-[320px] transition-all hover:border-indigo-500/50"
              >
                <div className="text-left">
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white/90 group-hover:text-indigo-400 transition-colors mb-2">{tpl.name}</h3>
                  <p className="text-slate-500 text-sm font-medium">{tpl.desc}</p>
                </div>
                <button onClick={() => navigate('/select')} className="w-full py-4 bg-white/5 group-hover:bg-indigo-600 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shadow-xl text-white">Start Building</button>
              </motion.div>
            ))}
        </div>
      </section>

      {/* --- TEAM SECTION (Explicit Expansion to preserve length) --- */}
      <section ref={teamRef} className="py-20 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24 md:mb-32 relative">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter opacity-10 absolute inset-0 -top-6 md:-top-10 select-none">ENGINEERING</h2>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 relative z-10">Core <span className="text-indigo-500">Architects</span></h2>
          <div className="w-16 md:w-24 h-1 bg-indigo-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.5em]">The Genesis Core Team</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Member 1 */}
          <motion.div whileHover={{ y: -15 }} className="p-1 bg-gradient-to-b from-indigo-500/30 to-transparent rounded-[48px]">
            <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-[46px] h-full border border-white/5 relative group overflow-hidden text-left">
              <div className="absolute top-6 right-8 bg-indigo-600 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full z-10">Lead</div>
              <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10 relative">
                 <img src="/farhaz.jpg" alt="Farhaz" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">Farhaz Hussain Laskar</h4>
              <p className="text-indigo-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1 mb-4">Lead Systems Architect</p>
              <div className="w-8 h-0.5 bg-indigo-500/50 mb-4 transition-all group-hover:w-full" />
              <p className="text-slate-400 text-xs font-medium leading-relaxed">Developed the Engine Core V1.0, state synchronization logic, and high-fidelity vector export protocols.</p>
            </div>
          </motion.div>

          {/* Member 2 */}
          <motion.div whileHover={{ y: -15 }} className="p-8 bg-white/[0.02] border border-white/5 rounded-[48px] group hover:bg-white/[0.04] transition-all text-left">
            <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10"><img src="/member2.jpg" alt="Member" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" /></div>
            <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">Amcharul Islam Talukder</h4>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1 mb-4">UI/UX Interaction</p>
            <div className="w-8 h-0.5 bg-white/10 mb-4 transition-all group-hover:w-full" />
            <p className="text-slate-500 text-xs font-medium leading-relaxed">Architected the glassmorphism design system and optimized visual blueprint consistency across devices.</p>
          </motion.div>

          {/* Member 3 */}
          <motion.div whileHover={{ y: -15 }} className="p-8 bg-white/[0.02] border border-white/5 rounded-[48px] group hover:bg-white/[0.04] transition-all text-left">
            <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10"><img src="/member3.jpg" alt="Member" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" /></div>
            <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">Arshad MD. Ansar Barbhuiya</h4>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1 mb-4">QA & Schema Analyst</p>
            <div className="w-8 h-0.5 bg-white/10 mb-4 transition-all group-hover:w-full" />
            <p className="text-slate-500 text-xs font-medium leading-relaxed">Conducted deep-level JSON schema validation and ATS readability benchmarking for global compliance.</p>
          </motion.div>

          {/* Member 4 */}
          <motion.div whileHover={{ y: -15 }} className="p-8 bg-white/[0.02] border border-white/5 rounded-[48px] group hover:bg-white/[0.04] transition-all text-left">
            <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10"><img src="/member4.jpg" alt="Member" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" /></div>
            <h4 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">Rokibul Islam Mazumder</h4>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1 mb-4">Integration Manager</p>
            <div className="w-8 h-0.5 bg-white/10 mb-4 transition-all group-hover:w-full" />
            <p className="text-slate-500 text-xs font-medium leading-relaxed">Modularized component libraries and orchestrated high-performance system animations for the engine.</p>
          </motion.div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section ref={faqRef} className="py-20 md:py-40 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black italic uppercase text-center mb-16 md:mb-24 tracking-tighter">Information <span className="text-indigo-500">Center</span></h2>
        <div className="bg-white/[0.02] border border-white/10 rounded-[30px] md:rounded-[50px] p-8 md:p-12 backdrop-blur-3xl shadow-2xl">
          <FAQItem question="What is an ATS and why does it matter?" answer="ATS stands for Applicant Tracking System. Most big companies use software to scan your CV. Our engine ensures your data is structured so these systems can read it perfectly." />
          <FAQItem question="Do I need to be a designer to use this?" answer="Not at all. The platform handles all white space, alignment, and font styling. You simply provide the content, and we provide the professional polish." />
          <FAQItem question="Where is my information stored?" answer="We prioritize your privacy. All your data is stored locally within your browser's memory. No sensitive information is sent to external servers." />
          <FAQItem question="Can I customize the colors of my CV?" answer="Yes. While our templates follow standard professional rules, you have control over primary themes to match your personal brand or industry." />
          <FAQItem question="What file format is the final document?" answer="The export is a high-fidelity Vector PDF. This is the industry standard format as it preserves layout across all devices and software." />
          <FAQItem question="How many CVs can I create?" answer="There is no limit. You can create multiple versions of your resume tailored for different job applications and save them all locally." />
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-20 md:py-40 px-6 md:px-12 text-center">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] md:rounded-[60px] p-12 md:p-24 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
           <h2 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 md:mb-12 leading-none">Ready to Stand Out?</h2>
           <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/select')} 
            className="px-12 md:px-24 py-6 md:py-9 bg-white text-black hover:bg-black hover:text-white rounded-[24px] md:rounded-[32px] font-black text-xs md:text-sm uppercase tracking-[0.4em] transition-all shadow-xl"
           >
             Launch Engine
           </motion.button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="px-6 md:px-12 py-20 md:py-32 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20">
          <div className="lg:col-span-2 space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
            <LogoArchitect onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
            <p className="text-slate-500 max-w-sm text-base md:text-lg font-medium leading-relaxed italic">Developing precision tools for the modern digital era. Academic Project Submission.</p>
          </div>
          <div className="text-center md:text-left">
            <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-indigo-400 mb-8 md:mb-10">Direct Links</h5>
            <ul className="space-y-4 md:space-y-6 text-slate-400 text-xs md:text-sm font-black uppercase tracking-widest">
              <li onClick={() => navigate('/select')} className="hover:text-white cursor-pointer transition-all">Resume Builder</li>
              <li onClick={() => scrollToSection(templateRef)} className="hover:text-white cursor-pointer transition-all">Templates</li>
              <li onClick={() => scrollToSection(teamRef)} className="hover:text-white cursor-pointer transition-all">Our Team</li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-indigo-400 mb-8 md:mb-10">Project Data</h5>
            <p className="text-slate-500 font-black uppercase text-[10px] leading-loose">Build: Genesis Core V1.0 <br />Submission: Final 2026</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 font-black uppercase text-[8px] tracking-[0.6em] md:tracking-[0.8em]">
            <span>© 2026 ResumeWise Intelligent Systems</span>
            <span className="italic underline underline-offset-4 decoration-indigo-500/50">Designed for Excellence</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;