import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { fetchUserProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser || null);
      setProfile(null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      if (!user?.uid) return;
      try {
        const res = await fetchUserProfile(user.uid);
        if (cancelled) return;
        if (res.exists) setProfile(res.profile);
      } catch (e) {
        // ignore
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const displayName =
    user?.displayName ||
    profile?.fullName ||
    (user?.email ? user.email.split('@')[0] : 'Account');

  const value = useMemo(
    () => ({ user, profile, displayName, loading }),
    [user, profile, displayName, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

