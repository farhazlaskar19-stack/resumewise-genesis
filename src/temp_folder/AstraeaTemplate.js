import React, { useState } from 'react';

const AstraeaTemplate = ({ data }) => {
  const [accentColor, setAccentColor] = useState('#2D3748');

  const getTextColor = (bgColor) => {
    const lightColors = ['#0EA5E9', '#10B981'];
    return lightColors.includes(bgColor) ? '#1a1c23' : '#ffffff';
  };

  const sideTextColor = getTextColor(accentColor);

  return (
    /* We add print:block to prevent Flexbox from collapsing columns in PDF */
    <div className="bg-white w-full max-w-[210mm] mx-auto overflow-hidden shadow-none font-sans relative flex print:flex print:flex-row">
      
      {/* --- Color Picker --- */}
      <div className="absolute top-4 right-4 flex gap-2 no-print z-50">
        {[
          { name: 'Deep Slate', color: '#2D3748' },
          { name: 'Sky Blue', color: '#0EA5E9' },
          { name: 'Emerald', color: '#10B981' },
          { name: 'Midnight', color: '#1a1c23' },
          { name: 'Crimson', color: '#991B1B' },
        ].map((c) => (
          <button key={c.name} onClick={() => setAccentColor(c.color)} className="w-6 h-6 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" style={{ backgroundColor: c.color }} />
        ))}
      </div>

      {/* SIDEBAR - Hard-locked width for print */}
      <div 
        className="w-[32%] p-8 flex flex-col shrink-0 min-h-[297mm] print:min-w-[32%] print:w-[32%] transition-colors duration-500" 
        style={{ backgroundColor: accentColor, color: sideTextColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        <header className="mb-10">
          <h1 className="text-[28px] font-black uppercase tracking-tighter leading-none mb-2">{data.firstName} <br/> {data.lastName}</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{data.role}</p>
        </header>

        <div className="w-full aspect-square rounded-2xl mb-8 overflow-hidden border-2 border-white/20 shadow-xl">
          {data.photo && <img src={data.photo} className="w-full h-full object-cover" alt="Profile" />}
        </div>
        
        <div className="space-y-8">
          <section>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/20 pb-1">Details</h5>
            <div className="text-[10px] space-y-3 opacity-90 font-medium leading-tight">
              <p className="break-all">{data.email}</p>
              <p>{data.phone}</p>
              <p className="uppercase">{data.city}, {data.country}</p>
            </div>
          </section>

          <section>
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/20 pb-1">Skills</h5>
            <div className="space-y-2">
              {data.hardSkills.map((s, i) => s.name && (
                <p key={i} className="text-[10px] font-bold uppercase tracking-tight">• {s.name}</p>
              ))}
            </div>
          </section>

          {data.languages.some(l => l.name) && (
            <section>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 border-b border-white/20 pb-1">Languages</h5>
              {data.languages.map((l, i) => l.name && <p key={i} className="text-[10px] font-medium mb-1 opacity-90 uppercase">{l.name} — {l.level}</p>)}
            </section>
          )}
        </div>
      </div>

      {/* MAIN CONTENT - Ensures it takes up the remaining 68% */}
      <div className="w-[68%] p-12 bg-white flex flex-col min-h-[297mm] print:w-[68%] print:min-w-[68%]">
        {data.summary && (
          <section className="mb-10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 border-b pb-1">Summary</h2>
            <p className="text-[13px] text-slate-700 leading-relaxed font-medium italic whitespace-pre-wrap">{data.summary}</p>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-1">Experience</h2>
          {data.experience.map((exp, i) => exp.company && (
            <div key={i} className="mb-8 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">{exp.role}</h3>
                <span className="text-[10px] font-bold text-slate-400">{exp.startDate} – {exp.isPresent ? 'PRESENT' : exp.endDate}</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>{exp.company} | {exp.location}</p>
              <p className="text-[12px] text-slate-500 leading-relaxed pl-4 border-l-2 border-slate-100 whitespace-pre-wrap">{exp.desc}</p>
            </div>
          ))}
        </section>

        <section className="mb-10" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-1">Education</h2>
          {data.education.map((edu, i) => edu.school && (
            <div key={i} className="mb-6 last:mb-0">
              <p className="text-[14px] font-black text-slate-900 uppercase italic">{edu.degree}</p>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                <span>{edu.school}</span>
                <span>{edu.startDate} – {edu.endDate}</span>
              </div>
              {edu.gpa && <p className="text-[10px] font-black mt-1" style={{ color: accentColor }}>Result: {edu.gpa}</p>}
            </div>
          ))}
        </section>

        {data.customSections.some(sec => sec.title) && (
          <section className="space-y-8">
            {data.customSections.map((sec, i) => sec.title && (
              <div key={i} style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 border-b pb-1">{sec.title}</h2>
                <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap italic">{sec.content}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default AstraeaTemplate;