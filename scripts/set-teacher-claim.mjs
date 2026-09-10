import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";


const email = process.argv[2]?.trim();
if (!email) {
  console.error("Kullanım: npm run firebase:set-teacher -- ogretmen@example.com");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(".env.local içinde FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ve FIREBASE_PRIVATE_KEY gerekli.");
  process.exit(1);
}

const app = getApps()[0] ?? initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
});
const auth = getAuth(app);
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { ...(user.customClaims ?? {}), role: "teacher" });

console.log(`Teacher claim verildi: ${email} (${user.uid})`);
console.log("Bu kullanıcı daha önce giriş yaptıysa çıkış yapıp yeniden giriş yapmalı.");
