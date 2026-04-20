import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.35)]">
        <div className="w-5 h-5 border-2 border-white/90 rounded-sm rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black italic tracking-tighter text-white uppercase">
          Resume<span className="text-indigo-500">Wise</span>
        </span>
        <span className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-500">
          Secure Access Portal
        </span>
      </div>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigate('/select', { replace: true });
    } catch (err) {
      setError(err?.message || 'Signup failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-500/10 rounded-full blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <LogoMark />
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            Login
          </Link>
        </div>

        <div className="mt-14 md:mt-20 grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-indigo-300">
                Create Identity
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.95]">
              Build your
              <br />
              Secure Vault.
            </h1>
            <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-xl italic">
              Create an account to store your resume blueprint in the cloud and continue anytime.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-[32px] md:rounded-[44px] p-8 md:p-10 backdrop-blur-3xl shadow-2xl">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-[13px] font-medium placeholder:text-white/10"
                  placeholder="you@domain.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-[13px] font-medium placeholder:text-white/10"
                    placeholder="Min 6 chars"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Confirm
                  </label>
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type="password"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 bg-slate-900/40 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-[13px] font-medium placeholder:text-white/10"
                    placeholder="Repeat"
                  />
                </div>
              </div>

              {error ? (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-200 text-[12px] leading-relaxed">
                  {error}
                </div>
              ) : (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-[11px] leading-relaxed">
                  By creating an account you can sync your resume blueprint to Firestore (keyed to your user id).
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:hover:bg-indigo-600 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.35em] shadow-[0_0_40px_rgba(99,102,241,0.35)] transition-all active:scale-[0.99]"
              >
                {submitting ? 'Creating…' : 'Sign Up'}
              </button>

              <div className="flex items-center justify-between gap-4 pt-2">
                <Link to="/" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors">
                  ← Back
                </Link>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                  Already have one?{' '}
                  <Link to="/login" className="text-indigo-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

