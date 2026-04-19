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
  <div className="flex flex-col gap-2 flex-1 min-w-full sm:min-w-[280px] group">
    <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wide ml-1 uppercase">{label}</label>
    <div className={`flex items-center px-4 py-3 sm:py-3.5 bg-slate-900/40 border transition-all duration-300 rounded-xl focus-within:bg-slate-800 ${error ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : value ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-white/10'} focus-within:border-indigo-500`}>
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
  const [errors, setErrors] = useState([]); 

  const [template, setTemplate] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('template') || 'executive'; 
  });
  
  const [config] = useState({ font: 'Inter', spacing: 1.5, size: 14 });

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
      summary: 'Award-winning Product Designer with over 8 years of experience in creating user-centric digital experiences.',
      hardSkills: [{ name: 'UI/UX Design', level: 95 }, { name: 'React Architecture', level: 85 }],
      experience: [{ company: 'TechNova Systems', role: 'Lead Designer', location: 'Remote', startDate: '2020', endDate: '', isPresent: true, desc: 'Directed the design overhaul.' }],
      education: [{ school: 'Stanford University', degree: 'B.Sc. Digital Design', field: 'Design', location: 'CA', startDate: '2012', endDate: '2016', gpa: '3.9' }],
      languages: [{ name: 'English', level: 'Native' }],
      socials: [{ title: 'LinkedIn', url: 'linkedin.com/in/samantha' }],
      certifications: [{ title: 'Google UX Design', issuer: 'Coursera' }],
      awards: [{ title: 'Design Excellence', year: '2023' }],
      projects: [{ title: 'EcoTrack', link: 'github.com/ecotrack', desc: 'Sustainability app.' }],
      customSections: [{ title: 'Skills', content: 'Design Sprints • User Research' }]
    };
    setData(sample);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const resetData = () => {
    if(window.confirm("Are you sure?")) {
      setData(initialData);
      localStorage.removeItem('pro_cv_complete_v5_final');
      setStep(1);
    }
  };

  const steps = [
    { id: 1, label: 'Contacts', desc: 'Add your contact info so recruiters can reach you.' },
    { id: 2, label: 'Experience', desc: 'Detail your professional journey.' },
    { id: 3, label: 'Education', desc: 'List your academic foundation.' },
    { id: 4, label: 'Skills', desc: 'Highlight your technical expertise.' },
    { id: 5, label: 'Finalize', desc: 'Add custom sections and links.' },
  ];

  const handleNextStep = () => {
    let newErrors = [];
    if (step === 1) {
      if (!data.firstName) newErrors.push('firstName');
      if (!data.lastName) newErrors.push('lastName');
      if (!data.email) newErrors.push('email');
    }
    setErrors(newErrors);
    if (newErrors.length === 0) {
       step === 5 ? setShowFinal(true) : setStep(s => s + 1);
    }
  };

  useEffect(() => {
    let score = 0;
    if (data.firstName) score += 10;
    if (data.photo) score += 10;
    if (data.summary?.length > 20) score += 10;
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
      reader.onload = (event) => setData({ ...data, photo: event.target.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-[#020617] flex flex-col font-sans overflow-hidden text-white">
      
      <style>{`
        @media print {
          @page { size: A4; margin: 0 !important; }
          body { 
            background: white !important; margin: 0 !important; padding: 0 !important; 
            width: 210mm !important; height: 297mm !important; 
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; 
          }
          body * { visibility: hidden; }
          .printable-resume, .printable-resume * { visibility: visible; }
          .printable-resume { 
            position: absolute !important; left: 0 !important; top: 0 !important; 
            margin: 0 !important; padding: 0 !important; 
            width: 210mm !important; height: 297mm !important; 
            transform: scale(1) !important; transform-origin: top left !important; 
            border: none !important; box-shadow: none !important; overflow: hidden !important; 
          }
          .no-print { display: none !important; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .stage-pattern {
          background-color: #020617;
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Save Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[250] px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 ${saveStatus ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        ✨ Progress Saved
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        
        {/* LEFT COLUMN: FORM */}
        <div className={`relative flex flex-col h-full transition-all duration-700 no-print ${showFinal ? 'w-0 opacity-0' : 'lg:w-[50%] w-full'} ${isMobilePreview ? 'hidden lg:flex' : 'flex'} border-r border-white/5 bg-[#020617]`}>
          
          <div className="px-6 md:px-12 pt-10 pb-6 shrink-0 bg-[#020617]/80 backdrop-blur-md">
            <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
                <span className="text-indigo-400">←</span> EXIT ENGINE
            </button>

            <div className="flex items-center justify-between gap-2 md:gap-3 mb-6 md:mb-8">
              {steps.map((s) => (
                <div key={s.id} onClick={() => s.id <= step && setStep(s.id)} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-white/5'} cursor-pointer`} />
              ))}
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter mb-2">{steps[step-1].label}</h2>
            <p className="text-slate-400 text-[10px] sm:text-[11px] md:text-[13px] leading-relaxed max-w-md italic mb-6">{steps[step-1].desc}</p>

            {/* RESPONSIVE RESUME STRENGTH */}
            <div className="mb-10 px-4 sm:px-6 py-4 bg-slate-900/60 border border-white/10 rounded-[20px] sm:rounded-[24px] backdrop-blur-3xl flex items-center justify-between shadow-2xl">
                <span className="text-[8px] sm:text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] sm:tracking-[0.3em]">RESUME STRENGTH</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-24 sm:w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-emerald-500 shadow-[0_0_20px_#10b981] transition-all duration-1000" style={{width: `${resumeScore}%`}}></div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-white/80">{resumeScore}%</span>
                </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12 scrollbar-hide space-y-10 md:space-y-12">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8 md:space-y-10">
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 md:gap-6">
                  <PremiumInput label="First Name" error={errors.includes('firstName')} value={data.firstName} onChange={(e)=>setData({...data, firstName:e.target.value})} />
                  <PremiumInput label="Last Name" error={errors.includes('lastName')} value={data.lastName} onChange={(e)=>setData({...data, lastName:e.target.value})} />
                  <div className="sm:col-span-2"><PremiumInput label="Professional Role" value={data.role} onChange={(e)=>setData({...data, role:e.target.value})} /></div>
                  <PremiumInput label="Phone" value={data.phone} onChange={(e)=>setData({...data, phone:e.target.value})} />
                  <PremiumInput label="Email Address" error={errors.includes('email')} value={data.email} onChange={(e)=>setData({...data, email:e.target.value})} />
                  <PremiumInput label="Location" value={data.city} onChange={(e)=>setData({...data, city:e.target.value})} />
                  <PremiumInput label="Country" value={data.country} onChange={(e)=>setData({...data, country:e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Summary</label>
                  <textarea value={data.summary} onChange={(e)=>setData({...data, summary:e.target.value})} className="w-full h-32 md:h-44 p-4 md:p-6 bg-slate-900/50 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 text-[13px] leading-relaxed resize-none transition-all" />
                </div>
                <div className="p-6 border-2 border-dashed border-white/10 bg-white/[0.02] rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 rounded-2xl overflow-hidden ring-2 ring-indigo-500/20">{data.photo && <img src={data.photo} className="w-full h-full object-cover" alt="Profile"/>}</div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Portrait</p>
                  </div>
                  <label className="text-[10px] font-black uppercase text-indigo-400 cursor-pointer">Choose <input type="file" hidden onChange={handlePhoto}/></label>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-10 duration-700 space-y-10">
                 {data.experience.map((exp, i) => (
                   <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl relative group space-y-6 md:space-y-8 transition-all hover:border-white/20">
                      <button onClick={()=>removeRow('experience', i)} className="absolute top-6 right-6 text-white/20 hover:text-rose-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors">Delete Entry</button>
                      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6 pt-4 md:pt-0">
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
                   <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-3xl relative group space-y-6 sm:grid sm:grid-cols-2 sm:gap-6">
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

          <div className="h-24 sm:h-28 bg-[#020617] border-t border-white/10 flex items-center justify-between px-6 sm:px-10 shrink-0 sticky bottom-0 z-[110] shadow-2xl">
              <div className="flex gap-2 sm:gap-4 items-center">
                 <button onClick={()=>setStep(s=>Math.max(1, s-1))} className={`text-white/20 font-black uppercase text-[8px] sm:text-[10px] tracking-widest px-2 sm:px-4 transition-all ${step === 1 ? 'hidden' : 'hover:text-white'}`}>Back</button>
                 <button onClick={loadSampleData} className="text-emerald-400 font-black text-[8px] sm:text-[9px] uppercase border border-emerald-500/20 px-2 sm:px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Fill</button>
                 <button onClick={handleBackup} className="hidden sm:block text-indigo-400 font-bold text-[9px] uppercase hover:text-white transition-all">Backup</button>
                 <button onClick={resetData} className="text-rose-400 font-bold text-[8px] sm:text-[9px] uppercase hover:text-white transition-all">Reset</button>
              </div>
              <button 
                onClick={handleNextStep} 
                className="px-6 sm:px-14 py-3 sm:py-4 rounded-2xl bg-indigo-600 text-white font-black text-[9px] sm:text-[11px] uppercase tracking-[0.2em] transition-transform active:scale-95"
              >
                {step === 5 ? 'Final Draft' : 'Next Step'}
              </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL PREVIEW STAGE */}
        <div className={`flex-1 flex flex-col h-full items-center transition-all duration-1000 overflow-y-auto scrollbar-hide 
          ${showFinal ? 'p-0 bg-[#020617] stage-pattern' : 'p-6 lg:p-12 lg:pt-10 bg-[#020617]'} 
          ${!isMobilePreview && !showFinal ? 'hidden lg:flex' : 'flex'}`}>
          
          {!showFinal ? (
            /* --- EDITING MODE PREVIEW --- */
            <div className="flex flex-col items-center gap-6 mb-14 shrink-0 no-print w-full max-w-4xl">
               <div className="w-full flex items-center justify-center mb-4">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/60 border border-white/10 rounded-[28px] backdrop-blur-3xl flex items-center gap-1 sm:gap-2 shadow-2xl overflow-x-auto scrollbar-hide">
                    {['executive', 'modernist', 'creative', 'simple', 'astraea'].map((t) => (
                      <button key={t} onClick={() => setTemplate(t)} className={`whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black rounded-[18px] transition-all uppercase tracking-[0.1em] ${template === t ? 'bg-white text-black shadow-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white'}`}>{t}</button>
                    ))}
                  </div>
               </div>
               <div className={`bg-white shadow-2xl transition-all duration-1000 relative overflow-hidden printable-resume ${isMobilePreview ? 'w-[210mm] scale-[0.35] sm:scale-[0.45]' : 'w-[210mm] scale-[0.6]'} origin-top ring-1 ring-white/10 shadow-[0_0_120px_rgba(0,0,0,0.9)]`} style={{minHeight: '297mm'}}>
                 <div className="print:m-0 h-full">
                   {template === 'executive' && <ExecutiveTemplate data={data} />}
                   {template === 'modernist' && <ModernistTemplate data={data} />}
                   {template === 'creative' && <CreativeTemplate data={data} />}
                   {template === 'simple' && <SimpleTemplate data={data} />}
                   {template === 'astraea' && <AstraeaTemplate data={data} />}
                 </div>
               </div>
            </div>
          ) : (
            /* --- ENHANCED FINAL STAGE --- */
            <div className="w-full flex-1 flex flex-col items-center py-12 md:py-20 animate-in fade-in duration-1000">
               <div className="mb-12 flex flex-col items-center gap-4 no-print">
                 <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.5em] animate-pulse text-center">Generation Complete</h3>
                 <h2 className="text-2xl sm:text-3xl font-black text-white italic text-center px-4">Your Masterpiece is Ready.</h2>
               </div>

               <div className="printable-resume w-[210mm] scale-[0.4] sm:scale-[0.6] md:scale-[0.85] lg:scale-100 bg-white mb-32 origin-top transition-all duration-700" 
                 style={{
                   minHeight: '297mm', 
                   boxShadow: '0 50px 100px -20px rgba(0,0,0,0.9), 0 0 50px -10px rgba(99,102,241,0.2)'
                 }}>
                 <div className="print:m-0 h-full">
                    {template === 'executive' && <ExecutiveTemplate data={data} />}
                    {template === 'modernist' && <ModernistTemplate data={data} />}
                    {template === 'creative' && <CreativeTemplate data={data} />}
                    {template === 'simple' && <SimpleTemplate data={data} />}
                    {template === 'astraea' && <AstraeaTemplate data={data} />}
                 </div>
               </div>

               {/* FINAL ACTION DOCK */}
               <div className="fixed bottom-6 md:bottom-10 flex flex-col sm:flex-row items-center gap-3 md:gap-4 left-1/2 -translate-x-1/2 no-print z-[300] bg-slate-900/90 backdrop-blur-3xl p-4 rounded-[32px] border border-white/10 shadow-2xl w-[90%] sm:w-auto">
                  <button onClick={()=>setShowFinal(false)} className="w-full sm:w-auto bg-white/5 text-white/50 border border-white/10 px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all">Revise Entry</button>
                  <button onClick={()=>window.print()} className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                    DOWNLOAD PDF
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;