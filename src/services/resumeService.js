import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

function normalizeResumeDoc(raw) {
  const remote = raw || {};
  const remoteData =
    remote?.data && typeof remote.data === 'object'
      ? remote.data
      : remote; // legacy shape: data stored at root

  const template = typeof remote?.template === 'string' ? remote.template : undefined;

  return { data: remoteData, template };
}

export async function fetchUserResume(uid) {
  if (!uid) throw new Error('fetchUserResume: uid is required');
  const snap = await getDoc(doc(db, 'resumes', uid));
  if (!snap.exists()) return { exists: false, data: null, template: null, raw: null };

  const raw = snap.data();
  const normalized = normalizeResumeDoc(raw);
  return {
    exists: true,
    data: normalized.data || null,
    template: normalized.template || null,
    raw,
  };
}

export async function saveUserResume(uid, resumeData) {
  if (!uid) throw new Error('saveUserResume: uid is required');
  await setDoc(
    doc(db, 'resumes', uid),
    {
      ...resumeData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

