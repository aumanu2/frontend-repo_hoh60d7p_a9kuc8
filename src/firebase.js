// Firebase initialization
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const provider = new GoogleAuthProvider()

export async function signIn() {
  await signInWithPopup(auth, provider)
}

export async function signOut() {
  await fbSignOut(auth)
}

export function watchUser(callback) {
  return onAuthStateChanged(auth, callback)
}

export async function saveScan(uid, payload) {
  const scans = collection(db, 'scans')
  const doc = await addDoc(scans, { uid, createdAt: Date.now(), ...payload })
  return doc.id
}

export async function loadRecentScans(uid, max = 10) {
  const scans = collection(db, 'scans')
  const q = query(scans, where('uid', '==', uid), orderBy('createdAt', 'desc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
