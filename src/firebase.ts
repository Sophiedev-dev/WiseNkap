// src/firebase.ts
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDF-Bg2tVutDCjtdkzp4eAjZZ-U1SnIZhU",
  authDomain: "wisenkap-5cf36.firebaseapp.com",
  projectId: "wisenkap-5cf36",
  storageBucket: "wisenkap-5cf36.appspot.com",
  messagingSenderId: "436264783009",
  appId: "1:436264783009:web:dummy",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  // Persistance réelle pour Expo/React Native
  // ⚠️ TS ignore car types manquent
  // fonctionne au runtime
  // L’utilisateur reste connecté après reload
  // Si tu as encore des warnings TS, laisse-les
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
