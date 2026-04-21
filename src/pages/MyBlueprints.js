import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { fetchUserResume } from '../services/resumeService';

export default function MyBlueprints() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const r = await fetchUserResume(user.uid);
        if (cancelled) return;
        setResume(r.exists ? r : null);
      } catch (e) {
        if (!cancelled) setResume(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const hasBlueprint = useMemo(() => {
    return !!resume?.data;
  }, [resume]);

  const template = resume?.template || 'executive';

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Dashboard</div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">My Blueprints</h1>
          <p className="text-slate-400 text-sm md:text-lg italic max-w-2xl">
            Your most recent resume blueprint is stored securely in Firestore (per account).
          </p>
        </div>

        <div className="mt-10 bg-white/[0.03] border border-white/10 rounded-[28px] md:rounded-[36px] p-6 md:p-10 backdrop-blur-3xl shadow-2xl">
          {loading ? (
            <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.35em]">Loading…</div>
          ) : hasBlueprint ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
                  Recent Blueprint
                </div>
                <div className="text-xl md:text-2xl font-black tracking-tight">
                  Template: <span className="text-indigo-300">{template}</span>
                </div>
                <div className="text-slate-400 text-sm">
                  Continue editing from where you left off.
                </div>
              </div>
              <button
                onClick={() => navigate(`/editor?template=${encodeURIComponent(template)}`)}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] shadow-[0_0_40px_rgba(99,102,241,0.35)] transition-all active:scale-[0.99]"
              >
                Continue Recent Blueprint
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">No Blueprints Yet</div>
                <div className="text-slate-400 text-sm md:text-base italic">
                  Start a new blueprint to see it here.
                </div>
              </div>
              <button
                onClick={() => navigate('/select')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] text-white/80 transition-all active:scale-[0.99]"
              >
                Start from Scratch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

