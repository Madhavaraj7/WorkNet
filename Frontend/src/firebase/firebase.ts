import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDwSglLdE4p1_oLEY05RB_2JkvtAWARbwk",
  authDomain: "worknet-4f944.firebaseapp.com",
  projectId: "worknet-4f944",
  storageBucket: "worknet-4f944.appspot.com",
  messagingSenderId: "320583306609",
  appId: "1:320583306609:web:63e6193999f56f8ae07ad0",
  measurementId: "G-YVF0JHV3V5"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
