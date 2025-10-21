// src/lib/firebase-client.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // opcional
};

export const fbApp = getApps().length ? getApp() : initializeApp(config);

export async function initAnalytics() {
  if (typeof window === "undefined") return null;             // solo browser
  if (!config.measurementId) return null;                     // sin GA id
  try {
    const ok = await isSupported();
    return ok ? getAnalytics(fbApp) : null;
  } catch {
    return null;
  }
}
