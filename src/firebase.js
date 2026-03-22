import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDi6eqN6ahE_Tl64DsbDcGj5tUXc2qvSCs",
  authDomain: "study-planner-a5f81.firebaseapp.com",
  projectId: "study-planner-a5f81",

  // ✅ FIXED
  storageBucket: "study-planner-a5f81.appspot.com",

  messagingSenderId: "588338704030",
  appId: "1:588338704030:web:9693a04408e98cd5c1558f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// ☁️ Firestore
export const db = getFirestore(app);