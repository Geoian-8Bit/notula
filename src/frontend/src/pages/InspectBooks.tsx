import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { createBookFBXLoader, FBX_URL } from '../scene/books/loader';
import { KEPT_BOOK_NAMES } from '../scene/books/models';

/**
 * Inspector dev-only del pack FBX. Carga el FBX a través del loader
 * compartido (`scene/books/loader.ts`), lista cada nodo top-level con
 * su bounding box y permite previsualizarlo. Filtra:
 *   - cualquier nodo con "pack" en el nombre (decoración, descartado)
 *   - cualquier nodo NO presente en `KEPT_BOOK_NAMES` (libros que el
 *     usuario descartó). Toggle "mostrar todo" para ver el resto.
 *
 * El loader compartido aplica fallback de texturas borradas, así que
 * la consola no se llena de 404.
 *
 * Output: lista de IDs marcados con su bounding box, lista para
 * actualizar `BOOK_MODELS` en `models.ts`.
 */

interface BookEntry {
  name: string;
  node: THREE.Object3D;
  /** Dimensiones en metros (asumiendo scale aplicado). */
  dims: { x: number; y: number; z: number };
}

type FilterAxis = 'min' | 'x' | 'y' | 'z';

function dimByAxis(dims: BookEntry['dims'], axis: FilterAxis): number {
  if (axis === 'x') return dims.x;
  if (axis === 'y') return dims.y;
  if (axis === 'z') return dims.z;
  return Math.min(dims.x, dims.y, dims.z);
}

export default function InspectBooks() {
  const [entries, setEntries] = useState<BookEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(0.01);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [included, setIncluded] = useState<Set<string>>(new Set());
  const [threshold, setThreshold] = useState(0.057);
  const [filterAxis, setFilterAxis] = useState<FilterAxis>('min');
  const [showAll, setShowAll] = useState(false);
  const rawScene = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const loader = createBookFBXLoader();
    loader.load(
      FBX_URL,
      (group) => {
        rawScene.current = group;
        rebuildEntries(group, scale, showAll);
      },
      undefined,
      (err) => setError((err as Error).message ?? 'Error cargando FBX'),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-aplica filtro o scale sin recargar el FBX.
  useEffect(() => {
    if (rawScene.current) rebuildEntries(rawScene.current, scale, showAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, showAll]);

  function rebuildEntries(group: THREE.Group, s: number, includeDescartados: boolean) {
    const list: BookEntry[] = [];
    group.children.forEach((child, idx) => {
      const name = child.name || `book_${idx + 1}`;
      if (/pack/i.test(name)) return;
      if (!includeDescartados && !KEPT_BOOK_NAMES.has(name)) return;
      const cloned = child.clone(true);
      cloned.scale.setScalar(s);
      cloned.position.set(0, 0, 0);
      cloned.rotation.set(0, 0, 0);
      cloned.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(cloned);
      const size = new THREE.Vector3();
      box.getSize(size);
      list.push({
        name,
        node: child,
        dims: { x: size.x, y: size.y, z: size.z },
      });
    });
    setEntries(list);
    if (list.length && !selectedName) setSelectedName(list[0]!.name);
  }

  const selected = useMemo(
    () => entries.find((e) => e.name === selectedName) ?? null,
    [entries, selectedName],
  );

  const snippet = useMemo(() => buildSnippet(entries, included, scale), [entries, included, scale]);

  function toggleInclude(name: string) {
    setIncluded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function applyThreshold() {
    setIncluded(
      new Set(entries.filter((e) => dimByAxis(e.dims, filterAxis) > threshold).map((e) => e.name)),
    );
  }

  function copy() {
    navigator.clipboard.writeText(snippet).catch(() => {});
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#1d1a17] text-[#F2E5C8] md:flex-row">
      <aside className="flex max-h-[40vh] shrink-0 flex-col gap-2 overflow-y-auto border-r border-white/10 bg-[#13110f] p-3 md:max-h-none md:w-[320px]">
        <h2 className="text-base font-semibold">Inspector pack libros</h2>
        {error && <p className="text-xs text-[#ff6b6b]">{error}</p>}
        <label className="flex items-center justify-between text-xs">
          <span>Scale FBX→metros</span>
          <select
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="rounded bg-[#0c0a08] px-1.5 py-0.5"
          >
            <option value={0.01}>0.01 (cm)</option>
            <option value={1}>1 (m)</option>
            <option value={0.1}>0.1</option>
            <option value={0.001}>0.001 (mm)</option>
          </select>
        </label>
        <p className="text-[10px] text-[#F2E5C8]/50">
          Anchura típica de libro: 0.10–0.25 m. Si las dims salen ~20 con scale=0.01, probablemente
          es metros (cambia a 1).
        </p>
        <label className="inline-flex items-center gap-1 text-xs text-[#F2E5C8]/80">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="accent-[#FFB36B]"
          />
          <span>Mostrar libros descartados</span>
        </label>

        <div className="mt-2 flex flex-col gap-2 rounded border border-white/10 bg-[#0c0a08] p-2">
          <span className="text-[10px] uppercase tracking-wider text-[#F2E5C8]/50">
            Auto-marcar por threshold
          </span>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1">
              <span className="text-[#F2E5C8]/70">eje</span>
              <select
                value={filterAxis}
                onChange={(e) => setFilterAxis(e.target.value as FilterAxis)}
                className="rounded bg-[#16130f] px-1 py-0.5"
              >
                <option value="min">min(x,y,z)</option>
                <option value="x">x</option>
                <option value="y">y</option>
                <option value="z">z</option>
              </select>
            </label>
            <label className="flex flex-1 items-center gap-1">
              <span className="text-[#F2E5C8]/70">&gt;</span>
              <input
                type="number"
                step={0.001}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full rounded bg-[#16130f] px-1.5 py-0.5 font-mono"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={applyThreshold}
            className="rounded border border-[#FFB36B]/40 px-2 py-1 text-xs text-[#FFB36B] transition hover:bg-[#FFB36B]/10"
          >
            Marcar matches (
            {entries.filter((e) => dimByAxis(e.dims, filterAxis) > threshold).length})
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          {entries.map((e) => {
            const isSelected = e.name === selectedName;
            const isIncluded = included.has(e.name);
            return (
              <div
                key={e.name}
                className={`flex cursor-pointer items-center gap-2 rounded border px-2 py-1.5 text-xs transition ${
                  isSelected ? 'border-[#FFB36B] bg-white/5' : 'border-white/10 hover:bg-white/5'
                }`}
                onClick={() => setSelectedName(e.name)}
              >
                <input
                  type="checkbox"
                  checked={isIncluded}
                  onChange={() => toggleInclude(e.name)}
                  onClick={(ev) => ev.stopPropagation()}
                  className="accent-[#FFB36B]"
                />
                <div className="flex-1">
                  <div className="font-mono">{e.name}</div>
                  <div className="text-[10px] text-[#F2E5C8]/50">
                    {fmt(e.dims.x)} × {fmt(e.dims.y)} × {fmt(e.dims.z)} m
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
          <span className="text-xs">
            Seleccionados: <strong>{included.size}</strong> / {entries.length}
          </span>
          <button
            type="button"
            onClick={copy}
            className="rounded bg-[#FFB36B] px-3 py-2 text-sm font-semibold text-[#1d1a17] transition hover:bg-[#ffc78c]"
          >
            Copy selection
          </button>
          <textarea
            readOnly
            value={snippet}
            className="h-32 w-full rounded border border-white/10 bg-[#0c0a08] p-2 font-mono text-[10px] leading-tight text-[#F2E5C8]/80"
          />
        </div>
      </aside>

      <div className="relative min-h-0 flex-1">
        {selected ? (
          <Canvas
            shadows
            camera={{ position: [0.45, 0.25, 0.45], fov: 35 }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
          >
            <color attach="background" args={['#1d1a17']} />
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[3, 4, 3]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-3, 2, -2]} intensity={0.4} />
            <CenteredBook entry={selected} scale={scale} />
            <gridHelper args={[1, 20, '#444', '#222']} position={[0, -0.005, 0]} />
            <axesHelper args={[0.15]} />
            <OrbitControls makeDefault enableDamping target={[0, 0.1, 0]} />
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#F2E5C8]/50">
            Cargando pack...
          </div>
        )}
        {selected && (
          <div className="pointer-events-none absolute left-3 top-3 rounded bg-black/60 px-2 py-1 font-mono text-[11px]">
            {selected.name}: {fmt(selected.dims.x)} × {fmt(selected.dims.y)} ×{' '}
            {fmt(selected.dims.z)} m
          </div>
        )}
      </div>
    </div>
  );
}

interface CenteredBookProps {
  entry: BookEntry;
  scale: number;
}

function CenteredBook({ entry, scale }: CenteredBookProps) {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const cloned = entry.node.clone(true);
    cloned.scale.setScalar(scale);
    cloned.position.set(0, 0, 0);
    cloned.rotation.set(0, 0, 0);
    cloned.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    cloned.updateMatrixWorld(true);
    // Centra en X,Z y apoya en Y=0 (como un libro de pie).
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.set(-center.x, -box.min.y, -center.z);
    setObj(cloned);
  }, [entry, scale]);

  // Slow auto-rotate para verlo desde varios ángulos sin tocar.
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  if (!obj) return null;
  return (
    <group ref={ref}>
      <primitive object={obj} />
    </group>
  );
}

function fmt(n: number): string {
  return n.toFixed(3);
}

function buildSnippet(entries: BookEntry[], included: Set<string>, scale: number): string {
  const items = entries
    .filter((e) => included.has(e.name))
    .map(
      (e) =>
        `  { name: '${e.name}', dims: { x: ${e.dims.x.toFixed(4)}, y: ${e.dims.y.toFixed(4)}, z: ${e.dims.z.toFixed(4)} } },`,
    )
    .join('\n');
  return `// Selección con scale=${scale}
const SELECTED_BOOK_MODELS = [
${items}
];
`;
}
