import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXp4MHNt8kCaIgchDDu8mZzcOKM3sdlqg",
  authDomain: "medintel-2d189.firebaseapp.com",
  projectId: "medintel-2d189",
  storageBucket: "medintel-2d189.firebasestorage.app",
  messagingSenderId: "976759583072",
  appId: "1:976759583072:web:dc855307aa12661f1cee05"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;