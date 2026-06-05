import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendResetEmail, friendlyAuthError } from '../services/authService';

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
          Account Recovery
        </span>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');

    setSubmitting(true);
    try {
      await sendResetEmail(email);
      setSent(true);
    } catch (err) {
      setError(friendlyAuthError(err, 'Could not send the reset email. Please try again.'));
    } finally {
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

        <div className="mt-14 md:mt-20 max-w-lg mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-[32px] md:rounded-[44px] p-8 md:p-10 backdrop-blur-3xl shadow-2xl">
            <div className="space-y-3 mb-8">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                Reset Password
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-[0.95]">
                Recover access.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed italic">
                Enter the email linked to your account and we&apos;ll send you a secure link to reset your password.
              </p>
            </div>

            {sent ? (
              <div className="space-y-6">
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-200 text-[13px] leading-relaxed">
                  ✅ A password reset link has been sent to <span className="font-bold">{email.trim()}</span>.
                  Check your inbox (and spam folder) and follow the link to set a new password.
                </div>
                <Link
                  to="/login"
                  className="block text-center w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.35em] shadow-[0_0_40px_rgba(99,102,241,0.35)] transition-all active:scale-[0.99]"
                >
                  Back to Login
                </Link>
                <button
                  onClick={() => { setSent(false); setError(''); }}
                  className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors"
                >
                  Use a different email
                </button>
              </div>
            ) : (
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

                {error ? (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-200 text-[12px] leading-relaxed">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:hover:bg-indigo-600 rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.35em] shadow-[0_0_40px_rgba(99,102,241,0.35)] transition-all active:scale-[0.99]"
                >
                  {submitting ? 'Sending…' : 'Send Reset Link'}
                </button>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <Link to="/login" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors">
                    ← Back to login
                  </Link>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    No account?{' '}
                    <Link to="/signup" className="text-indigo-400 hover:text-white transition-colors">
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
