// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-a74dd.firebaseapp.com",
  projectId: "vingo-a74dd",
  storageBucket: "vingo-a74dd.firebasestorage.app",
  messagingSenderId: "491512866086",
  appId: "1:491512866086:web:6d505d27111237d9ac0de7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}