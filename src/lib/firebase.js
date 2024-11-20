import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {

    // made seperste env file to keep api key
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-23920.firebaseapp.com",
  projectId: "reactchat-23920",
  storageBucket: "reactchat-23920.firebasestorage.app",
  messagingSenderId: "736781347714",
  appId: "1:736781347714:web:38223048d4192f9c2ebd9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const db=getFirestore(app)
export const storage=getStorage()