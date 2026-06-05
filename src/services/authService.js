import {
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { auth } from '../lib/firebase';
import { fetchUserProfile, upsertUserProfile } from './userService';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in (or sign up) with a Google account via popup.
 * Ensures a matching user profile document exists in Firestore.
 * @returns {Promise<import('firebase/auth').User>} the signed-in user
 */
export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;

  // Create the Firestore profile on first sign-in; never overwrite an existing one.
  try {
    const existing = await fetchUserProfile(user.uid);
    if (!existing.exists) {
      await upsertUserProfile(user.uid, {
        fullName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        provider: 'google',
        createdAt: serverTimestamp(),
      });
    }
  } catch (e) {
    // Non-fatal: auth succeeded even if the profile write fails (offline/rules).
  }

  return user;
}

/**
 * Send a password-reset email to the given address.
 * @param {string} email
 */
export async function sendResetEmail(email) {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Map Firebase auth error codes to friendly, user-facing messages.
 * @param {{code?: string, message?: string}} err
 * @param {string} fallback
 */
export function friendlyAuthError(err, fallback = 'Something went wrong. Please try again.') {
  switch (err?.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
      return 'No account found with that email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password is too weak (use at least 6 characters).';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Please allow popups and retry.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return err?.message || fallback;
  }
}
