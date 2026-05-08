import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { IconButton } from '../components/IconButton';
import { ArrowLeftIcon, ChevronDownIcon, LeafIcon } from '../components/Icons';
import { BookCover } from '../components/BookCover';
import { StatusPill } from '../components/StatusPill';
import type { ReadStatus } from '../lib/sampleBooks';

export default function AddBook() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<ReadStatus>('want');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TopBar
        left={
          <IconButton label="Volver" onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </IconButton>
        }
        title={<span>Agregar libro</span>}
        decoration={<LeafIcon className="text-accent-cool" size={18} />}
      />

      <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
        <div className="mb-6 flex flex-col items-center">
          <BookCover empty size="md" />
        </div>

        <Field label="Título">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. El Principito"
            className="nt-input"
          />
        </Field>

        <Field label="Autor">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Ej. Antoine de Saint-Exupéry"
            className="nt-input"
          />
        </Field>

        <Field label="Categoría">
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="nt-input appearance-none pr-10"
            >
              <option value="">Selecciona una categoría</option>
              <option value="classics">Clásicos</option>
              <option value="fiction">Ficción</option>
              <option value="kids">Infantil</option>
              <option value="graphic">Novela gráfica</option>
              <option value="non-fiction">No ficción</option>
            </select>
            <ChevronDownIcon
              size={18}
              className="text-text-soft pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </Field>

        <Field label="Estado">
          <div className="flex flex-wrap gap-2">
            <StatusPill active={status === 'want'} onClick={() => setStatus('want')}>
              Quiero leer
            </StatusPill>
            <StatusPill active={status === 'reading'} onClick={() => setStatus('reading')}>
              Leyendo
            </StatusPill>
            <StatusPill active={status === 'done'} onClick={() => setStatus('done')}>
              Leído
            </StatusPill>
          </div>
        </Field>

        <button type="submit" className="nt-btn nt-btn-secondary mt-8 w-full">
          Guardar libro
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="text-text-soft mb-1.5 block text-xs font-medium tracking-wide">{label}</span>
      {children}
    </label>
  );
}
