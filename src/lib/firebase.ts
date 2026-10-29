import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCniMTQiTjYyzlmtklVZ1fpgaOSReDJaPw",
  authDomain: "ecomanaus-d43e4.firebaseapp.com",
  projectId: "ecomanaus-d43e4",
  storageBucket: "ecomanaus-d43e4.firebasestorage.app",
  messagingSenderId: "896255261804",
  appId: "1:896255261804:web:e619248388d7d66ffb6c49",
  measurementId: "G-V8S9F5L0PN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
