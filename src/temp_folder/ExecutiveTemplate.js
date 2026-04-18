import React from 'react';

const ExecutiveTemplate = ({ data }) => {
  return (
    /* Added print-master-container to match the new CSS */
    <div className="flex print-master-container min-h-[297mm] bg-white w-full max-w-[210mm] mx-auto overflow-hidden shadow-none">
      
      {/* SIDEBAR - Fixed 30% width for Print stability */}
      <div className="w-[30%] bg-[#1a1c23] text-white p-8 flex flex-col shrink-0 min-h-[297mm] print:w-[30%]">
        <div className="w-full aspect-square bg-[#2b2e3a] rounded-2xl mb-8 overflow-hidden border-2 border-[#2b2e3a]">
          {data.photo && <img src={data.photo} className="w-full h-full object-cover" alt="Profile" />}
        </div>
        
        <div className="space-y-8">
          <section>
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 border-b border-gray-700 pb-1 mb-4">Contact</h5>
            <div className="text-[10px] space-y-3 opacity-90 font-light leading-tight break-words">
              <p>{data.phone}</p>
              <p>{data.email}</p>
              <p>{data.address}</p>
              <p className="font-bold text-white uppercase">{data.city}, {data.country}</p>
            </div>
          </section>

          <section>
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 border-b border-gray-700 pb-1 mb-4">Expertise</h5>
            <div className="space-y-4">
              {data.hardSkills.map((s, i) => s.name && (
                <div key={i}>
                  <div className="flex justify-between text-[8px] font-bold uppercase mb-1"><span>{s.name}</span></div>
                  <div className="h-1 bg-[#2b2e3a] w-full rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {data.languages.some(l => l.name) && (
            <section>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 border-b border-gray-700 pb-1 mb-4">Languages</h5>
              {data.languages.map((l, i) => l.name && <p key={i} className="text-[9px] font-medium mb-1 opacity-80 uppercase">{l.name} — {l.level}</p>)}
            </section>
          )}
        </div>
      </div>

      {/* MAIN CONTENT - Fixed 70% width for Print stability */}
      <div className="w-[70%] p-12 bg-white flex flex-col min-h-[297mm] print:w-[70%] print:p-10">
        <header className="mb-10">
          <h1 className="text-[42px] font-black text-[#1a1c23] uppercase tracking-tighter leading-none mb-3">
            {data.firstName} <br/> {data.lastName}
          </h1>
          <div className="h-1.5 w-16 bg-emerald-500 mb-4"></div>
          <p className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[11px]">{data.role}</p>
        </header>

        {data.summary && (
          <section className="mb-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b mb-4 pb-1">Professional Profile</h2>
            <p className="text-[12px] text-gray-700 leading-relaxed font-normal italic whitespace-pre-wrap">"{data.summary}"</p>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b mb-6 pb-1">Experience</h2>
          {data.experience.map((exp, i) => exp.company && (
            <div key={i} className="mb-8 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
              <div className="flex justify-between items-baseline font-bold text-[#1a1c23] text-[14px] uppercase tracking-tighter">
                <span>{exp.role}</span>
                <span className="text-emerald-600 text-[10px] font-black">{exp.startDate} – {exp.isPresent ? 'PRESENT' : exp.endDate}</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">{exp.company} | {exp.location}</p>
              <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-gray-100">{exp.desc}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b mb-6 pb-1">Education</h2>
          {data.education.map((edu, i) => edu.school && (
            <div key={i} className="mb-6 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
              <div className="flex justify-between items-baseline font-bold text-[#1a1c23] text-[14px] uppercase tracking-tighter">
                <span>{edu.degree} | {edu.field}</span>
                <span className="text-gray-400 text-[10px] font-black tracking-widest">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{edu.school}</p>
                {edu.gpa && <p className="text-[9px] font-black text-emerald-600 uppercase">Grade: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </section>

        {data.projects.some(p => p.title) && (
          <section className="mb-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b mb-6 pb-1">Key Projects</h2>
            {data.projects.map((proj, i) => proj.title && (
              <div key={i} className="mb-5 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex justify-between items-baseline font-bold text-[#1a1c23] text-[13px] uppercase tracking-tighter">
                  <span>{proj.title}</span>
                  <span className="text-emerald-600 text-[9px] underline lowercase italic">{proj.link}</span>
                </div>
                <p className="text-[10.5px] text-gray-500 mt-1 pl-3 border-l-2 border-emerald-50">{proj.desc}</p>
              </div>
            ))}
          </section>
        )}

        {/* --- ADDED CUSTOM SECTIONS --- */}
        {data.customSections && data.customSections.some(sec => sec.title) && (
          <section className="mb-10">
            {data.customSections.map((sec, i) => sec.title && (
              <div key={i} className="mb-6 last:mb-0" style={{ pageBreakInside: 'avoid' }}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 border-b mb-4 pb-1">{sec.title}</h2>
                <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-gray-100">{sec.content}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;