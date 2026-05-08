import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signIn } from '../auth/client';

interface LocationState {
  from?: { pathname?: string };
}

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn.email({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message ?? 'No se pudo iniciar sesión');
      return;
    }
    const target = (location.state as LocationState | null)?.from?.pathname ?? '/';
    navigate(target, { replace: true });
  }

  return (
    <main className="bg-ink text-parchment flex h-dvh w-dvw items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="bg-ink-soft/60 ring-accent-deep/30 w-full max-w-sm space-y-5 rounded-2xl p-8 shadow-2xl ring-1 backdrop-blur"
      >
        <div className="space-y-1 text-center">
          <h1 className="font-display text-parchment text-4xl tracking-wide">Notula</h1>
          <p className="text-parchment-muted text-sm">Entra a tu biblioteca</p>
        </div>

        <label className="block space-y-2">
          <span className="text-parchment-muted text-xs uppercase tracking-widest">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-ink/80 text-parchment ring-accent-deep/40 focus:ring-accent w-full rounded-md px-3 py-2 outline-none ring-1 transition focus:ring-2"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-parchment-muted text-xs uppercase tracking-widest">Contraseña</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-ink/80 text-parchment ring-accent-deep/40 focus:ring-accent w-full rounded-md px-3 py-2 outline-none ring-1 transition focus:ring-2"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-accent text-ink hover:bg-accent-deep w-full rounded-md py-2 font-medium tracking-wide transition disabled:opacity-50"
        >
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="text-parchment-muted text-center text-sm">
          ¿Sin cuenta?{' '}
          <Link to="/sign-up" className="text-accent hover:text-parchment underline">
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}
