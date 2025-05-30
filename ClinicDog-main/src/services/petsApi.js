import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import petsData from './petsData.json';
import { database } from "./firebase";



const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export const getPets = async () => {
  await simulateApiDelay();
  return petsData;
};


export const toggleFavorite = async (id) => {
  await simulateApiDelay();
  const petIndex = petsData.findIndex(pet => pet.id === id);
  if (petIndex !== -1) {
    petsData[petIndex].favorited = !petsData[petIndex].favorited;
  }
  return [...petsData]; 
};

export const createUserProfile = async (user) => {
  const userRef = doc(database, "users", user.uid);
  await setDoc(userRef, {
    name: user.displayName || "",
    email: user.email,
    photoURL: user.photoURL || "",
    phone: "",
  }, { merge: true });
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(database, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

export const getUserProfile = async (uid) => {
  const userDoc = await getDoc(doc(database, "users", uid));
  return userDoc.exists() ? userDoc.data() : null;
};
  
export const getCategories = () => {
  return [
    { label: 'Todos', icon: 'paw' },
    { label: 'Cachorro', icon: 'dog' },
    { label: 'Gato', icon: 'cat' },
    { label: 'Peixe', icon: 'fish' },
    { label: 'Pássaro', icon: 'dove' },
  ];
};
