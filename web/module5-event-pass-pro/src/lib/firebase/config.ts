// =============================================================================
// CONFIGURACIÓN FIREBASE (Cliente) - Module 5: EventPass Pro
// =============================================================================
// Configuración del SDK de Firebase para el navegador.
//
// ## Firebase en Next.js
// Firebase tiene dos SDKs:
// 1. firebase (cliente) - Para autenticación en el navegador
// 2. firebase-admin (servidor) - Para Server Actions y API routes
//
// Este archivo configura el SDK del CLIENTE.
//
// ## Build Time vs Runtime
// Durante el build, las variables de entorno pueden no estar disponibles.
// Usamos inicialización lazy para evitar errores en build.
// =============================================================================

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Configuración de Firebase desde variables de entorno.
 *
 * ## Variables NEXT_PUBLIC_
 * Las variables que empiezan con NEXT_PUBLIC_ son accesibles en el cliente.
 * Las demás solo están disponibles en el servidor.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
};

/**
 * Verifica si las credenciales de Firebase están configuradas.
 */
function hasFirebaseCredentials(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== '' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== ''
  );
}

// Almacenamos las instancias
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

/**
 * Obtiene la app de Firebase, inicializándola si es necesario.
 *
 * ## Singleton Pattern con Lazy Initialization
 * Solo inicializamos Firebase cuando realmente se necesita
 * y las credenciales están disponibles.
 */
function getFirebaseApp(): FirebaseApp | null {
  if (_app) return _app;

  if (!hasFirebaseCredentials()) {
    if (typeof window !== 'undefined') {
      console.warn('Firebase: Credenciales no configuradas. La autenticacion no funcionara.');
    }
    return null;
  }

  _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return _app;
}

/**
 * Instancia de Firebase Auth.
 *
 * ## Firebase Auth
 * Maneja autenticación con email/password, Google, GitHub, etc.
 * El estado de autenticación persiste en localStorage.
 */
export function getFirebaseAuth(): Auth | null {
  if (_auth) return _auth;

  const app = getFirebaseApp();
  if (!app) return null;

  _auth = getAuth(app);
  return _auth;
}

/**
 * Instancia de Firestore.
 *
 * ## Firestore
 * Base de datos NoSQL en tiempo real.
 * Estructura: colecciones → documentos → campos
 */
export function getFirestoreDb(): Firestore | null {
  if (_db) return _db;

  const app = getFirebaseApp();
  if (!app) return null;

  _db = getFirestore(app);
  return _db;
}

// Exports para compatibilidad
// Nota: Estos pueden ser null si Firebase no está configurado
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
export const db = typeof window !== 'undefined' ? getFirestoreDb() : null;

export default getFirebaseApp;
