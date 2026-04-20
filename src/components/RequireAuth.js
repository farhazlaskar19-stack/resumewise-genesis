import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            Establishing Session…
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}

