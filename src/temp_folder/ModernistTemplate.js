import React from 'react';

const ModernistTemplate = ({ data }) => {
  return (
    <div className="bg-white w-full max-w-[210mm] mx-auto font-serif text-slate-800 print:w-[210mm] print:m-0">
      <div className="p-12 min-h-[290mm] flex flex-col print:p-10">
        
        {/* HEADER */}
        <header className="text-center mb-10 border-b-2 pb-8 border-slate-100 cv-header">
          <h1 className="text-5xl font-light tracking-[0.2em] text-slate-900 uppercase mb-4 leading-tight">
            {data.firstName} {data.lastName}
          </h1>
          <div className="flex justify-center flex-wrap gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-sans">
            <span>{data.phone}</span>
            <span className="text-emerald-500">/</span>
            <span className="lowercase font-sans">{data.email}</span>
            <span className="text-emerald-500">/</span>
            <span>{data.city}, {data.country}</span>
          </div>
          <p className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[11px] mt-6 font-sans leading-none">{data.role}</p>
        </header>

        <div className="grid grid-cols-3 gap-12 flex-1">
          {/* LEFT COLUMN: Profile, Experience, Projects, Custom Sections */}
          <div className="col-span-2 space-y-10">
            
            {/* ABOUT ME / SUMMARY */}
            <section className="print:break-inside-avoid">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 border-l-4 border-emerald-500 pl-4 font-sans">Professional Profile</h3>
              <p className="text-[13.5px] leading-relaxed text-slate-600 italic font-medium whitespace-pre-wrap">
                {data.summary || "Write a few lines about your professional journey and key achievements here."}
              </p>
            </section>

            {/* EXPERIENCE */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 border-l-4 border-emerald-500 pl-4 font-sans uppercase">Work History</h3>
              {data.experience.map((exp, i) => exp.company && (
                <div key={i} className="mb-8 last:mb-0" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <h4 className="text-lg font-bold text-slate-900 leading-tight">{exp.role}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-3 font-sans">
                    {exp.company} // {exp.startDate} — {exp.isPresent ? 'PRESENT' : exp.endDate}
                  </p>
                  <p className="text-[12px] text-slate-500 leading-relaxed pl-5 border-l border-slate-100 whitespace-pre-wrap">{exp.desc}</p>
                </div>
              ))}
            </section>

            {/* PROJECTS */}
            {data.projects && data.projects.some(p => p.title) && (
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 border-l-4 border-emerald-500 pl-4 font-sans uppercase">Key Projects</h3>
                {data.projects.map((p, i) => p.title && (
                  <div key={i} className="mb-6 last:mb-0" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className="flex justify-between items-baseline mb-1">
                        <p className="text-[14px] font-bold text-slate-800 uppercase tracking-tight">{p.title}</p>
                        <p className="text-[9px] text-emerald-500 underline font-sans lowercase font-bold">{p.link}</p>
                    </div>
                    <p className="text-[11.5px] text-slate-500 leading-snug">{p.desc}</p>
                  </div>
                ))}
              </section>
            )}

            {/* CUSTOM SECTIONS (NEWLY ADDED) */}
            {data.customSections && data.customSections.some(sec => sec.title) && (
              <section className="space-y-6">
                {data.customSections.map((sec, i) => sec.title && (
                  <div key={i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 border-l-4 border-emerald-500 pl-4 font-sans uppercase">{sec.title}</h3>
                    <p className="text-[12px] text-slate-600 leading-relaxed pl-5 whitespace-pre-wrap">{sec.content}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Skills, Education, Languages */}
          <div className="space-y-10">
            {/* SKILLS */}
            <section className="bg-slate-50 p-6 rounded-[32px] border border-slate-100" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-800 mb-6 text-center border-b pb-3 font-sans">Expertise</h3>
              <div className="space-y-4 font-sans">
                {data.hardSkills.map((s, i) => s.name && (
                  <div key={i} className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">{s.name}</span>
                    <div className="h-[2px] w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800" style={{ width: `${s.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* EDUCATION */}
            <section className="pl-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 mb-5 border-b pb-2 font-sans uppercase">Education</h3>
              {data.education.map((e, i) => e.school && (
                <div key={i} className="mb-6 last:mb-0 font-sans">
                  <p className="text-[12px] font-black text-slate-800 leading-tight uppercase italic">{e.degree}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 leading-tight">{e.school}</p>
                  {e.gpa && <p className="text-[9px] font-black text-emerald-600 mt-2 uppercase tracking-tighter">Result: {e.gpa}</p>}
                </div>
              ))}
            </section>

            {/* LANGUAGES (NEWLY ADDED) */}
            {data.languages && data.languages.some(l => l.name) && (
              <section className="pl-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 mb-5 border-b pb-2 font-sans uppercase">Languages</h3>
                <div className="space-y-2">
                  {data.languages.map((l, i) => l.name && (
                    <p key={i} className="text-[11px] font-bold text-slate-600 uppercase">
                      • {l.name} <span className="text-[9px] text-slate-400 font-normal ml-1">({l.level})</span>
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernistTemplate;