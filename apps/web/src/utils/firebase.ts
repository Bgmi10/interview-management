// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBdfR1i4zJMhb8oyuoN4o5sKIxPXgQWeg",
  authDomain: "moveispotfeedback.firebaseapp.com",
  projectId: "moveispotfeedback",
  storageBucket: "moveispotfeedback.firebasestorage.app",
  messagingSenderId: "822053022303",
  appId: "1:822053022303:web:5d47da0d8245b0c7bc49ea",
  measurementId: "G-REK6L2G6W0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db };