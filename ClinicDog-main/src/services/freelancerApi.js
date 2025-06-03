import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import servicesData from './servicesData.json'; 
import { database } from "./firebase";



const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export const getServices = async () => { 
  await simulateApiDelay();
  return servicesData;
};


export const toggleFavorite = async (id) => { 
  await simulateApiDelay();
  const serviceIndex = servicesData.findIndex(service => service.id === id);
  if (serviceIndex !== -1) {
    servicesData[serviceIndex].favorited = !servicesData[serviceIndex].favorited;
  }
  return [...servicesData];
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
    { label: "Todos", icon: "clipboard-list" },
    { label: "Bombeiro Hidráulico", icon: "water" },
    { label: "Limpador de Vidros", icon: "window-restore" },
    { label: "Serviços Gerais", icon: "tools" },
    { label: "Borracheiro Móvel", icon: "car" },
    { label: "Aulas Particulares", icon: "book" },
    { label: "Cabeleireiro a Domicílio", icon: "cut" },
  ];
};