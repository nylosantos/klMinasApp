// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv6bOqFMQ5_pf3P7TPSqjQNnOHJqocaFA",
  authDomain: "klminasapp.firebaseapp.com",
  projectId: "klminasapp",
  storageBucket: "klminasapp.appspot.com",
  messagingSenderId: "966343529337",
  appId: "1:966343529337:web:c77ac6b588beb2df8555a8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export function to initialize Firebase
export const initFirebase = () => {
  return app;
};