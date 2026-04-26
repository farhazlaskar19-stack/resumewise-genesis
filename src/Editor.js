import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ExecutiveTemplate from './temp_folder/ExecutiveTemplate';
import ModernistTemplate from './temp_folder/ModernistTemplate';
import CreativeTemplate from './temp_folder/CreativeTemplate';
import SimpleTemplate from './temp_folder/SimpleTemplate';
import AstraeaTemplate from './temp_folder/AstraeaTemplate';
import { useAuth } from './context/AuthContext';
import { fetchUserResume, saveUserResume, fetchBlueprint, saveBlueprint, updateBlueprintStatus } from './services/resumeService';
import { FormSkeleton, ResumePreviewSkeleton } from './components/SkeletonLoader';
import { useToast, ToastContainer } from './components/Toast';

// --- SUCCESS CHECKMARK COMPONENT ---
const SuccessMark = ({ show }) => (
  <div className={`ml-auto flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 ${show ? 'bg-indigo-500/20 scale-100 opacity-100' : 'bg-transparent scale-50 opacity-0'}`}>
    <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

// --- PREMIUM SAAS INPUT ---
const PremiumInput = ({ label, value, required, error, ...props }) => {
  const inputRef = useRef(null);
  
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-[11px] font-semibold text-slate-400 tracking-wide ml-1">{label}</label>
      <div className={`flex items-center px-4 py-3 sm:py-3.5 bg-white/[0.02] border transition-all duration-300 rounded-xl focus-within:bg-white/[0.04] ${error ? 'border-rose-500/50 shadow-sm shadow-rose-500/10' : value ? 'border-white/20' : 'border-white/10'} focus-within:border-indigo-500 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)]`}>
        <input 
          {...props} 
          ref={inputRef}
          value={value}
          className="bg-transparent border-none outline-none w-full text-[14px] text-slate-100 placeholder:text-slate-600 font-medium" 
        />
        <SuccessMark show={!!value && !error} />
      </div>
    </div>
  );
};

function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const toast = useToast();
  const [step, setStep] = useState(1); 
  const [showFinal, setShowFinal] = useState(false);
  const [resumeScore, setResumeScore] = useState(0);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [errors, setErrors] = useState([]); 
  const saveToastTimerRef = useRef(null);

  const [template, setTemplate] = useState(() => {
    const params = new URLSearchParams(location.search);
    const urlTemplate = params.get('template');
    const localTemplate = localStorage.getItem('selectedTemplate');
    return urlTemplate || localTemplate || 'executive'; 
  });
  
  const [blueprintId, setBlueprintId] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('id') || null;
  });
  
  const [isScratch, setIsScratch] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('scratch') === 'true';
  });
  
  const [isDownload, setIsDownload] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('download') === 'true';
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
    const params = new URLSearchParams(location.search);
    const isScratchMode = params.get('scratch') === 'true';
    if (isScratchMode) return initialData;
    const localData = localStorage.getItem('pro_cv_complete_v5_final');
    if (localData) {
      try { return JSON.parse(localData); } catch (e) { console.warn('Invalid local data, using initial state'); }
    }
    return initialData;
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      if (!user?.uid || isHydrated) return;
      if (isScratch) {
        setIsHydrated(true);
        return;
      }
      try {
        let resume;
        if (blueprintId) {
          resume = await fetchBlueprint(user.uid, blueprintId);
        } else {
          resume = await fetchUserResume(user.uid);
        }
        if (cancelled) return;
        if (resume.exists) {
          if (resume.template) setTemplate(resume.template);
          if (resume.data) setData((prev) => ({ ...prev, ...resume.data }));
        }
      } catch (e) {
        if (!cancelled) {
          if (e.code === 'permission-denied') toast.error('Permission denied. Please check your account settings.');
          else if (e.code === 'unavailable') toast.warning('Connection lost. Working in offline mode.');
          else toast.error('Failed to load your resume data.');
        }
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }
    hydrate();
    return () => { cancelled = true; };
  }, [user?.uid, isScratch, blueprintId]); 

  const loadSampleData = () => {
    const sample = {
      firstName: 'Samantha', lastName: 'Williams', role: 'Senior Product Designer',
      email: 's.williams@design.com', phone: '+1 (555) 0123', address: '123 Innovation Drive',
      city: 'San Francisco', country: 'USA', postCode: '94103', photo: null,
      summary: 'Award-winning Product Designer with over 8 years of experience in creating user-centric digital experiences.',
      hardSkills: [{ name: 'UI/UX Design', level: 95 }, { name: 'React Architecture', level: 85 }],
      experience: [{ company: 'TechNova Systems', role: 'Lead Designer', location: 'Remote', startDate: '2020', endDate: '', isPresent: true, desc: 'Directed the design overhaul.' }],
      education: [{ school: 'Stanford University', degree: 'B.Sc Digital Design', field: 'Design', location: 'CA', startDate: '2012', endDate: '2016', gpa: '3.9' }],
      languages: [{ name: 'English', level: 'Native' }],
      socials: [{ title: 'LinkedIn', url: 'linkedin.com/in/samantha' }],
      certifications: [{ title: 'Google UX Design', issuer: 'Coursera' }],
      awards: [{ title: 'Design Excellence', year: '2023' }],
      projects: [{ title: 'EcoTrack', link: 'github.com/ecotrack', desc: 'Sustainability app.' }],
      customSections: [{ title: 'Skills', content: 'Design Sprints • User Research' }]
    };
    setData(sample);
    setSaveStatus('synced');
    if (saveToastTimerRef.current) clearTimeout(saveToastTimerRef.current);
    saveToastTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const resetData = () => {
    if(window.confirm("Are you sure?")) {
      setData(initialData);
      setStep(1);
      if (user?.uid) {
        saveUserResume(user.uid, { template, data: initialData }).catch(() => {});
      }
    }
  };

  const steps = [
    { id: 1, label: 'Personal Info', desc: 'Add your contact info so recruiters can reach you.' },
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
  }, [data]);

  useEffect(() => {
    if (!user?.uid || !isHydrated) return;
    setSaveStatus('saving');
    const t = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        if (blueprintId) {
          await saveBlueprint(user.uid, blueprintId, { template, data });
        } else if (isScratch) {
          const { createBlueprint } = await import('./services/resumeService');
          const newBlueprintId = await createBlueprint(user.uid, template, data);
          setBlueprintId(newBlueprintId);
        } else {
          await saveUserResume(user.uid, { template, data });
        }
        setSaveStatus('synced');
        if (saveToastTimerRef.current) clearTimeout(saveToastTimerRef.current);
        saveToastTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (e) {
        setSaveStatus('error');
        if (e.code === 'permission-denied') toast.error('Permission denied. Please check your account settings.');
        else if (e.code === 'unavailable') toast.warning('Connection lost. Your changes will sync when online.');
        else if (e.code === 'resource-exhausted') toast.error('Storage quota exceeded. Please free up some space.');
        else toast.error('Failed to save your changes. Please try again.');
        if (saveToastTimerRef.current) clearTimeout(saveToastTimerRef.current);
        saveToastTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
      } finally {
        setTimeout(() => setSaveStatus('idle'), 100);
      }
    }, 1000);
    return () => {
      clearTimeout(t);
      setSaveStatus('idle');
    };
  }, [data, template, isHydrated, user?.uid, toast, blueprintId, isScratch]);

  useEffect(() => {
    if (!user?.uid || !isHydrated) return;
    const saveTemplateChange = async () => {
      try { await saveUserResume(user.uid, { template, data }); } catch (e) {}
    };
    const timer = setTimeout(saveTemplateChange, 1000);
    return () => clearTimeout(timer);
  }, [template, data, isHydrated, user?.uid, toast]);

  useEffect(() => {
    return () => {
      if (saveToastTimerRef.current) clearTimeout(saveToastTimerRef.current);
    };
  }, []);

  const handleBackup = async () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    try {
      if (blueprintId && user?.uid) {
        await updateBlueprintStatus(user.uid, blueprintId, 'Complete');
        toast.success('Resume marked as complete');
      }
      window.print();
    } catch (error) {
      toast.error('Failed to mark resume as complete');
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
      reader.onload = (event) => setData({ ...data, photo: event.target.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-[#05050A] flex flex-col font-sans overflow-hidden text-slate-200">
      
      <style>{`
        @media print {
          @page { size: A4; margin: 0 !important; }
          html, body { 
            background: white !important; margin: 0 !important; padding: 0 !important; 
            width: 210mm !important; height: 297mm !important; 
            filter: contrast(1.1) brightness(1.02) !important;
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; 
          }
          body * { visibility: hidden; }
          .printable-resume, .printable-resume * { visibility: visible; }
          .printable-resume { 
            position: absolute !important; left: 0 !important; top: 0 !important; margin: 0 !important; padding: 0 !important; 
            width: 210mm !important; height: 297mm !important; transform: scale(1) !important; transform-origin: top left !important; 
            border: none !important; box-shadow: none !important; overflow: hidden !important;
            backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
          }
          .no-print { display: none !important; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .stage-pattern {
          background-color: #05050A;
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Saving Indicator */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[250] px-5 py-2 rounded-full font-semibold text-xs transition-all duration-500 shadow-xl backdrop-blur-md ${
        saveStatus === 'idle' ? '-translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      } ${
        saveStatus === 'saving' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
        saveStatus === 'synced' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
        saveStatus === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : ''
      }`}>
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && <><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/> Saving...</>}
          {saveStatus === 'synced' && <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg> Synced</>}
          {saveStatus === 'error' && <><div className="w-2 h-2 rounded-full bg-rose-400"/> Sync Failed</>}
        </div>
      </div>

      {!showFinal && (
        <button 
          onClick={() => setIsMobilePreview(!isMobilePreview)}
          className="lg:hidden fixed bottom-32 right-6 z-[150] w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform text-white border border-indigo-500/50"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobilePreview ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
          </svg>
        </button>
      )}

      <div className="flex flex-1 overflow-hidden h-full">
        
        {/* LEFT COLUMN: FORM */}
        <div className={`relative flex flex-col h-full transition-all duration-700 no-print ${showFinal ? 'w-0 opacity-0' : 'lg:w-[45%] w-full max-w-[650px]'} ${isMobilePreview ? 'hidden lg:flex' : 'flex'} border-r border-white/5 bg-[#05050A] z-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]`}>
          
          <div className="px-6 md:px-10 pt-8 pb-6 shrink-0 bg-[#05050A]/90 backdrop-blur-xl border-b border-white/5">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => navigate('/blueprints')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Dashboard
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mb-6">
              {steps.map((s) => (
                <div key={s.id} onClick={() => s.id <= step && setStep(s.id)} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= s.id ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/5'} ${s.id <= step ? 'cursor-pointer hover:bg-indigo-400' : 'cursor-default'}`} />
              ))}
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{steps[step-1].label}</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">{steps[step-1].desc}</p>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 scrollbar-hide space-y-10 relative">
            
            {/* Strength Bar */}
            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Profile Strength</span>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${resumeScore}%`}}></div>
                  </div>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{resumeScore}%</span>
                </div>
            </div>

            {!isHydrated ? (
              <FormSkeleton />
            ) : step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Changed gap to gap-6 to prevent merging */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <PremiumInput label="First Name" error={errors.includes('firstName')} value={data.firstName} onChange={(e)=>setData({...data, firstName:e.target.value})} />
                  <PremiumInput label="Last Name" error={errors.includes('lastName')} value={data.lastName} onChange={(e)=>setData({...data, lastName:e.target.value})} />
                  <div className="sm:col-span-2"><PremiumInput label="Professional Role" value={data.role} onChange={(e)=>setData({...data, role:e.target.value})} /></div>
                  <PremiumInput label="Email Address" error={errors.includes('email')} value={data.email} onChange={(e)=>setData({...data, email:e.target.value})} />
                  <PremiumInput label="Phone Number" value={data.phone} onChange={(e)=>setData({...data, phone:e.target.value})} />
                  <PremiumInput label="City" value={data.city} onChange={(e)=>setData({...data, city:e.target.value})} />
                  <PremiumInput label="Country" value={data.country} onChange={(e)=>setData({...data, country:e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-slate-400 tracking-wide ml-1">Professional Summary</label>
                  <textarea value={data.summary} onChange={(e)=>setData({...data, summary:e.target.value})} className="w-full h-32 p-4 bg-white/[0.02] border border-white/10 rounded-xl outline-none focus:border-indigo-500 focus:bg-white/[0.04] text-[14px] text-slate-100 leading-relaxed resize-none transition-all shadow-sm focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]" placeholder="Briefly describe your expertise and career goals..." />
                </div>
                <div className="p-6 border border-dashed border-white/20 bg-white/[0.01] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.02] transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/5 rounded-xl overflow-hidden ring-1 ring-white/10 flex items-center justify-center text-slate-500 shrink-0">
                      {data.photo ? <img src={data.photo} className="w-full h-full object-cover" alt="Profile"/> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Profile Photo</p>
                      <p className="text-xs text-slate-500">JPG, PNG (Max 2MB)</p>
                    </div>
                  </div>
                  <label className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white cursor-pointer transition-colors text-center">
                    Upload
                    <input type="file" hidden onChange={handlePhoto}/>
                  </label>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                 {data.experience.map((exp, i) => (
                   <div key={i} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group space-y-6 transition-all hover:border-white/20">
                      <button onClick={()=>removeRow('experience', i)} className="absolute top-6 right-6 text-slate-500 hover:text-rose-400 transition-colors" title="Remove Entry">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                         <div className="sm:col-span-2"><PremiumInput label="Company Name" value={exp.company} onChange={(e)=>updateList('experience', i, 'company', e.target.value)} /></div>
                         <PremiumInput label="Job Title" value={exp.role} onChange={(e)=>updateList('experience', i, 'role', e.target.value)} />
                         <PremiumInput label="Location (Optional)" value={exp.location} onChange={(e)=>updateList('experience', i, 'location', e.target.value)} />
                         <PremiumInput label="Start Date (e.g. 2020)" value={exp.startDate} onChange={(e)=>updateList('experience', i, 'startDate', e.target.value)} />
                         {!exp.isPresent && <PremiumInput label="End Date" value={exp.endDate} onChange={(e)=>updateList('experience', i, 'endDate', e.target.value)} />}
                         
                         <label className="sm:col-span-2 flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors w-full sm:w-max mt-2">
                            <input type="checkbox" checked={exp.isPresent} onChange={(e)=>updateList('experience', i, 'isPresent', e.target.checked)} className="w-4 h-4 accent-indigo-500 rounded bg-transparent border-white/20" />
                            <span className="text-sm font-medium text-slate-300">I currently work here</span>
                         </label>
                         
                         <div className="sm:col-span-2 space-y-2 mt-2">
                           <label className="text-[11px] font-semibold text-slate-400 ml-1">Key Responsibilities & Achievements</label>
                           <textarea className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-xl h-32 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.04] transition-all text-slate-100 resize-none" placeholder="Bullet points work best..." value={exp.desc} onChange={(e)=>updateList('experience', i, 'desc', e.target.value)} />
                         </div>
                      </div>
                   </div>
                 ))}
                 <button onClick={()=>addRow('experience', {company:'', role:'', location:'', startDate:'', endDate:'', desc:'', isPresent:false})} className="w-full py-4 bg-white/[0.02] border border-dashed border-white/20 rounded-xl text-sm font-semibold text-indigo-400 hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   Add Another Position
                 </button>
              </div>
            )}
            
            {step === 3 && (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                 {data.education.map((edu, i) => (
                   <div key={i} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group space-y-6">
                      <button onClick={()=>removeRow('education', i)} className="absolute top-6 right-6 text-slate-500 hover:text-rose-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div className="sm:col-span-2"><PremiumInput label="Institution / University" value={edu.school} onChange={(e)=>updateList('education', i, 'school', e.target.value)} /></div>
                        <PremiumInput label="Degree / Field of Study" value={edu.degree} onChange={(e)=>updateList('education', i, 'degree', e.target.value)} />
                        <PremiumInput label="Graduation Year" value={edu.endDate} onChange={(e)=>updateList('education', i, 'endDate', e.target.value)} />
                        <PremiumInput label="GPA / Grade (Optional)" value={edu.gpa} onChange={(e)=>updateList('education', i, 'gpa', e.target.value)} />
                      </div>
                   </div>
                 ))}
                 <button onClick={()=>addRow('education', { school: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '' })} className="w-full py-4 bg-white/[0.02] border border-dashed border-white/20 rounded-xl text-sm font-semibold text-indigo-400 hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   Add Education
                 </button>
              </div>
            )}
            
            {step === 4 && (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
                 {data.hardSkills.map((s, i) => (
                   <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center p-5 bg-white/[0.02] border border-white/10 rounded-xl group relative">
                     <div className="w-full sm:flex-1">
                       <input className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none pb-2 font-medium text-base placeholder:text-slate-600 transition-colors text-white" value={s.name} onChange={(e)=>updateList('hardSkills', i, 'name', e.target.value)} placeholder="e.g. React.js, Project Management" />
                     </div>
                     <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                        <span className="text-xs font-semibold text-indigo-400 w-10 text-right">{s.level}%</span>
                        <input type="range" value={s.level} onChange={(e)=>updateList('hardSkills', i, 'level', e.target.value)} className="accent-indigo-500 w-full sm:w-32 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none" />
                     </div>
                     <button onClick={()=>removeRow('hardSkills', i)} className="absolute top-2 right-2 sm:static text-slate-500 hover:text-rose-400 transition-colors p-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                   </div>
                 ))}
                 <button onClick={()=>addRow('hardSkills', {name:'', level:50})} className="w-full py-4 bg-white/[0.02] border border-dashed border-white/20 rounded-xl text-sm font-semibold text-indigo-400 hover:bg-white/[0.05] hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                   Add Skill
                 </button>
              </div>
            )}
            
            {step === 5 && (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-12 pb-8">
                 <div className="space-y-6">
                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                     <h4 className="text-sm font-semibold text-white">Projects</h4>
                     <button onClick={()=>addRow('projects', { title: '', link: '', desc: '' })} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">+ Add Project</button>
                   </div>
                   {data.projects.map((proj, i) => (
                     <div key={i} className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <PremiumInput label="Project Name" value={proj.title} onChange={(e)=>updateList('projects', i, 'title', e.target.value)} />
                          <PremiumInput label="Live URL / Repository" value={proj.link} onChange={(e)=>updateList('projects', i, 'link', e.target.value)} />
                        </div>
                        <textarea className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-xl h-24 text-sm outline-none focus:border-indigo-500 focus:bg-white/[0.04] transition-all text-slate-100 resize-none" placeholder="Brief project description..." value={proj.desc} onChange={(e)=>updateList('projects', i, 'desc', e.target.value)} />
                     </div>
                   ))}
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                     <h4 className="text-sm font-semibold text-white">Languages</h4>
                     <button onClick={()=>addRow('languages', { name: '', level: 'Fluent' })} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">+ Add Language</button>
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {data.languages.map((l, i) => (
                       <div key={i} className="flex items-center gap-2 p-1.5 pl-3 bg-white/[0.05] border border-white/10 rounded-lg group">
                         <input placeholder="e.g. Spanish" value={l.name} onChange={(e)=>updateList('languages', i, 'name', e.target.value)} className="w-24 sm:w-32 bg-transparent outline-none text-sm font-medium placeholder:text-slate-500" />
                         <button onClick={()=>removeRow('languages', i)} className="p-1 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-md">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                     <h4 className="text-sm font-semibold text-white">Custom Sections</h4>
                     <button onClick={()=>addRow('customSections', { title: '', content: '' })} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">+ Add Section</button>
                   </div>
                   {data.customSections.map((sec, i) => (
                     <div key={i} className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-4 relative">
                        <button onClick={()=>removeRow('customSections', i)} className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors p-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <input placeholder="Title (e.g. Awards)" value={sec.title} onChange={(e)=>updateList('customSections', i, 'title', e.target.value)} className="w-full sm:w-[80%] bg-transparent border-b border-indigo-500/30 outline-none font-bold text-lg text-white placeholder:text-indigo-200/30 pb-1 focus:border-indigo-400 transition-colors" />
                        <textarea placeholder="Section details..." value={sec.content} onChange={(e)=>updateList('customSections', i, 'content', e.target.value)} className="w-full bg-transparent border-none outline-none text-slate-300 text-sm h-24 resize-none leading-relaxed placeholder:text-slate-600 mt-2" />
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 bg-[#05050A] border-t border-white/5 flex flex-wrap items-center justify-between shrink-0 z-20 gap-4">
              <div className="flex items-center gap-2">
                 <button onClick={()=>setStep(s=>Math.max(1, s-1))} className={`px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors ${step === 1 ? 'invisible' : ''}`}>
                   Back
                 </button>
                 <button onClick={loadSampleData} className="px-4 py-2 text-xs font-semibold text-slate-400 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all hidden sm:block">Fill Sample</button>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                 <button onClick={resetData} className="px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors hidden sm:block">Reset</button>
                 <button 
                   onClick={handleNextStep} 
                   className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
                 >
                   {step === 5 ? 'Review Final' : 'Next Step'}
                   {step !== 5 && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                 </button>
              </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL PREVIEW STAGE */}
        <div className={`flex-1 flex flex-col h-full items-center transition-all duration-700 overflow-y-auto scrollbar-hide 
          ${showFinal ? 'p-0 bg-[#05050A] stage-pattern' : 'p-6 lg:p-10 bg-[#05050A]'} 
          ${!isMobilePreview && !showFinal ? 'hidden lg:flex' : 'flex'} relative`}>
          
          {!showFinal ? (
            /* --- EDITING MODE PREVIEW --- */
            <div className="flex flex-col items-center gap-6 pb-20 w-full max-w-4xl pt-4">
               {/* Template Tabs */}
               <div className="w-full flex justify-center mb-2 z-10 sticky top-0">
                  <div className="p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-xl flex items-center shadow-lg overflow-x-auto scrollbar-hide max-w-full">
                    {['executive', 'modernist', 'creative', 'simple', 'astraea'].map((t) => (
                      <button key={t} onClick={() => setTemplate(t)} className={`whitespace-nowrap px-5 py-2 text-xs font-semibold rounded-xl transition-all capitalize ${template === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>{t}</button>
                    ))}
                  </div>
               </div>
               
               {!isHydrated ? (
               <ResumePreviewSkeleton />
             ) : (
               <div className={`bg-white shadow-2xl transition-all duration-500 relative overflow-hidden printable-resume ${isMobilePreview ? 'w-[210mm] scale-[0.45] origin-top' : 'w-[210mm] scale-[0.6] xl:scale-[0.75] origin-top'} ring-1 ring-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm`} style={{minHeight: '297mm', marginBottom: '-25%'}}>
                 <div className="print:m-0 h-full">
                   {template === 'executive' && <ExecutiveTemplate data={data} />}
                   {template === 'modernist' && <ModernistTemplate data={data} />}
                   {template === 'creative' && <CreativeTemplate data={data} />}
                   {template === 'simple' && <SimpleTemplate data={data} />}
                   {template === 'astraea' && <AstraeaTemplate data={data} />}
                 </div>
               </div>
             )}
            </div>
          ) : (
            /* --- ENHANCED FINAL STAGE --- */
            <div className="w-full flex-1 flex flex-col items-center py-12 md:py-20 animate-in fade-in duration-700">
               
               <div className="mb-14 flex flex-col items-center gap-5 no-print text-center px-4 w-full max-w-3xl">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Document Finalized
                 </div>
                 
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                   Your Professional <br className="md:hidden" /> Blueprint is Ready.
                 </h2>
                 
                 <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                   Our system has successfully compiled your professional data into a high-performance, ATS-compliant PDF document. Review the final render below.
                 </p>
                 
                 <div className="flex items-center justify-center gap-6 mt-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl w-full sm:w-auto backdrop-blur-sm">
                   <div className="flex flex-col items-center gap-1">
                     <span className="text-indigo-400 font-bold text-2xl">{resumeScore}%</span>
                     <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">ATS Score</span>
                   </div>
                   <div className="w-px h-10 bg-white/10" />
                   <div className="flex flex-col items-center gap-1">
                     <span className="text-indigo-400 font-bold text-2xl capitalize">{template}</span>
                     <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Framework</span>
                   </div>
                   <div className="w-px h-10 bg-white/10" />
                   <div className="flex flex-col items-center gap-1">
                     <span className="text-emerald-400 font-bold text-2xl flex items-center gap-1">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                     </span>
                     <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Validation</span>
                   </div>
                 </div>
               </div>

               <div className="printable-resume w-[210mm] scale-[0.45] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 bg-white mb-40 origin-top transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(99,102,241,0.15)] rounded-sm" 
                 style={{ minHeight: '297mm' }}>
                 <div className="print:m-0 h-full">
                    {template === 'executive' && <ExecutiveTemplate data={data} />}
                    {template === 'modernist' && <ModernistTemplate data={data} />}
                    {template === 'creative' && <CreativeTemplate data={data} />}
                    {template === 'simple' && <SimpleTemplate data={data} />}
                    {template === 'astraea' && <AstraeaTemplate data={data} />}
                 </div>
               </div>

               {/* FINAL ACTION DOCK */}
               <div className="fixed bottom-8 flex flex-col sm:flex-row items-center gap-3 left-1/2 -translate-x-1/2 no-print z-[300] bg-[#05050A]/95 backdrop-blur-xl p-3.5 rounded-[20px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[90%] sm:w-auto">
                  <button onClick={()=>setShowFinal(false)} className="w-full sm:w-auto bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Continue Editing
                  </button>
                  <button onClick={handleDownload} className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-2 active:scale-95">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download PDF
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}

export default Editor;