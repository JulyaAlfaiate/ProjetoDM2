import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
// Apenas para web (opcional, se for usar analytics no web)
import { getAnalytics } from 'firebase/analytics';

// ✅ Config oficial do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDKCsGdnjQcf1qw73vQQv-rm57JQFYi4DQ",
  authDomain: "projetox-e464d.firebaseapp.com",
  projectId: "projetox-e464d",
  storageBucket: "projetox-e464d.firebasestorage.app",
  messagingSenderId: "902056836253",
  appId: "1:902056836253:web:291ff57bb32ce949566874",
  measurementId: "G-QB3J8K8F3S"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa analytics somente na web (opcional)
if (Platform.OS === 'web') {
  getAnalytics(app);
}

// Inicializa a autenticação, com persistência adequada para cada plataforma
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Inicializa Firestore
const db = getFirestore(app);

// Exporta auth e db
export { auth, db };
