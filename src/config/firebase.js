import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these placeholders with your actual Firebase project web app keys
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWiRraYB0C1XWkOGXfAnevxOhC7cScgSA",
  authDomain: "academic-telemetry-hub.firebaseapp.com",
  projectId: "academic-telemetry-hub",
  storageBucket: "academic-telemetry-hub.firebasestorage.app",
  messagingSenderId: "577675695648",
  appId: "1:577675695648:web:c2e57fd265b3e0b23f0e45",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
