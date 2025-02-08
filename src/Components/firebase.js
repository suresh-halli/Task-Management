// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore, collection} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCYRhXOhekheXiVAV-GPmiiB6expg_jPNk",
  authDomain: "task--management-1e7c7.firebaseapp.com",
  projectId: "task--management-1e7c7",
  storageBucket: "task--management-1e7c7.firebasestorage.app",
  messagingSenderId: "245235478019",
  appId: "1:245235478019:web:14f49fe21aec73a32ae836"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app);
export const tasksCollection=collection(db, "tasks");
export default app;