import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Generate unique blueprint ID
export function generateBlueprintId() {
  return `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create metadata for blueprint
export function createBlueprintMetadata(templateId, name = 'Untitled Blueprint') {
  return {
    name,
    status: 'Incomplete', // 'Incomplete' or 'Complete'
    lastModified: serverTimestamp(),
    templateId,
    createdAt: serverTimestamp(),
  };
}

// Fetch a specific blueprint by ID
export async function fetchBlueprint(uid, blueprintId) {
  if (!uid || !blueprintId) throw new Error('fetchBlueprint: uid and blueprintId are required');
  const snap = await getDoc(doc(db, 'users', uid, 'blueprints', blueprintId));
  if (!snap.exists()) return { exists: false, data: null, template: null, metadata: null, raw: null };

  const raw = snap.data();
  return {
    exists: true,
    data: raw.data || null,
    template: raw.template || null,
    metadata: raw.metadata || null,
    raw,
    id: blueprintId,
  };
}

// Fetch all blueprints for a user
export async function fetchAllBlueprints(uid) {
  if (!uid) throw new Error('fetchAllBlueprints: uid is required');
  const q = query(collection(db, 'users', uid, 'blueprints'));
  const snap = await getDocs(q);
  
  const blueprints = [];
  snap.forEach(doc => {
    const data = doc.data();
    blueprints.push({
      id: doc.id,
      data: data.data || null,
      template: data.template || null,
      metadata: data.metadata || null,
      raw: data,
    });
  });
  
  return blueprints;
}

// Save/update a blueprint
export async function saveBlueprint(uid, blueprintId, blueprintData) {
  if (!uid || !blueprintId) throw new Error('saveBlueprint: uid and blueprintId are required');
  
  const docRef = doc(db, 'users', uid, 'blueprints', blueprintId);
  await setDoc(docRef, {
    ...blueprintData,
    metadata: {
      ...blueprintData.metadata,
      lastModified: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// Create a new blueprint
export async function createBlueprint(uid, templateId, initialData = {}) {
  if (!uid || !templateId) throw new Error('createBlueprint: uid and templateId are required');
  
  const blueprintId = generateBlueprintId();
  const metadata = createBlueprintMetadata(templateId);
  
  await setDoc(doc(db, 'users', uid, 'blueprints', blueprintId), {
    template: templateId,
    data: initialData,
    metadata,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return blueprintId;
}

// Duplicate a blueprint
export async function duplicateBlueprint(uid, sourceBlueprintId, newName) {
  if (!uid || !sourceBlueprintId) throw new Error('duplicateBlueprint: uid and sourceBlueprintId are required');
  
  const source = await fetchBlueprint(uid, sourceBlueprintId);
  if (!source.exists) throw new Error('Source blueprint not found');
  
  const newBlueprintId = generateBlueprintId();
  const metadata = createBlueprintMetadata(source.template, newName || `${source.metadata?.name || 'Untitled'} (Copy)`);
  
  await setDoc(doc(db, 'users', uid, 'blueprints', newBlueprintId), {
    template: source.template,
    data: source.data,
    metadata,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return newBlueprintId;
}

// Delete a blueprint
export async function deleteBlueprint(uid, blueprintId) {
  if (!uid || !blueprintId) throw new Error('deleteBlueprint: uid and blueprintId are required');
  await deleteDoc(doc(db, 'users', uid, 'blueprints', blueprintId));
}

// Update blueprint status
export async function updateBlueprintStatus(uid, blueprintId, status) {
  if (!uid || !blueprintId) throw new Error('updateBlueprintStatus: uid and blueprintId are required');
  
  const docRef = doc(db, 'users', uid, 'blueprints', blueprintId);
  await updateDoc(docRef, {
    'metadata.status': status,
    'metadata.lastModified': serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Legacy functions for backward compatibility
export async function fetchUserResume(uid) {
  if (!uid) throw new Error('fetchUserResume: uid is required');
  // For legacy compatibility, fetch the most recent blueprint
  const blueprints = await fetchAllBlueprints(uid);
  if (blueprints.length === 0) return { exists: false, data: null, template: null, metadata: null, raw: null };
  
  // Return the most recently modified blueprint
  const mostRecent = blueprints.sort((a, b) => 
    (b.metadata?.lastModified?.toMillis?.() || 0) - (a.metadata?.lastModified?.toMillis?.() || 0)
  )[0];
  
  return mostRecent;
}

export async function saveUserResume(uid, resumeData) {
  if (!uid) throw new Error('saveUserResume: uid is required');
  // For legacy compatibility, save to the most recent blueprint or create a new one
  const blueprints = await fetchAllBlueprints(uid);
  
  if (blueprints.length > 0) {
    // Update the most recent blueprint
    const mostRecent = blueprints.sort((a, b) => 
      (b.metadata?.lastModified?.toMillis?.() || 0) - (a.metadata?.lastModified?.toMillis?.() || 0)
    )[0];
    await saveBlueprint(uid, mostRecent.id, resumeData);
  } else {
    // Create a new blueprint
    await createBlueprint(uid, resumeData.template || 'executive', resumeData.data || {});
  }
}

