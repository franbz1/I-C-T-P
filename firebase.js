// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqpB1_yGSmObDKag0hge_WWPDl3G_MUh8",
  authDomain: "prueba-1-e983b.firebaseapp.com",
  projectId: "prueba-1-e983b",
  storageBucket: "prueba-1-e983b.appspot.com",
  messagingSenderId: "83186488225",
  appId: "1:83186488225:web:83378c3a9b7f266b6e71e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {   persistence: getReactNativePersistence(AsyncStorage) });
const firestore = getFirestore(app)
const storage = getStorage(app)

export {auth, firestore, storage}