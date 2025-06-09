// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import {
//   getFirestore, connectFirestoreEmulator,
// } from "firebase/firestore";
import "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// const db = getFirestore(app);
// // Configura o emulador (apenas para desenvolvimento local)
// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, 'localhost', 8080); // Aqui, 8080 é a porta padrão do Firestore Emulator
// }

// Export function to initialize Firebase
export const initFirebase = () => {
  return app;
};
