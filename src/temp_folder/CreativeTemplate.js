import React from 'react';

const CreativeTemplate = ({ data }) => {
  return (
    <div className="bg-white w-full max-w-[210mm] mx-auto font-sans relative print:m-0">
      
      {/* Side Borders that continue across pages */}
      <div className="border-x-[12px] border-emerald-500 min-h-[297mm] px-10 py-12 flex flex-col print:border-x-[10px] print:p-8">
        
        {/* TOP BORDER (First Page Only) */}
        <div className="border-t-[12px] border-emerald-500 absolute top-0 left-0 w-full no-print"></div>

        <header className="text-center mb-10 border-b-4 border-emerald-500 pb-8">
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic mb-2">
            {data.firstName} <span className="text-emerald-500">{data.lastName}</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">{data.role}</p>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-10 border-b pb-6 border-slate-100 text-center">
            <div><p className="text-[9px] font-black uppercase text-emerald-500 mb-1">Contact</p><p className="text-[11px] font-bold">{data.phone}</p></div>
            <div><p className="text-[9px] font-black uppercase text-emerald-500 mb-1">Email</p><p className="text-[11px] font-bold lowercase break-all">{data.email}</p></div>
            <div><p className="text-[9px] font-black uppercase text-emerald-500 mb-1">Location</p><p className="text-[11px] font-bold">{data.city}, {data.country}</p></div>
        </div>

        <div className="space-y-10">
          <section className="grid grid-cols-4 gap-6" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="text-lg font-black uppercase italic text-slate-900 leading-none">The Story<br/><span className="text-emerald-500">So Far</span></h2>
            <p className="col-span-3 text-[12.5px] leading-relaxed text-slate-600 border-l-2 border-emerald-100 pl-6 italic font-medium whitespace-pre-wrap">
                "{data.summary}"
            </p>
          </section>

          <section>
             <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6 border-b pb-2 text-right italic font-black">Professional Experience //</h2>
             {data.experience.map((exp, i) => exp.company && (
                 <div key={i} className="mb-8 last:mb-0" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{exp.role}</h3>
                        <span className="text-[9px] font-black bg-slate-900 text-white px-2 py-1 rounded">
                            {exp.startDate} – {exp.isPresent ? 'PRESENT' : exp.endDate}
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3">{exp.company} | {exp.location}</p>
                    <p className="text-[12px] text-slate-500 leading-relaxed border-l border-slate-100 pl-4 whitespace-pre-wrap">{exp.desc}</p>
                 </div>
             ))}
          </section>

          <section className="grid grid-cols-2 gap-10" style={{ pageBreakInside: 'avoid' }}>
              <div>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4 border-b pb-2 italic font-black">Technical Skills //</h2>
                  <div className="grid grid-cols-1 gap-y-3">
                      {data.hardSkills.map((s, i) => s.name && (
                          <div key={i} className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">{s.name}</span>
                              <div className="h-1 bg-slate-100 w-full rounded-full mt-1">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.level}%` }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div>
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4 border-b pb-2 italic font-black">Languages //</h2>
                  <div className="space-y-2">
                      {data.languages.map((l, i) => l.name && (
                          <p key={i} className="text-[11px] font-bold text-slate-700 uppercase">
                              <span className="text-emerald-500 mr-2">■</span>{l.name} — <span className="text-slate-400 font-normal">{l.level}</span>
                          </p>
                      ))}
                  </div>
              </div>
          </section>

          {data.projects && data.projects.some(p => p.title) && (
            <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
               <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6 border-b pb-2 text-right italic font-black">Portfolio Projects //</h2>
               <div className="grid grid-cols-1 gap-4">
                  {data.projects.map((p, i) => p.title && (
                    <div key={i} className="p-5 bg-slate-50 rounded-xl border-l-[6px] border-emerald-500">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-black text-slate-800 text-xs uppercase tracking-widest">{p.title}</p>
                        <p className="text-[9px] text-emerald-600 underline lowercase italic font-bold">{p.link}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight italic">{p.desc}</p>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {data.customSections && data.customSections.some(sec => sec.title) && (
              <section className="space-y-8">
                  {data.customSections.map((sec, i) => sec.title && (
                      <div key={i} style={{ pageBreakInside: 'avoid' }}>
                          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4 border-b pb-2 text-right italic font-black">{sec.title} //</h2>
                          <p className="text-[12px] text-slate-600 leading-relaxed whitespace-pre-wrap italic pl-4 border-l border-emerald-50">
                              {sec.content}
                          </p>
                      </div>
                  ))}
              </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;