import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function fetchUserProfile(uid) {
  if (!uid) throw new Error('fetchUserProfile: uid is required');
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return { exists: false, profile: null, raw: null };
  const raw = snap.data();
  return { exists: true, profile: raw || null, raw };
}

export async function upsertUserProfile(uid, profilePatch) {
  if (!uid) throw new Error('upsertUserProfile: uid is required');
  await setDoc(
    doc(db, 'users', uid),
    {
      ...profilePatch,
      uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

