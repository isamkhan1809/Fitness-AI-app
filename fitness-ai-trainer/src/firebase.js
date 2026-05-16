// Imports all necessary fireabse packages
import { initializeApp } from 'firebase/app'; // Imports the initializeApp function from the Firebase App module

// Imports Firebase Authentication functions:
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Imports Firestore database functions


// Firebase configuration for my database
const firebaseConfig = {
  apiKey: 'AIzaSyDkWWsplo8LAmixSejwjf6LxZkFdsVguUs',
  authDomain: 'ai-fitness-app-db15d.firebaseapp.com',
  projectId: 'ai-fitness-app-db15d',
  storageBucket: 'ai-fitness-app-db15d.appspot.com',
  messagingSenderId: '943900130398',
  appId: '1:943900130398:web:e1fdd39ffd44b1100348cf',
  measurementId: 'G-3XSSLW1D7D',
};


// Initialise Firebase
const app = initializeApp(firebaseConfig); // Initialise Firebase with the provided configuration.
const auth = getAuth(app); // Initialise the Firebase Authentication service for the app.

// Initialise the Firestore database service for the app
const db = getFirestore(app);

// Exports the Initialise Firebase instances and functions so they can be imported and used in other parts of the application.
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, collection, addDoc };