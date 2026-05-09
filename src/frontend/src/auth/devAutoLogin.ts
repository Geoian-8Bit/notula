import { signIn, signUp } from './client';

/**
 * Auto-login para desarrollo. Solo se invoca cuando `import.meta.env.DEV`
 * es true (Vite); en producción el bundle no llega siquiera a llamarlo.
 *
 * Estrategia: intentar `signIn` con la cuenta dev; si falla (probable
 * "user not found" en una DB recién reseteada), hacer `signUp` — que
 * con `autoSignIn: true` en el backend deja la sesión iniciada.
 *
 * Las credenciales son visibles en el bundle. Da igual: solo funcionan
 * contra una DB de dev. Si las cambias, define las env vars
 * `VITE_DEV_AUTH_EMAIL` / `VITE_DEV_AUTH_PASSWORD`.
 */
const DEV_EMAIL = import.meta.env.VITE_DEV_AUTH_EMAIL ?? 'dev@dream-library.test';
const DEV_PASSWORD = import.meta.env.VITE_DEV_AUTH_PASSWORD ?? 'dev-account-pw-not-secret';
const DEV_NAME = 'Dev User';

export async function runDevAutoLogin(): Promise<{ ok: boolean; reason?: string }> {
  const signInResult = await signIn.email({ email: DEV_EMAIL, password: DEV_PASSWORD });
  if (!signInResult.error) return { ok: true };

  const signUpResult = await signUp.email({
    email: DEV_EMAIL,
    password: DEV_PASSWORD,
    name: DEV_NAME,
  });
  if (signUpResult.error) {
    return {
      ok: false,
      reason: signUpResult.error.message ?? 'dev auto-login: signUp falló',
    };
  }
  return { ok: true };
}
