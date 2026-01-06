import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAot1rLZgXxADNowCAsnmInryoZ5EZ2xTE",
  authDomain: "jose-a053b.firebaseapp.com",
  projectId: "jose-a053b",
  storageBucket: "jose-a053b.firebasestorage.app",
  messagingSenderId: "675581538045",
  appId: "1:675581538045:web:cac871ab8c99e85e3f5894"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export {app}
export default firebaseConfig
