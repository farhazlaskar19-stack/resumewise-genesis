import React from 'react';

const SimpleTemplate = ({ data }) => {
  return (
    /* We lock the font to a clean 'sans' for ATS readability */
    <div className="bg-white w-full max-w-[210mm] mx-auto font-sans text-slate-900 print:w-full print:m-0 print:text-black">
      <div className="p-16 min-h-[297mm] flex flex-col print:p-10">
        
        {/* HEADER: Centered with minimal spacing */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-1 print:text-black">
            {data.firstName} {data.lastName}
          </h1>
          
          <div className="flex justify-center flex-wrap gap-x-3 text-[11px] font-medium text-slate-600 tracking-wider font-mono print:text-black">
            <span>{data.phone}</span>
            <span>|</span>
            <span className="lowercase font-sans font-normal">{data.email}</span>
            <span>|</span>
            <span>{data.city}, {data.country}</span>
          </div>
          <p className="text-slate-800 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 print:text-black">{data.role}</p>
        </header>

        <div className="space-y-8">
          
          {/* 1. PROFESSIONAL SUMMARY */}
          {data.summary && (
            <section className="print:break-inside-avoid">
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-1.5 pb-0.5 border-b-2 border-slate-900 print:text-black print:border-black">Summary</h2>
              <p className="text-[13px] leading-relaxed text-slate-800 whitespace-pre-wrap font-medium print:text-black">{data.summary}</p>
            </section>
          )}

          {/* 2. SKILLS (EXPERTISE) - Matching the plain text list style */}
          <section>
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-2 pb-0.5 border-b-2 border-slate-900 print:text-black print:border-black">Expertise</h2>
              <div className="text-[12.5px] leading-relaxed text-slate-800 print:text-black font-medium">
                  {data.hardSkills.map((s, i) => s.name && (
                      <span key={i} className="after:content-[',_'] last:after:content-[''] after:text-slate-400">
                          {s.name}
                      </span>
                  ))}
              </div>
          </section>

          {/* 3. EXPERIENCE */}
          <section>
            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4 pb-0.5 border-b-2 border-slate-900 print:text-black print:border-black">Experience</h2>
            {data.experience.map((exp, i) => exp.company && (
              <div key={i} className="mb-6 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-[15px] font-bold text-slate-950 uppercase tracking-tight print:text-black">{exp.role}</h3>
                  <span className="text-[11px] font-black text-slate-600 tracking-wider uppercase font-mono print:text-black">{exp.startDate} – {exp.isPresent ? 'PRESENT' : exp.endDate}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest print:text-black">{exp.company} | {exp.location}</p>
                <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap font-medium print:text-black">{exp.desc}</p>
              </div>
            ))}
          </section>

          {/* 4. PROJECTS */}
          {data.projects && data.projects.some(p => p.title) && (
            <section style={{ pageBreakInside: 'avoid' }}>
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4 pb-0.5 border-b-2 border-slate-900 print:text-black print:border-black">Projects</h2>
              <div className="space-y-5">
                {data.projects.map((p, i) => p.title && (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="text-[13px] font-bold text-slate-900 uppercase print:text-black">{p.title}</p>
                      <p className="text-[10px] text-slate-500 underline lowercase italic font-mono print:text-black">{p.link}</p>
                    </div>
                    <p className="text-[12.5px] text-slate-600 italic font-medium print:text-black leading-tight">{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. EDUCATION */}
          <section>
              <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4 pb-0.5 border-b-2 border-slate-900 print:text-black print:border-black">Education</h2>
              {data.education.map((edu, i) => edu.school && (
                <div key={i} className="mb-5 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-baseline">
                    <p className="text-[14px] font-bold text-slate-900 uppercase tracking-tight print:text-black leading-tight">{edu.degree} | {edu.field}</p>
                    <p className="text-[10px] text-slate-500 font-black tracking-widest font-mono print:text-black">{edu.startDate} – {edu.endDate}</p>
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest print:text-black">{edu.school}</p>
                    {edu.gpa && <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider print:text-black">Grade: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
          </section>

          {/* 6. LANGUAGES & CUSTOM SECTIONS (Broad, simple list) */}
          <div className="grid grid-cols-2 gap-10">
            {data.languages.some(l => l.name) && (
              <section style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-3 pb-0.5 border-b-2 border-slate-900 print:text-black print:border-black">Languages</h2>
                <div className="text-[12.5px] leading-relaxed text-slate-800 print:text-black font-medium">
                  {data.languages.map((l, i) => l.name && (
                    <span key={i} className="after:content-[',_'] last:after:content-[''] after:text-slate-400">
                      {l.name} <span className="text-[10px] text-slate-400 font-normal ml-0.5">({l.level})</span>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {data.customSections.some(sec => sec.title) && (
              <section className="space-y-6">
                {data.customSections.map((sec, i) => sec.title && (
                  <div key={i} style={{ pageBreakInside: 'avoid' }}>
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900 mb-3 pb-0.5 border-b-2 border-slate-900 print:text-black print:border-black">{sec.title}</h2>
                    <p className="text-[12px] text-slate-700 leading-relaxed italic whitespace-pre-wrap font-medium print:text-black">{sec.content}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SimpleTemplate;