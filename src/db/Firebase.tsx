// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZLlZCgu9d9p9Ytqq-_nL8poYbJiBlIik",
  authDomain: "klminas-39c7f.firebaseapp.com",
  projectId: "klminas-39c7f",
  storageBucket: "klminas-39c7f.appspot.com",
  messagingSenderId: "897207731540",
  appId: "1:897207731540:web:b200c96ab064cbcf8034c1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export function to initialize Firebase
export const initFirebase = () => {
  return app;
};