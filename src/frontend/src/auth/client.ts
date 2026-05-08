import { createAuthClient } from 'better-auth/react';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const authClient = createAuthClient({
  baseURL,
});

export const { useSession, signIn, signUp, signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;
