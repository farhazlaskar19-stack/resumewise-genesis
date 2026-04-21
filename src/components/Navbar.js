import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

function useOutsideClick(ref, onOutside) {
  useEffect(() => {
    function onDown(e) {
      const el = ref.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      onOutside?.();
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [ref, onOutside]);
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.35)]">
        <div className="w-5 h-5 border-2 border-white/90 rounded-sm rotate-45 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg md:text-xl font-black italic tracking-tighter text-white uppercase">
          Resume<span className="text-indigo-500">Wise</span>
        </span>
        <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.5em] text-slate-500">
          Genesis Engine
        </span>
      </div>
    </div>
  );
}

export default function Navbar({ className = '', rightCta = true }) {
  const navigate = useNavigate();
  const { user, displayName } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const rootRef = useRef(null);

  useOutsideClick(rootRef, () => {
    setMobileOpen(false);
    setUserOpen(false);
  });

  useEffect(() => {
    function onEsc(e) {
      if (e.key !== 'Escape') return;
      setMobileOpen(false);
      setUserOpen(false);
    }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const initials = useMemo(() => {
    const parts = (displayName || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'U';
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }, [displayName]);

  async function doLogout() {
    try {
      await signOut(auth);
    } finally {
      navigate('/', { replace: true });
    }
  }

  return (
    <nav
      ref={rootRef}
      className={`w-full px-4 sm:px-6 md:px-10 py-4 border-b border-white/10 bg-[#020617]/80 backdrop-blur-2xl ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 hover:opacity-90 transition-opacity">
          <LogoMark />
        </Link>

        <div className="flex items-center gap-3">
          {rightCta ? (
            <button
              onClick={() => navigate('/select')}
              className="hidden md:inline-flex px-6 py-3 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-xl"
            >
              Create CV
            </button>
          ) : null}

          {!user ? (
            <>
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest text-indigo-300 hover:text-white hover:bg-indigo-600/20 transition-all"
                >
                  Sign up
                </Link>
              </div>

              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="sm:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserOpen((s) => !s)}
                className="hidden sm:inline-flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                aria-label="Open user menu"
                aria-expanded={userOpen}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black tracking-widest text-indigo-200">
                  {initials}
                </div>
                <div className="max-w-[180px] truncate text-[10px] font-black uppercase tracking-widest text-white/80">
                  {displayName}
                </div>
                <svg className={`w-4 h-4 text-white/50 transition-transform ${userOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="sm:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {userOpen ? (
                <div className="hidden sm:block absolute right-0 mt-3 w-64 bg-[#0b1222] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-4 border-b border-white/10">
                    <div className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">Signed in as</div>
                    <div className="mt-2 text-sm font-bold text-white truncate">{displayName}</div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        navigate('/blueprints');
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                    >
                      My Blueprints
                    </button>
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                    >
                      Account Settings
                    </button>
                    <div className="my-2 h-px bg-white/10" />
                    <button
                      onClick={doLogout}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-200 hover:text-white transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div className="sm:hidden mt-4">
          <div className="max-w-7xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            {!user ? (
              <div className="p-3 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest text-white/70"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl font-black text-[9px] uppercase tracking-widest text-indigo-200"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30">Signed in as</div>
                  <div className="mt-1 text-sm font-bold text-white truncate">{displayName}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black tracking-widest text-indigo-200 shrink-0">
                  {initials}
                </div>
              </div>
            )}

            <div className="p-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/select');
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white"
              >
                Design Your Blueprint
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/blueprints');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white"
                  >
                    My Blueprints
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white"
                  >
                    Account Settings
                  </button>
                  <div className="my-2 h-px bg-white/10" />
                  <button
                    onClick={doLogout}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-200 hover:text-white"
                  >
                    Log Out
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

