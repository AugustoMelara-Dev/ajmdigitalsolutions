// src/lib/firebase-admin.js
import admin from "firebase-admin";

let app;

function init() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("[FB_ADMIN] Missing FIREBASE_* envs");
    const err = new Error("E_FB_ENV_MISSING");
    err.expose = false;
    throw err;
  }

  // \n escapados (Vercel/Windows)
  privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    app =
      admin.apps[0] ||
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
  } catch (e) {
    console.error("[FB_ADMIN_INIT]", e?.message);
    const err = new Error("E_FB_INIT");
    err.expose = false;
    throw err;
  }
}

export function getAdminDb() {
  if (!app) init();
  return admin.firestore();
}
export const AdminFieldValue = admin.firestore.FieldValue;
