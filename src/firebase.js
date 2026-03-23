import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi6eqN6ahE_Tl64DsbDcGj5tUXc2qvSCs",
  authDomain: "study-planner-a5f81.firebaseapp.com",
  projectId: "study-planner-a5f81",
  storageBucket: "study-planner-a5f81.firebasestorage.app",
  messagingSenderId: "588338704030",
  appId: "1:588338704030:web:9693a04408e98cd5c1558f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);