import { useMemo, useState, Suspense } from 'react';
import { Library } from '../scene/Library';
import { SHELVES, DEFAULT_SHELF_ID } from '../scene/shelves/registry';
import type { ShelfCosmetic, RowDef } from '../scene/shelves/types';
import type { LibraryBookData } from '../scene/books/BookLayout';

/**
 * Página dev-only para calibrar la disposición de un cosmético frente
 * a su modelo .glb. Editor de filas (cada fila = balda continua con
 * `y`, `startX`, `endX`, `z`, `maxBookHeight`). Toggle "preview" puebla
 * cada balda con un surtido de archetipos para ver cómo cabe el
 * material real, no cubitos genéricos. "Copy code" produce el array
 * `rows: RowDef[]` listo para pegar en `<id>.tsx`.
 */
export default function CalibrateShelf() {
  const [shelfId, setShelfId] = useState<string>(DEFAULT_SHELF_ID);
  const baseShelf = SHELVES[shelfId] ?? SHELVES[DEFAULT_SHELF_ID]!;
  const [rows, setRows] = useState<RowDef[]>(() => cloneRows(baseShelf.rows));
  const [bookScale, setBookScale] = useState<number>(baseShelf.bookScale);
  const [preview, setPreview] = useState(true);
  const [showGizmos, setShowGizmos] = useState(true);

  // Si cambias el shelf, reset a sus defaults.
  function selectShelf(nextId: string) {
    const next = SHELVES[nextId];
    if (!next) return;
    setShelfId(nextId);
    setRows(cloneRows(next.rows));
    setBookScale(next.bookScale);
  }

  function updateRow(idx: number, patch: Partial<RowDef>) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => {
      const last = prev[prev.length - 1];
      const next: RowDef = last
        ? { ...last, y: last.y + 0.43 }
        : { y: 0.18, startX: -0.2, endX: 0.2, z: -3.74, maxBookHeight: 0.32 };
      return [...prev, next];
    });
  }

  function removeRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  // Cosmético sintético en vivo, derivado del estado del editor.
  const liveShelf: ShelfCosmetic = useMemo(
    () => ({
      id: `${baseShelf.id}-calibrating`,
      displayName: `${baseShelf.displayName} (calibrating)`,
      rows,
      bookScale,
      Component: baseShelf.Component,
    }),
    [baseShelf, rows, bookScale],
  );

  const previewBooks = useMemo<LibraryBookData[]>(
    () => (preview ? buildPreviewBooks(rows.length) : []),
    [preview, rows.length],
  );

  const snippet = useMemo(() => buildSnippet(rows, bookScale), [rows, bookScale]);

  function copy() {
    navigator.clipboard.writeText(snippet).catch(() => {
      /* clipboard puede fallar fuera de https; el textarea queda como fallback */
    });
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#1d1a17] text-[#F2E5C8] md:flex-row">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Suspense fallback={null}>
          <Library
            shelfOverride={liveShelf}
            booksOverride={previewBooks}
            showSlotGizmos={showGizmos}
          />
        </Suspense>
      </div>

      <aside className="flex max-h-[60vh] shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/10 bg-[#13110f] p-4 md:max-h-none md:w-[360px]">
        <header className="flex flex-col gap-2 border-b border-white/10 pb-3">
          <h2 className="text-base font-semibold tracking-wide">Shelf calibrator</h2>
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-[#F2E5C8]/70">Cosmético</span>
            <select
              value={shelfId}
              onChange={(e) => selectShelf(e.target.value)}
              className="rounded border border-white/10 bg-[#0c0a08] px-2 py-1 text-sm"
            >
              {Object.values(SHELVES).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-3 text-xs">
            <Toggle label="Preview libros" value={preview} onChange={setPreview} />
            <Toggle label="Gizmos" value={showGizmos} onChange={setShowGizmos} />
          </div>
          <SliderFloat
            label="Book scale (multiplica grosor/alto/fondo)"
            value={bookScale}
            min={0.5}
            max={2.5}
            step={0.05}
            onChange={setBookScale}
          />
        </header>

        <div className="flex flex-col gap-3">
          {rows.map((row, idx) => (
            <RowEditor
              key={idx}
              idx={idx}
              row={row}
              onChange={(patch) => updateRow(idx, patch)}
              onRemove={() => removeRow(idx)}
            />
          ))}
          <button
            type="button"
            onClick={addRow}
            className="rounded border border-white/15 px-3 py-2 text-sm text-[#F2E5C8] transition hover:bg-white/5"
          >
            + Añadir balda
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={copy}
            className="rounded bg-[#FFB36B] px-3 py-2 text-sm font-semibold text-[#1d1a17] transition hover:bg-[#ffc78c]"
          >
            Copy code
          </button>
          <textarea
            readOnly
            value={snippet}
            className="h-48 w-full rounded border border-white/10 bg-[#0c0a08] p-2 font-mono text-[10px] leading-tight text-[#F2E5C8]/80"
          />
          <p className="text-[10px] text-[#F2E5C8]/50">
            Pega el bloque sobre el array <code>ROWS</code> de{' '}
            <code className="text-[#FFB36B]">src/frontend/src/scene/shelves/{shelfId}.tsx</code>.
          </p>
        </div>
      </aside>
    </div>
  );
}

interface RowEditorProps {
  idx: number;
  row: RowDef;
  onChange: (patch: Partial<RowDef>) => void;
  onRemove: () => void;
}

function RowEditor({ idx, row, onChange, onRemove }: RowEditorProps) {
  return (
    <div className="rounded border border-white/10 bg-[#0c0a08] p-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#FFB36B]">Balda {idx}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] text-[#F2E5C8]/50 transition hover:text-[#ff6b6b]"
        >
          eliminar
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="y" value={row.y} step={0.005} onChange={(v) => onChange({ y: v })} />
        <NumField label="z" value={row.z} step={0.01} onChange={(v) => onChange({ z: v })} />
        <NumField
          label="startX"
          value={row.startX}
          step={0.005}
          onChange={(v) => onChange({ startX: v })}
        />
        <NumField
          label="endX"
          value={row.endX}
          step={0.005}
          onChange={(v) => onChange({ endX: v })}
        />
        <NumField
          label="maxH"
          value={row.maxBookHeight}
          step={0.005}
          onChange={(v) => onChange({ maxBookHeight: v })}
        />
      </div>
      <SliderFloat
        label="y (slider)"
        value={row.y}
        min={0.05}
        max={2.4}
        step={0.005}
        onChange={(v) => onChange({ y: v })}
      />
    </div>
  );
}

interface NumFieldProps {
  label: string;
  value: number;
  step: number;
  onChange: (v: number) => void;
}

function NumField({ label, value, step, onChange }: NumFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-[#F2E5C8]/60">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded border border-white/10 bg-[#16130f] px-1.5 py-1 font-mono text-[12px] text-[#F2E5C8]"
      />
    </label>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function SliderFloat({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <label className="mt-2 flex flex-col gap-1 text-[10px] text-[#F2E5C8]/70">
      <span className="flex items-center justify-between">
        <span>{label}</span>
        <span className="font-mono text-[#FFB36B]">{value.toFixed(3)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-1 text-[#F2E5C8]/80">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#FFB36B]"
      />
      <span>{label}</span>
    </label>
  );
}

function cloneRows(rows: RowDef[]): RowDef[] {
  return rows.map((r) => ({ ...r }));
}

function buildSnippet(rows: RowDef[], bookScale: number): string {
  const items = rows
    .map(
      (r) =>
        `  { y: ${r.y.toFixed(3)}, startX: ${r.startX.toFixed(3)}, endX: ${r.endX.toFixed(3)}, z: ${r.z.toFixed(3)}, maxBookHeight: ${r.maxBookHeight.toFixed(3)} },`,
    )
    .join('\n');
  return `// Pegar en src/frontend/src/scene/shelves/<id>.tsx
const ROWS: RowDef[] = [
${items}
];

// y en el objeto exportado:
//   bookScale: ${bookScale.toFixed(2)},
`;
}

/**
 * Genera 5-7 libros mock por balda. Como cada libro elige modelo
 * (textura) por hash de su `id`, basta con ids únicos para tener
 * surtido de portadas en cada balda.
 */
function buildPreviewBooks(rowCount: number): LibraryBookData[] {
  const out: LibraryBookData[] = [];
  for (let row = 0; row < rowCount; row++) {
    const count = 5 + ((row * 7) % 3); // 5..7
    for (let i = 0; i < count; i++) {
      out.push({
        id: `preview-r${row}-i${i}`,
        shelfRow: row,
        shelfOrder: i,
      });
    }
  }
  return out;
}
