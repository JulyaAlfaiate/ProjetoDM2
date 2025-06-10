import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
// Apenas para web (opcional, se for usar analytics no web)
import { getAnalytics } from 'firebase/analytics';

// ✅ Config oficial do Firebase
const firebaseConfig = {
  apiKey: " ",
  authDomain: " ",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " ",
  measurementId: " "
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
