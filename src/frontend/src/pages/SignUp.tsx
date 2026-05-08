import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../auth/client';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signUpError } = await signUp.email({ email, password, name });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message ?? 'No se pudo crear la cuenta');
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <main className="bg-ink text-parchment flex h-dvh w-dvw items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="bg-ink-soft/60 ring-accent-deep/30 w-full max-w-sm space-y-5 rounded-2xl p-8 shadow-2xl ring-1 backdrop-blur"
      >
        <div className="space-y-1 text-center">
          <h1 className="font-display text-parchment text-4xl tracking-wide">Notula</h1>
          <p className="text-parchment-muted text-sm">Crea tu biblioteca</p>
        </div>

        <label className="block space-y-2">
          <span className="text-parchment-muted text-xs uppercase tracking-widest">Nombre</span>
          <input
            type="text"
            required
            minLength={1}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-ink/80 text-parchment ring-accent-deep/40 focus:ring-accent w-full rounded-md px-3 py-2 outline-none ring-1 transition focus:ring-2"
          />
        </label>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-ink/80 text-parchment ring-accent-deep/40 focus:ring-accent w-full rounded-md px-3 py-2 outline-none ring-1 transition focus:ring-2"
          />
          <span className="text-parchment-muted/70 text-xs">Mínimo 8 caracteres</span>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-accent text-ink hover:bg-accent-deep w-full rounded-md py-2 font-medium tracking-wide transition disabled:opacity-50"
        >
          {submitting ? 'Creando cuenta…' : 'Registrarme'}
        </button>

        <p className="text-parchment-muted text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/sign-in" className="text-accent hover:text-parchment underline">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}
