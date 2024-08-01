// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore ,Timestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm8E3fshphvoN7R3w_BgLQfkpSJAMabDs",
  authDomain: "linkedin-clone-ac277.firebaseapp.com",
  projectId: "linkedin-clone-ac277",
  storageBucket: "linkedin-clone-ac277.appspot.com",
  messagingSenderId: "1027677537667",
  appId: "1:1027677537667:web:09152e916908fe3422a2b6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider()
const storage = getStorage(firebaseApp);
export {auth, provider,storage ,db ,Timestamp}
export default firebaseApp;