import { createAuthClient } from 'better-auth/react';

/**
 * En dev (PC y móvil por LAN) usamos URLs relativas para que las llamadas
 * vayan por el proxy de Vite (`/api → backend`) y todo sea mismo-origen.
 * Esto es necesario para que la cookie de sesión se asiente: en HTTP
 * cross-origin el navegador la descarta.
 *
 * En producción (frontend y backend desplegados por separado), define
 * `VITE_API_URL` con el URL público del backend.
 */
const baseURL = import.meta.env.VITE_API_URL ?? '';

export const authClient = createAuthClient({
  baseURL,
});

export const { useSession, signIn, signUp, signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;
