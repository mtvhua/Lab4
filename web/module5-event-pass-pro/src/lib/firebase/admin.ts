// =============================================================================
// CONFIGURACIÓN FIREBASE ADMIN (Servidor) - Module 5: EventPass Pro
// =============================================================================
// Configuración del SDK de Firebase Admin para el servidor.
//
// ## Firebase Admin vs Firebase
// - Firebase (cliente): Autenticación interactiva en el navegador
// - Firebase Admin (servidor): Operaciones privilegiadas sin autenticación
//
// ## Cuándo usar Admin
// - Server Actions que acceden a Firestore
// - Verificación de tokens de usuario
// - Operaciones que requieren permisos elevados
// =============================================================================

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

/**
 * Inicializa Firebase Admin.
 *
 * ## Credenciales
 * En desarrollo, usamos variables de entorno.
 * En producción (ej: Vercel), configuramos las mismas variables.
 *
 * ## Singleton
 * Solo inicializamos una vez para evitar errores.
 */
function initializeFirebaseAdmin(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Verificamos que las variables de entorno existen
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  // Si no hay credenciales, usamos modo emulador o fallback
  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      'Firebase Admin: Credenciales no configuradas. Usando modo de desarrollo.'
    );
    // Inicializamos sin credenciales (útil para desarrollo local sin Firebase real)
    return initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
    });
  }

  // Inicializamos con credenciales completas
  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // La private key viene con \n escapados, los convertimos a newlines reales
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

// Inicializamos la app
const adminApp = initializeFirebaseAdmin();

/**
 * Firestore Admin.
 * Acceso sin restricciones de seguridad (solo usar en servidor).
 */
export const adminDb: Firestore = getFirestore(adminApp);

/**
 * Auth Admin.
 * Para verificar tokens y gestionar usuarios.
 */
export const adminAuth: Auth = getAuth(adminApp);

export default adminApp;
