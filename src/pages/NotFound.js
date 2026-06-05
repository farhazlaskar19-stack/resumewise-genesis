import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Error 404</div>
        <h1 className="mt-4 text-6xl md:text-8xl font-black italic tracking-tighter">404</h1>
        <p className="mt-4 text-slate-400 text-base md:text-lg italic">
          This page drifted off into space. The link may be broken or the page moved.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] transition-all active:scale-[0.99]"
          >
            Back Home
          </Link>
          <Link
            to="/blueprints"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] text-white/80 transition-all active:scale-[0.99]"
          >
            My Resumes
          </Link>
        </div>
      </div>
    </div>
  );
}
