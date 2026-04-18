import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ExecutiveTemplate from './temp_folder/ExecutiveTemplate';
import ModernistTemplate from './temp_folder/ModernistTemplate';
import CreativeTemplate from './temp_folder/CreativeTemplate';
import SimpleTemplate from './temp_folder/SimpleTemplate';
import AstraeaTemplate from './temp_folder/AstraeaTemplate';

// --- SUCCESS CHECKMARK COMPONENT ---
const SuccessMark = ({ show }) => (
  <div className={`ml-auto flex items-center justify-center w-5 h-5 rounded-full transition-all duration-500 ${show ? 'bg-emerald-500 scale-100 opacity-100 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-white/5 scale-50 opacity-0'}`}>
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

// --- COMMERCIAL GRADE INPUT ---
const PremiumInput = ({ label, value, required, error, ...props }) => (
  <div className="flex flex-col gap-2 flex-1 min-w-[280px] group">
    <label className="text-[11px] font-bold text-slate-400 tracking-wide ml-1 uppercase">{label}</label>
    <div className={`flex items-center px-4 py-3.5 bg-slate-900/40 border transition-all duration-300 rounded-xl focus-within:bg-slate-800 ${error ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : value ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-white/10'} focus-within:border-indigo-500`}>
      <input 
        {...props} 
        value={value}
        className="bg-transparent border-none outline-none w-full text-[13px] text-white placeholder:text-white/10 font-medium" 
      />
      <SuccessMark show={!!value && !error} />
    </div>
  </div>
);

function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); 
  const [showFinal, setShowFinal] = useState(false);
  const [resumeScore, setResumeScore] = useState(0);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);
  const [errors, setErrors] = useState([]); // This was causing the loop, now handled carefully

  const [template, setTemplate] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('template') || 'executive'; 
  });
  
  const [config, setConfig] = useState({ font: 'Inter', spacing: 1.5, size: 14 });

  const initialData = {
    firstName: '', lastName: '', role: '', email: '', phone: '', address: '', city: '', country: '', postCode: '', photo: null,
    summary: '',
    hardSkills: [{ name: '', level: 50 }],
    experience: [{ company: '', role: '', location: '', startDate: '', endDate: '', isPresent: false, desc: '' }],
    education: [{ school: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '' }],
    languages: [{ name: '', level: 'Native' }],
    socials: [{ title: '', url: '' }], 
    certifications: [{ title: '', issuer: '' }],
    awards: [{ title: '', year: '' }],
    projects: [{ title: '', link: '', desc: '' }], 
    customSections: [{ title: '', content: '' }]
  };

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('pro_cv_complete_v5_final');
    return saved ? JSON.parse(saved) : initialData;
  });

  const loadSampleData = () => {
    const sample = {
      firstName: 'Samantha', lastName: 'Williams', role: 'Senior Product Designer',
      email: 's.williams@design.com', phone: '+1 (555) 0123', address: '123 Innovation Drive',
      city: 'San Francisco', country: 'USA', postCode: '94103', photo: null,
      summary: 'Award-winning Product Designer with over 8 years of experience in creating user-centric digital experiences. Expert in design systems, high-fidelity prototyping, and cross-functional team leadership.',
      hardSkills: [{ name: 'UI/UX Design', level: 95 }, { name: 'React Architecture', level: 85 }, { name: 'Figma Systems', level: 100 }],
      experience: [{ company: 'TechNova Systems', role: 'Lead Designer', location: 'Remote', startDate: '2020', endDate: '', isPresent: true, desc: 'Directed the design overhaul of the flagship SaaS platform, resulting in a 40% increase in user retention.' }],
      education: [{ school: 'Stanford University', degree: 'B.Sc. Digital Design', field: 'Design', location: 'CA', startDate: '2012', endDate: '2016', gpa: '3.9' }],
      languages: [{ name: 'English', level: 'Native' }, { name: 'German', level: 'B2' }],
      socials: [{ title: 'LinkedIn', url: 'linkedin.com/in/samantha' }],
      certifications: [{ title: 'Google UX Design Professional', issuer: 'Coursera' }],
      awards: [{ title: 'Design Excellence 2023', year: '2023' }],
      projects: [{ title: 'EcoTrack App', link: 'github.com/ecotrack', desc: 'A sustainability tracking app built with React Native and Node.js.' }],
      customSections: [{ title: 'Key Competencies', content: 'Design Sprints • User Research • A/B Testing • Stakeholder Management' }]
    };
    setData(sample);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const resetData = () => {
    if(window.confirm("Are you sure you want to clear all data?")) {
      setData(initialData);
      localStorage.removeItem('pro_cv_complete_v5_final');
      setStep(1);
      setErrors([]);
    }
  };

  const steps = [
    { id: 1, label: 'Contacts', desc: 'Add your up-to-date contact information so employers and recruiters can easily reach you.' },
    { id: 2, label: 'Experience', desc: 'Detail your professional journey and key achievements to showcase your impact.' },
    { id: 3, label: 'Education', desc: 'List your academic foundation, degrees, and relevant certifications.' },
    { id: 4, label: 'Skills', desc: 'Highlight your technical expertise and core proficiencies.' },
    { id: 5, label: 'Finalize', desc: 'Add portfolio links, awards, and custom sections to complete your profile.' },
  ];

  // FIX: This now returns a value instead of setting state directly in the render cycle
  const handleNextStep = () => {
    let newErrors = [];
    if (step === 1) {
      if (!data.firstName) newErrors.push('firstName');
      if (!data.lastName) newErrors.push('lastName');
      if (!data.email) newErrors.push('email');
    }
    
    setErrors(newErrors);

    if (newErrors.length === 0) {
       if (step === 5) {
         setShowFinal(true);
       } else {
         setStep(s => s + 1);
       }
    } else {
       alert("Mandatory data required to proceed");
    }
  };

  useEffect(() => {
    let score = 0;
    if (data.firstName) score += 10;
    if (data.photo) score += 10;
    if (data.summary && data.summary.length > 20) score += 10;
    if (data.experience.some(e => e.company)) score += 20;
    if (data.education.some(e => e.school)) score += 20;
    if (data.hardSkills.some(s => s.name)) score += 20;
    if (data.city && data.postCode) score += 10;
    setResumeScore(Math.min(score, 100));
    localStorage.setItem('pro_cv_complete_v5_final', JSON.stringify(data));
  }, [data]);

  const handleBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${data.firstName || 'resume'}.json`;
    link.click();
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setData(JSON.parse(event.target.result));
      reader.readAsText(file);
    }
  };

  const updateList = (section, index, field, value) => {
    const updated = [...data[section]];
    updated[index][field] = value;
    setData({ ...data, [section]: updated });
  };

  const addRow = (section, schema) => setData({ ...data, [section]: [...data[section], schema] });
  const removeRow = (section, index) => {
    if (data[section].length > 1) setData({ ...data, [section]: data[section].filter((_, i) => i !== index) });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { setData({ ...data, photo: event.target.result }); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-[#020617] flex flex-col font-sans overflow-hidden text-white">
      
      <style>{`
        @media print {
          body { background: white !important; margin: 0 !important; }
          body * { visibility: hidden; }
          .printable-resume, .printable-resume * { visibility: visible; }
          .printable-resume { position: fixed !important; left: 0 !important; top: 0 !important; width: 210mm !important; height: 297mm !important; transform: scale(1) !important; border: none !important; box-shadow: none !important; }
          .no-print { display: none !important; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className={`fixed top-6 right-6 z-[200] px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl shadow-emerald-500/20 ${saveStatus ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        ✨ Progress Saved
      </div>

      <button 
        onClick={() => setIsMobilePreview(!isMobilePreview)}
        className="lg:hidden fixed bottom-32 right-6 z-[150] w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
      >
        <span className="text-xl">{isMobilePreview ? '✎' : '👁️'}</span>
      </button>

      <header className={`h-20 bg-slate-900/95 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 z-[100] shrink-0 no-print transition-transform duration-700 ${showFinal ? '-translate-y-full' : 'translate-y-0'}`}>
         <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => navigate('/')} className="text-white/40 hover:text-white transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest mr-2 md:mr-4">← Exit</button>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xs md:text-sm italic shadow-lg">V7</div>
            <h1 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Elite <span className="text-indigo-400">Engine</span></h1>
         </div>
         <div className="flex items-center gap-4 md:gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{resumeScore}% Strength</span>
              <div className="w-20 md:w-32 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{width: `${resumeScore}%`}}></div>
              </div>
            </div>
         </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* LEFT COLUMN: FORM */}
        <div className={`relative flex flex-col h-full transition-all duration-700 no-print 
          ${showFinal ? 'w-0 opacity-0' : 'lg:w-[50%] w-full'} 
          ${isMobilePreview ? 'hidden lg:flex' : 'flex'} border-r border-white/5 bg-[#020617]`}>
          
          <div className="px-6 md:px-12 pt-6 md:pt-10 pb-6 bg-gradient-to-b from-white/[0.02] to-transparent shrink-0">
            <div className="flex items-center justify-between gap-2 md:gap-3 mb-6 md:mb-8">
              {steps.map((s) => (
                <div key={s.id} onClick={() => s.id <= step && setStep(s.id)} className={`flex-1 h-1 md:h-1.5 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-white/5'} cursor-pointer`} />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">{steps[step-1].label}</h2>
            <p className="text-slate-400 text-[11px] md:text-[13px] leading-relaxed max-w-md italic">{steps[step-1].desc}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12 scrollbar-hide space-y-10 md:space-y-12">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <PremiumInput label="First Name" error={errors.includes('firstName')} value={data.firstName} onChange={(e)=>setData({...data, firstName:e.target.value})} />
                  <PremiumInput label="Last Name" error={errors.includes('lastName')} value={data.lastName} onChange={(e)=>setData({...data, lastName:e.target.value})} />
                  <div className="sm:col-span-2"><PremiumInput label="Professional Role" value={data.role} onChange={(e)=>setData({...data, role:e.target.value})} /></div>
                  <PremiumInput label="Phone" value={data.phone} onChange={(e)=>setData({...data, phone:e.target.value})} />
                  <PremiumInput label="Email Address" error={errors.includes('email')} value={data.email} onChange={(e)=>setData({...data, email:e.target.value})} />
                  <PremiumInput label="Location" value={data.city} onChange={(e)=>setData({...data, city:e.target.value})} />
                  <PremiumInput label="Country" value={data.country} onChange={(e)=>setData({...data, country:e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 tracking-wide ml-1 uppercase">Professional Summary</label>
                  <textarea value={data.summary} onChange={(e)=>setData({...data, summary:e.target.value})} className="w-full h-32 md:h-44 p-4 md:p-6 bg-slate-900/50 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 text-[13px] leading-relaxed resize-none transition-all" placeholder="Architect your professional story..." />
                </div>
                <div className="p-6 md:p-8 border-2 border-dashed border-white/10 bg-white/[0.02] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-2xl overflow-hidden ring-2 ring-indigo-500/20 shadow-2xl">{data.photo && <img src={data.photo} className="w-full h-full object-cover" alt="Profile"/>}</div>
                    <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest leading-loose text-center sm:text-left">Portrait<br className="hidden sm:block"/>Authentication</p>
                  </div>
                  <label className="text-[10px] font-black uppercase text-indigo-400 cursor-pointer hover:text-white transition-colors">Choose Image <input type="file" hidden onChange={handlePhoto}/></label>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-10 duration-700 space-y-10">
                 {data.experience.map((exp, i) => (
                   <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl relative group space-y-6 md:space-y-8 transition-all hover:border-white/20">
                      <button onClick={()=>removeRow('experience', i)} className="absolute top-6 right-6 text-white/20 hover:text-rose-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors">Delete Entry</button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-0">
                         <PremiumInput label="Organization" value={exp.company} onChange={(e)=>updateList('experience', i, 'company', e.target.value)} />
                         <PremiumInput label="Role" value={exp.role} onChange={(e)=>updateList('experience', i, 'role', e.target.value)} />
                         <PremiumInput label="Start Date" value={exp.startDate} onChange={(e)=>updateList('experience', i, 'startDate', e.target.value)} />
                         {!exp.isPresent && <PremiumInput label="End Date" value={exp.endDate} onChange={(e)=>updateList('experience', i, 'endDate', e.target.value)} />}
                         <div className="sm:col-span-2 flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                            <input type="checkbox" checked={exp.isPresent} onChange={(e)=>updateList('experience', i, 'isPresent', e.target.checked)} className="w-4 h-4 accent-indigo-500" />
                            <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase">Currently Working Here</span>
                         </div>
                         <textarea className="sm:col-span-2 bg-transparent border border-white/10 p-4 md:p-6 rounded-2xl h-32 md:h-40 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="Key achievements and impact..." value={exp.desc} onChange={(e)=>updateList('experience', i, 'desc', e.target.value)} />
                      </div>
                   </div>
                 ))}
                 <button onClick={()=>addRow('experience', {company:'', role:'', location:'', startDate:'', endDate:'', desc:'', isPresent:false})} className="w-full p-4 md:p-5 bg-white/5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-indigo-500 transition-all shadow-lg">+ Add Position</button>
              </div>
            )}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-10 duration-700 space-y-10">
                 {data.education.map((edu, i) => (
                   <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative">
                      <button onClick={()=>removeRow('education', i)} className="absolute top-6 right-6 text-white/20 hover:text-rose-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest">Delete</button>
                      <div className="pt-4 md:pt-0"><PremiumInput label="Institution" value={edu.school} onChange={(e)=>updateList('education', i, 'school', e.target.value)} /></div>
                      <PremiumInput label="Degree / Diploma" value={edu.degree} onChange={(e)=>updateList('education', i, 'degree', e.target.value)} />
                      <PremiumInput label="GPA / Grade" value={edu.gpa} onChange={(e)=>updateList('education', i, 'gpa', e.target.value)} />
                      <PremiumInput label="Completion" value={edu.endDate} onChange={(e)=>updateList('education', i, 'endDate', e.target.value)} />
                   </div>
                 ))}
                 <button onClick={()=>addRow('education', { school: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '' })} className="w-full p-4 md:p-5 bg-white/5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-indigo-500 transition-all">+ Add Education</button>
              </div>
            )}
            {step === 4 && (
              <div className="animate-in slide-in-from-right-10 duration-700 space-y-8 md:space-y-10">
                 {data.hardSkills.map((s, i) => (
                   <div key={i} className="flex flex-col sm:flex-row gap-6 md:gap-10 items-center p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:bg-white/[0.08] relative">
                     <input className="w-full sm:flex-1 bg-transparent border-none outline-none font-bold text-lg md:text-xl placeholder:text-white/10" value={s.name} onChange={(e)=>updateList('hardSkills', i, 'name', e.target.value)} placeholder="Enter Skill Name..." />
                     <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-[9px] md:text-[10px] font-mono text-indigo-400 w-8 md:w-10">{s.level}%</span>
                        <input type="range" value={s.level} onChange={(e)=>updateList('hardSkills', i, 'level', e.target.value)} className="accent-indigo-500 w-32 md:w-40 cursor-pointer" />
                     </div>
                     <button onClick={()=>removeRow('hardSkills', i)} className="absolute top-2 right-4 sm:static text-white/20 hover:text-rose-500 text-xl md:text-2xl font-black transition-colors">×</button>
                   </div>
                 ))}
                 <button onClick={()=>addRow('hardSkills', {name:'', level:50})} className="w-full p-4 md:p-5 bg-white/5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-indigo-500 transition-all">+ Add Proficiency</button>
              </div>
            )}
            {step === 5 && (
              <div className="animate-in slide-in-from-right-10 duration-700 space-y-12 md:space-y-16 pb-12">
                 <div className="space-y-8 md:space-y-10">
                   <div className="flex justify-between items-center"><h4 className="text-[10px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Featured Projects</h4><button onClick={()=>addRow('projects', { title: '', link: '', desc: '' })} className="text-[9px] md:text-[10px] font-bold text-indigo-400">+ Add</button></div>
                   {data.projects.map((proj, i) => (
                     <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 md:space-y-6">
                        <PremiumInput label="Project Label" value={proj.title} onChange={(e)=>updateList('projects', i, 'title', e.target.value)} />
                        <PremiumInput label="Live URL" value={proj.link} onChange={(e)=>updateList('projects', i, 'link', e.target.value)} />
                        <textarea className="w-full bg-transparent border border-white/10 p-4 md:p-6 rounded-2xl h-24 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="Brief project summary..." value={proj.desc} onChange={(e)=>updateList('projects', i, 'desc', e.target.value)} />
                     </div>
                   ))}
                 </div>
                 <div className="space-y-8 md:space-y-10">
                   <div className="flex justify-between items-center"><h4 className="text-[10px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Languages</h4><button onClick={()=>addRow('languages', { name: '', level: 'Fluent' })} className="text-[9px] md:text-[10px] font-bold text-indigo-400">+ Add</button></div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                     {data.languages.map((l, i) => (
                       <div key={i} className="flex gap-2 p-2 bg-white/5 border border-white/5 rounded-xl group transition-all hover:border-white/20"><input placeholder="e.g. English" value={l.name} onChange={(e)=>updateList('languages', i, 'name', e.target.value)} className="flex-1 bg-transparent p-2 outline-none text-sm" /><button onClick={()=>removeRow('languages', i)} className="px-2 text-white/20 hover:text-rose-500">×</button></div>
                     ))}
                   </div>
                 </div>
                 <div className="space-y-8 md:space-y-10">
                   <div className="flex justify-between items-center"><h4 className="text-[10px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Custom Sections</h4><button onClick={()=>addRow('customSections', { title: '', content: '' })} className="text-[9px] md:text-[10px] font-bold text-indigo-400">+ New Segment</button></div>
                   {data.customSections.map((sec, i) => (
                     <div key={i} className="p-6 md:p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[30px] md:rounded-[40px] space-y-4 md:space-y-6">
                        <input placeholder="Segment Title (e.g. Awards)" value={sec.title} onChange={(e)=>updateList('customSections', i, 'title', e.target.value)} className="w-full bg-transparent border-none outline-none font-black text-xl md:text-2xl text-white placeholder:text-white/10" />
                        <textarea placeholder="List details here..." value={sec.content} onChange={(e)=>updateList('customSections', i, 'content', e.target.value)} className="w-full bg-transparent border-none outline-none text-white/50 text-[13px] md:text-sm h-28 md:h-32 resize-none italic leading-loose" />
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* BOTTOM BAR */}
          <div className="h-24 md:h-28 bg-slate-900 border-t border-white/10 flex items-center justify-between px-4 md:px-10 shrink-0 sticky bottom-0 z-[110] shadow-2xl">
              <div className="flex gap-2 md:gap-4 items-center">
                 <button onClick={()=>setStep(s=>Math.max(1, s-1))} className={`text-white/20 font-black uppercase text-[8px] md:text-[10px] tracking-widest px-2 md:px-4 py-4 transition-all ${step === 1 ? 'hidden' : 'hover:text-white'}`}>Back</button>
                 <div className={`h-6 w-px bg-white/5 ${step === 1 ? 'hidden' : 'block'}`} />
                 <button onClick={loadSampleData} className="text-emerald-400 font-black text-[8px] md:text-[9px] uppercase tracking-widest px-3 md:px-4 py-2 hover:bg-emerald-500/10 rounded-lg transition-all border border-emerald-500/20">Fill</button>
                 <button onClick={handleBackup} className="hidden sm:block text-indigo-400 font-bold text-[9px] uppercase tracking-widest px-2 hover:text-white transition-all">Backup</button>
                 <button onClick={resetData} className="text-rose-400 font-bold text-[8px] md:text-[9px] uppercase tracking-widest px-2 hover:text-white transition-all">Reset</button>
              </div>
              
              <button 
                onClick={handleNextStep}
                className={`px-6 md:px-12 py-3.5 md:py-4 rounded-xl font-black text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-2xl ${step === 1 && (!data.firstName || !data.lastName || !data.email) ? 'bg-white/5 text-white/10' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30'}`}
              >
                 {step === 5 ? 'Final Draft →' : 'Next Step →'}
              </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className={`flex-1 flex flex-col h-full items-center bg-[#020617] transition-all duration-1000 overflow-y-auto scrollbar-hide 
          ${showFinal ? 'p-0 bg-white' : 'p-6 lg:p-20'} 
          ${!isMobilePreview && !showFinal ? 'hidden lg:flex' : 'flex'}`}>
          
          {!showFinal && (
            <div className="flex flex-col items-center gap-6 mb-10 md:mb-14 shrink-0 no-print">
               <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center px-6 md:px-8 py-3 bg-slate-900/80 backdrop-blur border border-white/10 rounded-2xl shadow-xl">
                  <div className="flex flex-col gap-1 items-center sm:items-start">
                    <span className="text-[7px] md:text-[8px] font-black uppercase text-indigo-400">Typography</span>
                    <select className="bg-transparent text-[10px] md:text-xs font-bold outline-none cursor-pointer" value={config.font} onChange={(e)=>setConfig({...config, font: e.target.value})}>
                        <option value="Inter">Modern (Sans)</option>
                        <option value="Playfair Display">Elegant (Serif)</option>
                        <option value="Roboto">Clean (Roboto)</option>
                    </select>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/10" />
                  <div className="flex flex-col gap-1 items-center sm:items-start">
                    <span className="text-[7px] md:text-[8px] font-black uppercase text-indigo-400">Line Height</span>
                    <input type="range" min="1" max="2" step="0.1" className="w-20 md:w-24 accent-indigo-500" value={config.spacing} onChange={(e)=>setConfig({...config, spacing: e.target.value})} />
                  </div>
               </div>
               <div className="flex overflow-x-auto max-w-full p-1.5 bg-slate-900/60 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl scrollbar-hide">
                  {['executive', 'modernist', 'creative', 'simple', 'astraea'].map((t) => (
                    <button key={t} onClick={() => setTemplate(t)} className={`whitespace-nowrap px-4 md:px-8 py-2 md:py-2.5 text-[8px] md:text-[9px] font-black rounded-xl transition-all uppercase tracking-widest ${template === t ? 'bg-white text-black shadow-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/20 hover:text-white'}`}>{t}</button>
                  ))}
               </div>
            </div>
          )}

          {/* THE RESUME CANVAS (Scaled for Mobile Viewport) */}
          <div className={`bg-white shadow-2xl transition-all duration-1000 relative overflow-hidden printable-resume ${showFinal ? 'w-[210mm] scale-100 mt-10 md:mt-20 mb-32' : 'w-[210mm] scale-[0.35] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.65] origin-top ring-1 ring-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]'}`} style={{minHeight: '297mm', fontFamily: config.font, lineHeight: config.spacing}}>
            <div className="print:m-0 h-full">
              {template === 'executive' && <ExecutiveTemplate data={data} />}
              {template === 'modernist' && <ModernistTemplate data={data} />}
              {template === 'creative' && <CreativeTemplate data={data} />}
              {template === 'simple' && <SimpleTemplate data={data} />}
              {template === 'astraea' && <AstraeaTemplate data={data} />}
            </div>
          </div>

          {/* FINAL OVERLAY UI */}
          {showFinal && (
            <div className="fixed bottom-6 md:bottom-10 flex flex-col sm:flex-row items-center gap-3 md:gap-4 left-1/2 -translate-x-1/2 no-print z-[300] bg-slate-900/80 backdrop-blur-3xl p-3 rounded-[24px] md:rounded-[32px] border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10 duration-1000 w-[90%] sm:w-auto">
               <button onClick={()=>setShowFinal(false)} className="w-full sm:w-auto bg-white/5 text-white/50 border border-white/10 px-6 md:px-8 py-3 md:py-4 rounded-[18px] md:rounded-[24px] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all">Revise Entry</button>
               <div className="hidden sm:block h-8 w-[1px] bg-white/10" />
               <button onClick={()=>window.print()} className="w-full sm:w-auto bg-indigo-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-[18px] md:rounded-[24px] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                 DOWNLOAD PDF
               </button>
               <button className="hidden sm:block bg-white/10 text-white/80 px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/20 transition-all border border-white/5 opacity-50 cursor-not-allowed">DOCX</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;