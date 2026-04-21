import React, { useMemo } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';

export default function AccountSettings() {
  const { user, displayName } = useAuth();

  const email = user?.email || '';
  const uid = user?.uid || '';

  const avatarText = useMemo(() => {
    const parts = (displayName || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'U';
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }, [displayName]);

  async function ensureUserDoc() {
    if (!uid) return;
    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          uid,
          email,
          fullName: displayName || '',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Profile</div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">Account Settings</h1>
          <p className="text-slate-400 text-sm md:text-lg italic max-w-2xl">
            Your account is managed by Firebase Authentication. Your display name is used across the dashboard.
          </p>
        </div>

        <div className="mt-10 bg-white/[0.03] border border-white/10 rounded-[28px] md:rounded-[36px] p-6 md:p-10 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-sm font-black tracking-widest text-indigo-100 shrink-0">
              {avatarText}
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Name</div>
              <div className="mt-1 text-xl font-black truncate">{displayName}</div>
              <div className="mt-3 text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Email</div>
              <div className="mt-1 text-sm text-white/80 truncate">{email}</div>
              <div className="mt-3 text-[9px] font-black uppercase tracking-[0.4em] text-white/30">User ID</div>
              <div className="mt-1 text-xs text-white/50 break-all">{uid}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={ensureUserDoc}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] text-white/80 transition-all active:scale-[0.99]"
            >
              Sync Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

