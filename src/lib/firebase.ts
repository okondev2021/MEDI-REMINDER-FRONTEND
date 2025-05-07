// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATQpW8PcQ6pXrKM2n1wELueNfOEljWXzY",
  authDomain: "medi-remind-25b30.firebaseapp.com",
  projectId: "medi-remind-25b30",
  storageBucket: "medi-remind-25b30.firebasestorage.app",
  messagingSenderId: "1095936882055",
  appId: "1:1095936882055:web:9d7feca2986adbb3248f22",
  measurementId: "G-BZLP8HR6F4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const appAuth = getAuth(app); 
const appDb = getFirestore(app);

export { appAuth, appDb, app };

