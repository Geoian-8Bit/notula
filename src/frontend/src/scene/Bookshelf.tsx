import { ROOM } from './Room';
import type { RoomPalette } from './palette';

/**
 * Estantería vacía: sólo el armazón (laterales, base, encimera, fondo)
 * y 4 baldas interiores. Sin libros ni decoración.
 */
const W = 1.0; // ancho útil interior — más fina, deja más pared a los lados
const H = 2.0; // alto total
const D = 0.28; // profundidad
const T = 0.025; // grosor de los tableros — más finos
const SHELVES = 4; // baldas interiores → 5 huecos

interface Props {
  palette: RoomPalette;
}

export function Bookshelf({ palette }: Props) {
  // Pared del fondo: z = -ROOM.D/2 = -4. Pegamos la trasera de la
  // estantería a la pared dejando 1cm de aire.
  const z = -ROOM.D / 2 + D / 2 + 0.01;
  const totalW = W + T * 2;

  // Posiciones Y de las baldas interiores (entre suelo y techo del mueble).
  const inner: number[] = [];
  for (let i = 1; i <= SHELVES; i++) {
    inner.push(T + (i / (SHELVES + 1)) * (H - 2 * T));
  }

  return (
    <group position={[0, 0, z]}>
      {/* Lateral izquierdo */}
      <mesh position={[-W / 2 - T / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D]} />
        <meshStandardMaterial color={palette.shelfWood} roughness={0.85} />
      </mesh>
      {/* Lateral derecho */}
      <mesh position={[W / 2 + T / 2, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D]} />
        <meshStandardMaterial color={palette.shelfWood} roughness={0.85} />
      </mesh>
      {/* Encimera */}
      <mesh position={[0, H - T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[totalW, T, D]} />
        <meshStandardMaterial color={palette.shelfWood} roughness={0.8} />
      </mesh>
      {/* Base */}
      <mesh position={[0, T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[totalW, T, D]} />
        <meshStandardMaterial color={palette.shelfWood} roughness={0.85} />
      </mesh>
      {/* Trasera */}
      <mesh position={[0, H / 2, -D / 2 + T / 4]} receiveShadow>
        <boxGeometry args={[W, H - 2 * T, T / 2]} />
        <meshStandardMaterial color={palette.shelfBack} roughness={0.95} />
      </mesh>
      {/* Baldas interiores */}
      {inner.map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[W, T, D]} />
          <meshStandardMaterial color={palette.shelfShelves} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
