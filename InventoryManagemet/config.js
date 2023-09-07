// Import the necessary Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyB6yp26SCuZKMt5ZtU8f40WtYDD6hXduus",
    authDomain: "byte-blossom.firebaseapp.com",
    projectId: "byte-blossom",
    storageBucket: "byte-blossom.appspot.com",
    messagingSenderId: "512964449819",
    appId: "1:512964449819:web:070b1bec7bd697ca3c0abe",
    measurementId: "G-YNR93QP8JQ"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

// Access the Firestore collection
const inventory = collection(db, 'inventory');

module.exports = inventory;
