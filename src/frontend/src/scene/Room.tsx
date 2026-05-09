import { useMemo } from 'react';
import type { RoomPalette } from './palette';
import { makeOakFloorTexture } from './textures';

/**
 * Habitación cerrada (suelo + techo + 4 paredes) sin decoración.
 * La cámara vive dentro, mirando hacia la pared del fondo.
 */
const W = 8;
const D = 8;
const H = 3;

interface Props {
  palette: RoomPalette;
}

export function Room({ palette }: Props) {
  // Suelo de roble con repeat alto: el suelo es 8×8 m, sin repetir la
  // textura se ve como un solo tablón gigante.
  const floorTex = useMemo(() => makeOakFloorTexture([4, 4]), []);

  return (
    <group>
      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floorTex} roughness={0.9} />
      </mesh>
      {/* Techo */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={palette.ceiling} roughness={1} />
      </mesh>

      {/* Pared del fondo */}
      <mesh position={[0, H / 2, -D / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
      {/* Pared izquierda */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
      {/* Pared derecha */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>
      {/* Pared frontal (detrás de la cámara) — necesaria si yawamos mucho */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={palette.wall} roughness={1} />
      </mesh>

      {/* Zócalos: sólo en las dos paredes que más se miran */}
      <mesh position={[0, 0.08, -D / 2 + 0.025]} castShadow receiveShadow>
        <boxGeometry args={[W, 0.16, 0.05]} />
        <meshStandardMaterial color={palette.skirting} roughness={0.85} />
      </mesh>
      <mesh
        position={[-W / 2 + 0.025, 0.08, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[D, 0.16, 0.05]} />
        <meshStandardMaterial color={palette.skirting} roughness={0.85} />
      </mesh>
      <mesh
        position={[W / 2 - 0.025, 0.08, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[D, 0.16, 0.05]} />
        <meshStandardMaterial color={palette.skirting} roughness={0.85} />
      </mesh>
    </group>
  );
}

export const ROOM = { W, D, H } as const;
