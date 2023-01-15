// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi1XqU1OMcWajarLHLrxQMgZe7G0v4skQ",
  authDomain: "quizapp-56a20.firebaseapp.com",
  projectId: "quizapp-56a20",
  storageBucket: "quizapp-56a20.appspot.com",
  messagingSenderId: "504003397477",
  appId: "1:504003397477:web:e7c798731ab4d41c3b838c",
  measurementId: "G-DJCMQTLZ42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export const variables = {
    db
}