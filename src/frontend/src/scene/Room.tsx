import { useEffect, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { RoomPalette } from './palette';

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

function cloneAndConfig(tex: THREE.Texture, offsetX: number, offsetY: number): THREE.Texture {
  const c = tex.clone();
  c.wrapS = THREE.RepeatWrapping;
  c.wrapT = THREE.RepeatWrapping;
  c.repeat.set(2.5, 1.2);
  c.offset.set(offsetX, offsetY);
  c.anisotropy = 16;
  c.needsUpdate = true;
  return c;
}

export function Room({ palette }: Props) {
  // Suelo de laminado real (Poly Haven). Repeat 2× para que el patrón
  // se note (cada tile = 4m físicos, los listones se ven sin pixelar).
  const floorTex = useTexture('/textures/floor/laminate_diff_2k.jpg');
  useEffect(() => {
    floorTex.colorSpace = THREE.SRGBColorSpace;
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(2, 2);
    floorTex.anisotropy = 8;
    floorTex.needsUpdate = true;
  }, [floorTex]);

  // Pared brutalista: derivada de Wood024 (ambientCG). Color desaturado
  // a grayscale offline + tinte gris-piedra vía `color`. Normal map y
  // roughness aportan el grano. Solo `map` lleva sRGB; normal/roughness
  // van en linear.
  const wallMapsBase = useTexture({
    map: '/textures/wall/wall_color_gray_1k.jpg',
    normalMap: '/textures/wall/wall_normal_1k.jpg',
    roughnessMap: '/textures/wall/wall_roughness_1k.jpg',
  });
  // Cuatro instancias clonadas (back/left/right/front), cada una con un
  // offset distinto para que las junturas de tile no se alineen entre
  // paredes contiguas. Repeat fraccionario rompe el "veo X tiles".
  const wallMaps = useMemo(() => {
    const offsets: [number, number][] = [
      [0, 0],
      [0.37, 0.13],
      [0.71, 0.42],
      [0.18, 0.61],
    ];
    const [back, left, right, front] = offsets.map(([ox, oy]) => ({
      map: cloneAndConfig(wallMapsBase.map, ox, oy),
      normalMap: cloneAndConfig(wallMapsBase.normalMap, ox, oy),
      roughnessMap: cloneAndConfig(wallMapsBase.roughnessMap, ox, oy),
    }));
    return { back: back!, left: left!, right: right!, front: front! };
  }, [wallMapsBase]);

  const wallTint = '#FFFFFF';
  const wallNormalScale = useMemo(() => new THREE.Vector2(0.5, 0.5), []);

  // Zócalo plano modernist (estilo Poly Haven render).
  const SK_HEIGHT = 0.12;
  const SK_DEPTH = 0.04;
  const skirtingDiff = useTexture('/textures/skirting/plywood_diff_1k.jpg');
  useEffect(() => {
    skirtingDiff.colorSpace = THREE.SRGBColorSpace;
    skirtingDiff.wrapS = THREE.RepeatWrapping;
    skirtingDiff.wrapT = THREE.RepeatWrapping;
    skirtingDiff.repeat.set(4, 1);
    skirtingDiff.anisotropy = 8;
    skirtingDiff.needsUpdate = true;
  }, [skirtingDiff]);

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
        <meshStandardMaterial
          map={wallMaps.back.map}
          normalMap={wallMaps.back.normalMap}
          normalScale={wallNormalScale}
          roughnessMap={wallMaps.back.roughnessMap}
          color={wallTint}
        />
      </mesh>
      {/* Pared izquierda */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial
          map={wallMaps.left.map}
          normalMap={wallMaps.left.normalMap}
          normalScale={wallNormalScale}
          roughnessMap={wallMaps.left.roughnessMap}
          color={wallTint}
        />
      </mesh>
      {/* Pared derecha */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial
          map={wallMaps.right.map}
          normalMap={wallMaps.right.normalMap}
          normalScale={wallNormalScale}
          roughnessMap={wallMaps.right.roughnessMap}
          color={wallTint}
        />
      </mesh>
      {/* Pared frontal (detrás de la cámara) — necesaria si yawamos mucho */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, H / 2, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial
          map={wallMaps.front.map}
          normalMap={wallMaps.front.normalMap}
          normalScale={wallNormalScale}
          roughnessMap={wallMaps.front.roughnessMap}
          color={wallTint}
        />
      </mesh>

      {/* Zócalos planos modernist, plywood. */}
      <mesh position={[0, SK_HEIGHT / 2, -D / 2 + SK_DEPTH / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, SK_HEIGHT, SK_DEPTH]} />
        <meshStandardMaterial map={skirtingDiff} color="#B0A89E" roughness={1} />
      </mesh>
      <mesh
        position={[-W / 2 + SK_DEPTH / 2, SK_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[D, SK_HEIGHT, SK_DEPTH]} />
        <meshStandardMaterial map={skirtingDiff} color="#B0A89E" roughness={1} />
      </mesh>
      <mesh
        position={[W / 2 - SK_DEPTH / 2, SK_HEIGHT / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[D, SK_HEIGHT, SK_DEPTH]} />
        <meshStandardMaterial map={skirtingDiff} color="#B0A89E" roughness={1} />
      </mesh>
    </group>
  );
}

export const ROOM = { W, D, H } as const;
