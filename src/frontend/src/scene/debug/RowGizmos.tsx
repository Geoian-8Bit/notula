import type { ShelfCosmetic } from '../shelves/types';

/**
 * Pinta una regla magenta sobre cada balda del shelf activo, marcando
 * `startX` → `endX` a la altura `y`. Sirve para calibrar la posición
 * de las baldas frente al modelo .glb real:
 *  - si la regla queda flotando sobre la balda, baja `y`;
 *  - si la regla atraviesa la madera, sube `y`;
 *  - si los bordes se salen del modelo, ajusta `startX` / `endX`.
 *
 * Activado con `?debugShelf=1` o con la prop `showSlotGizmos` desde el
 * calibrador.
 */
interface RowGizmosProps {
  shelf: ShelfCosmetic;
}

export function RowGizmos({ shelf }: RowGizmosProps) {
  return (
    <group>
      {shelf.rows.map((row, idx) => {
        const width = row.endX - row.startX;
        const xCenter = (row.startX + row.endX) / 2;
        return (
          <group key={idx} position={[xCenter, row.y, row.z]}>
            {/* Regla principal a lo largo de la balda. */}
            <mesh position={[0, 0.005, 0]}>
              <boxGeometry args={[width, 0.01, 0.04]} />
              <meshBasicMaterial color="#ff00ff" transparent opacity={0.65} />
            </mesh>
            {/* Top (caja de altura máxima permitida): wireframe. */}
            <mesh position={[0, row.maxBookHeight / 2, 0]}>
              <boxGeometry args={[width, row.maxBookHeight, 0.04]} />
              <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.25} />
            </mesh>
            {/* Tope izquierdo. */}
            <mesh position={[-width / 2, 0.05, 0]}>
              <boxGeometry args={[0.005, 0.1, 0.04]} />
              <meshBasicMaterial color="#ffff00" />
            </mesh>
            {/* Tope derecho. */}
            <mesh position={[width / 2, 0.05, 0]}>
              <boxGeometry args={[0.005, 0.1, 0.04]} />
              <meshBasicMaterial color="#ffff00" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
