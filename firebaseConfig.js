// firebaseConfig.ts o firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Importa auth para la autenticación
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCqUxxqEhrff2XNFmHi5WboB9GSoRBR-lI",
  authDomain: "comasapp-95cdc.firebaseapp.com",
  projectId: "comasapp-95cdc",
  storageBucket: "comasapp-95cdc.appspot.com",
  messagingSenderId: "703625675539",
  appId: "1:703625675539:web:a26a922a916564fb6650e6",
  measurementId: "G-NFNEKLZ0GW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Authentication y expórtalo
export const auth = getAuth(app); // Asegúrate de exportar auth



export const db = getFirestore(app);