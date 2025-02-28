import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaC5j9afu2G0uwlVExzxl5mtDZhA2rZQo",
  authDomain: "book-log-website.firebaseapp.com",
  projectId: "book-log-website",
  storageBucket: "book-log-website.appspot.com",
  messagingSenderId: "281204591180",
  appId: "1:281204591180:web:6e5e8ed9e3633deddc82e9",
  measurementId: "G-6BLXXTNYLF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc };

export { auth };
