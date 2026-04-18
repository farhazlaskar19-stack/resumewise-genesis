import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- ELITE COMPONENTS ---

const GlassWidget = ({ icon, label, sub, color, className }) => (
  <motion.div 
    initial={{ x: 30, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.8, duration: 0.8 }}
    className={`absolute z-30 p-5 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[24px] flex items-center gap-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group hover:border-${color}-500/50 transition-all ${className}`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest text-white/90">{label}</p>
      <p className="text-[9px] font-bold text-white/30 uppercase mt-0.5">{sub}</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] hover:bg-white/[0.05] transition-all group relative overflow-hidden"
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
    <div className="border-b border-white/5 py-8">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left group focus:outline-none">
        <span className={`text-xl font-bold transition-all ${isOpen ? 'text-indigo-400' : 'text-white/70 group-hover:text-white'}`}>{question}</span>
        <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${isOpen ? 'rotate-180 bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/40' : ''}`}>
           <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-3xl">{answer}</p>
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
  const teamRef = useRef(null); // Added for Team section

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
      <nav className="fixed top-0 left-0 w-full z-[1000] px-12 py-6 flex justify-between items-center bg-[#020617]/50 backdrop-blur-2xl border-b border-white/5">
        
        {/* LOGO CONTAINER: PROFESSIONAL BLENDING */}
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="ResumeWise Logo" 
            className="h-12 w-auto object-contain transition-transform hover:scale-105"
            style={{ 
              aspectRatio: '864/267',
              mixBlendMode: 'screen', // Removes dark backgrounds perfectly
              filter: "brightness(1.2) contrast(1.1)"
            }}
          />
        </div>
        
        <div className="hidden lg:flex gap-12">
          <button onClick={() => scrollToSection(workflowRef)} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Workflow</button>
          <button onClick={() => scrollToSection(templateRef)} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Templates</button>
          <button onClick={() => scrollToSection(teamRef)} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Team</button>
          <button onClick={() => scrollToSection(logicRef)} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">Technology</button>
          <button onClick={() => scrollToSection(faqRef)} className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-indigo-400 transition-all focus:outline-none">FAQ</button>
        </div>

        <div className="flex items-center gap-8">
           <button onClick={() => navigate('/select')} className="px-8 py-3.5 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">Create Your CV</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-40 px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
        
        <div className="flex-1 space-y-12 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">✨ Intelligent Career Architect</span>
          </div>

          <h1 className="text-7xl md:text-[100px] font-black tracking-tighter leading-[0.85] uppercase italic">
            Command <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-blue-400">Attention.</span>
          </h1>

          <p className="max-w-xl text-slate-400 text-xl font-medium leading-relaxed">
            Professional CV generation powered by advanced visual hierarchy. Designed to bridge the gap between your skills and your next big opportunity.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center lg:justify-start">
            <button 
              onClick={() => navigate('/select')}
              className="group relative px-14 py-7 bg-indigo-600 rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(99,102,241,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 font-black text-sm uppercase tracking-[0.3em] group-hover:text-black transition-colors">Generate CV Now →</span>
            </button>
            <button onClick={() => scrollToSection(templateRef)} className="px-12 py-7 bg-white/5 border border-white/10 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] hover:bg-white/10 transition-all focus:outline-none">View Styles</button>
          </div>
        </div>

        {/* Right Side: Populated Product Mockup */}
        <div className="flex-1 relative w-full h-[650px] flex items-center justify-center">
           <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
           
           <motion.div 
             initial={{ rotateY: -20, rotateX: 10, opacity: 0 }}
             animate={{ rotateY: 0, rotateX: 0, opacity: 1 }}
             transition={{ duration: 1.2 }}
             className="relative z-20 w-[360px] h-[500px] bg-slate-800 rounded-[48px] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden p-3"
           >
              <div className="w-full h-full bg-white rounded-[38px] p-8 flex flex-col text-slate-800 relative shadow-inner">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-indigo-100" />
                    <div>
                       <div className="w-32 h-3 bg-indigo-600 rounded-full mb-2" />
                       <div className="w-20 h-2 bg-slate-300 rounded-full" />
                    </div>
                 </div>
                 <div className="space-y-3 opacity-60">
                    <div className="w-full h-2 bg-slate-200 rounded-full" />
                    <div className="w-full h-2 bg-slate-200 rounded-full" />
                    <div className="w-3/4 h-2 bg-slate-200 rounded-full" />
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="w-24 h-2 bg-indigo-400 rounded-full mb-4" />
                    <div className="space-y-4">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="flex gap-3 items-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                            <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="absolute bottom-10 left-8 right-8 p-4 bg-indigo-600/5 rounded-2xl border border-indigo-500/10">
                    <div className="w-24 h-2 bg-indigo-500/40 rounded-full mb-2" />
                    <div className="w-full h-1.5 bg-indigo-500/20 rounded-full" />
                 </div>
              </div>
           </motion.div>

           <GlassWidget icon="🎯" label="ATS Compatible" sub="Algorithm Ready" color="emerald" className="top-10 -right-4 lg:-right-12" />
           <GlassWidget icon="🛡️" label="Secure Export" sub="Privacy First" color="blue" className="top-1/2 left-1/2 translate-x-20 -translate-y-40 lg:translate-x-32" />
        </div>
      </section>

      {/* --- NEW SECTION: THE WORKFLOW --- */}
      <section ref={workflowRef} className="py-40 px-12 bg-indigo-600/[0.02]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-24">The <span className="text-indigo-500">Workflow</span></h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left relative overflow-hidden">
               <span className="absolute top-4 right-8 text-8xl font-black opacity-5 italic">01</span>
               <div className="w-12 h-12 bg-indigo-500 rounded-xl mb-6 flex items-center justify-center font-bold">✎</div>
               <h4 className="text-2xl font-black uppercase mb-4">Input Data</h4>
               <p className="text-slate-400 font-medium">Simple, guided forms to enter your education, experience, and key skills.</p>
            </div>
            <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left relative overflow-hidden">
               <span className="absolute top-4 right-8 text-8xl font-black opacity-5 italic">02</span>
               <div className="w-12 h-12 bg-emerald-500 rounded-xl mb-6 flex items-center justify-center font-bold">✨</div>
               <h4 className="text-2xl font-black uppercase mb-4">Select Style</h4>
               <p className="text-slate-400 font-medium">Choose from a library of professional templates tested for readability.</p>
            </div>
            <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[40px] text-left relative overflow-hidden">
               <span className="absolute top-4 right-8 text-8xl font-black opacity-5 italic">03</span>
               <div className="w-12 h-12 bg-blue-500 rounded-xl mb-6 flex items-center justify-center font-bold">⬇</div>
               <h4 className="text-2xl font-black uppercase mb-4">Instant PDF</h4>
               <p className="text-slate-400 font-medium">Download your high-resolution, print-ready document in one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SPECS GRID --- */}
      <section ref={logicRef} className="py-40 px-12 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tight">System Engineering</h2>
            <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.5em]">Developed for Performance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard title="Dynamic UI" icon="⚛️" desc="Built with a modular architecture that updates your document preview in real-time as you type." />
            <FeatureCard title="Vector Scaling" icon="📐" desc="Uses mathematical coordinate systems to ensure text remains perfectly sharp on any screen or printer." />
            <FeatureCard title="Eye Tracking" icon="👁️" desc="Layouts optimized based on how recruiters read documents, ensuring your best points are seen first." />
          </div>
        </div>
      </section>

      {/* --- TEMPLATE GALLERY --- */}
      <section ref={templateRef} className="py-40 px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Design <span className="text-indigo-500">Blueprints</span></h2>
          <p className="text-slate-500 font-medium italic">Select a professional framework to begin your career journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <motion.div 
              key={tpl.id}
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] group flex flex-col justify-between h-[320px] transition-all hover:border-indigo-500/50"
            >
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white/90 group-hover:text-indigo-400 transition-colors mb-2">{tpl.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{tpl.desc}</p>
              </div>
              <button 
                onClick={() => navigate('/select')}
                className="w-full py-4 bg-white/5 group-hover:bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl"
              >
                Start with this Style
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- TEAM SECTION: CORE ARCHITECTS --- */}
      <section ref={teamRef} className="py-40 px-12 max-w-7xl mx-auto">
        <div className="text-center mb-32 relative">
          <h2 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter opacity-10 absolute inset-0 -top-10 select-none">ENGINEERING</h2>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 relative z-10">
            Core <span className="text-indigo-500">Architects</span>
          </h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full mb-6" />
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em]">The Genesis Core Team</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* FARHAZ - LEAD SYSTEMS ARCHITECT */}
          <motion.div 
            whileHover={{ y: -15 }} 
            className="p-1 bg-gradient-to-b from-indigo-500/30 to-transparent rounded-[48px]"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-[46px] h-full border border-white/5 relative group overflow-hidden">
              <div className="absolute top-6 right-8 bg-indigo-600 text-white text-[8px] font-black uppercase px-3 py-1 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10">Lead</div>
              
              <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10 relative">
                 <img src="/farhaz.jpg" alt="Farhaz" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">Farhaz Hussain Laskar</h4>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1 mb-4">Lead Systems Architect</p>
              <div className="w-8 h-0.5 bg-indigo-500/50 mb-4 transition-all group-hover:w-full" />
              <p className="text-slate-400 text-xs leading-relaxed font-medium">Developed the Engine Core V1.0, state synchronization logic, and high-fidelity vector export protocols.</p>
            </div>
          </motion.div>

          {/* TEAMMATE 2 - DESIGN */}
          <motion.div whileHover={{ y: -15 }} className="p-8 bg-white/[0.02] border border-white/5 rounded-[48px] group hover:bg-white/[0.04] transition-all">
            <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10">
               <img src="/member2.jpg" alt="Team Member" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">Amcharul Islam Talukder</h4>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 mb-4">UI/UX Interaction</p>
            <div className="w-8 h-0.5 bg-white/10 mb-4 transition-all group-hover:w-full" />
            <p className="text-slate-500 text-xs leading-relaxed font-medium">Architected the glassmorphism design system and optimized visual blueprint consistency across devices.</p>
          </motion.div>

          {/* TEAMMATE 3 - QA */}
          <motion.div whileHover={{ y: -15 }} className="p-8 bg-white/[0.02] border border-white/5 rounded-[48px] group hover:bg-white/[0.04] transition-all">
            <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10">
               <img src="/member3.jpg" alt="Team Member" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">Arshad MD. Ansar Barbhuiya</h4>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 mb-4">QA & Schema Analyst</p>
            <div className="w-8 h-0.5 bg-white/10 mb-4 transition-all group-hover:w-full" />
            <p className="text-slate-500 text-xs leading-relaxed font-medium">Conducted deep-level JSON schema validation and ATS readability benchmarking for global compliance.</p>
          </motion.div>

          {/* TEAMMATE 4 - INTEGRATION */}
          <motion.div whileHover={{ y: -15 }} className="p-8 bg-white/[0.02] border border-white/5 rounded-[48px] group hover:bg-white/[0.04] transition-all">
            <div className="w-full aspect-square rounded-[36px] overflow-hidden mb-8 border border-white/10">
               <img src="/member4.jpg" alt="Team Member" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">Rokibul Islam Mazumder</h4>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 mb-4">Integration Manager</p>
            <div className="w-8 h-0.5 bg-white/10 mb-4 transition-all group-hover:w-full" />
            <p className="text-slate-500 text-xs leading-relaxed font-medium">Modularized component libraries and orchestrated high-performance system animations for the engine.</p>
          </motion.div>
        </div>
      </section>

      {/* --- EXPANDED FAQ --- */}
      <section ref={faqRef} className="py-40 px-12 max-w-5xl mx-auto">
        <h2 className="text-6xl font-black italic uppercase text-center mb-24 tracking-tighter">Information <span className="text-indigo-500">Center</span></h2>
        <div className="bg-white/[0.02] border border-white/10 rounded-[50px] p-12 backdrop-blur-3xl shadow-2xl">
          <FAQItem question="What is an ATS and why does it matter?" answer="ATS stands for Applicant Tracking System. Most big companies use software to scan your CV. Our engine ensures your data is structured so these systems can read it perfectly." />
          <FAQItem question="Do I need to be a designer to use this?" answer="Not at all. The platform handles all white space, alignment, and font styling. You simply provide the content, and we provide the professional polish." />
          <FAQItem question="Where is my information stored?" answer="We prioritize your privacy. All your data is stored locally within your browser's memory. No sensitive information is sent to external servers." />
          <FAQItem question="Can I customize the colors of my CV?" answer="Yes. While our templates follow standard professional rules, you have control over primary themes to match your personal brand or industry." />
          <FAQItem question="What file format is the final document?" answer="The export is a high-fidelity Vector PDF. This is the industry standard format as it preserves layout across all devices and software." />
          <FAQItem question="How many CVs can I create?" answer="There is no limit. You can create multiple versions of your resume tailored for different job applications and save them all locally." />
        </div>
      </section>

      {/* --- PROJECT CTA --- */}
      <section className="py-40 px-12 text-center">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[60px] p-24 relative overflow-hidden shadow-[0_60px_120px_-20px_rgba(99,102,241,0.4)]">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
           <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-12 leading-none">Ready to Stand Out?</h2>
           <button onClick={() => navigate('/select')} className="px-24 py-9 bg-white text-black hover:bg-black hover:text-white rounded-[32px] font-black text-sm uppercase tracking-[0.5em] transition-all active:scale-95 shadow-2xl">
             Launch CV Builder
           </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="px-12 py-32 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-20">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center">
              <img src="/logo.png" alt="ResumeWise Logo" className="h-10 w-auto opacity-80" style={{ mixBlendMode: 'screen', filter: 'brightness(1.5)' }} />
            </div>
            <p className="text-slate-500 max-w-sm text-lg font-medium leading-relaxed italic">Developing precision tools for the modern digital era. Academic Project Submission.</p>
          </div>
          <div>
            <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-indigo-400 mb-10">Direct Links</h5>
            <ul className="space-y-6 text-slate-400 text-sm font-black uppercase tracking-widest">
              <li onClick={() => navigate('/select')} className="hover:text-white cursor-pointer transition-all">Resume Builder</li>
              <li onClick={() => scrollToSection(templateRef)} className="hover:text-white cursor-pointer transition-all">Templates</li>
              <li onClick={() => scrollToSection(teamRef)} className="hover:text-white cursor-pointer transition-all">Our Team</li>
            </ul>
          </div>
          <div className="text-right">
            <h5 className="font-black uppercase text-[10px] tracking-[0.4em] text-indigo-400 mb-10">Project Data</h5>
            <p className="text-slate-500 font-black uppercase text-xs leading-loose">Build: V9.0 PRO <br />Submission: Final 2026</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-slate-600 font-black uppercase text-[8px] tracking-[0.8em]">
            <span>© 2026 ResumeWise Intelligent Systems</span>
            <span className="hidden md:block italic underline underline-offset-4">Designed for Excellence</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;