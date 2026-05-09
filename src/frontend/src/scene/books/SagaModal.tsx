import { useEffect } from 'react';
import { pickSaga } from './titles';

/**
 * Modal placeholder al click sobre un libro/saga. Cuando exista
 * backend, recibirá los datos completos de la saga (libros, status,
 * portadas) y los pintará. Por ahora muestra título + nº de libros
 * derivados del id.
 */
interface SagaModalProps {
  /** id del libro/saga seleccionado, o null para cerrar. */
  sagaId: string | null;
  onClose: () => void;
}

export function SagaModal({ sagaId, onClose }: SagaModalProps) {
  // ESC cierra.
  useEffect(() => {
    if (!sagaId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sagaId, onClose]);

  if (!sagaId) return null;

  const saga = pickSaga(sagaId);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div
        className="bg-surface text-text-strong relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="text-text-soft hover:text-text-strong absolute right-3 top-3 text-2xl leading-none transition"
        >
          ×
        </button>

        <h2 className="font-display text-2xl tracking-wide">{saga.title}</h2>
        <p className="text-text-soft mt-1 text-sm">
          {saga.bookCount} {saga.bookCount === 1 ? 'libro' : 'libros'} en tu biblioteca
        </p>

        <div className="text-text-soft mt-6 text-sm">
          <p>
            Detalle de la saga (libros, estado de lectura, portadas) llegará cuando conectemos el
            backend.
          </p>
        </div>
      </div>
    </div>
  );
}
