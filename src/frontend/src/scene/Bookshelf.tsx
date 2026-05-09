import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ROOM } from './Room';

/**
 * Estantería: modelo GLTF cargado de `public/models/bookshelf.glb`.
 * Texturas PBR (albedo, normal, roughness, AO) van embebidas en el GLB.
 *
 * Auto-fit: tras cargar, se mide el bounding box del modelo y se escala
 * para que `TARGET_HEIGHT` quede en metros del mundo, luego se reposiciona
 * para apoyarse en el suelo (y=0), centrarse en X (x=0) y pegarse a la
 * pared del fondo (z ≈ -ROOM.D/2). Esto hace que el modelo de origen
 * pueda venir en cualquier escala/orientación de export.
 */
const MODEL_URL = '/models/bookshelf.glb';
useGLTF.preload(MODEL_URL);

const TARGET_HEIGHT = 2.0;
const WIDTH_STRETCH = 1.21;
const WALL_GAP = 0.08;

export function Bookshelf() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

  // Clonamos para que el cache de useGLTF no se vea mutado entre re-mounts
  // y configuramos sombras por mesh.
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // Reset antes de medir para que escalas/posiciones previas no
    // contaminen el bounding box.
    group.scale.setScalar(1);
    group.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const scale = TARGET_HEIGHT / size.y;
    group.scale.set(scale * WIDTH_STRETCH, scale, scale);

    // Volver a medir tras escalar.
    box.setFromObject(group);
    box.getSize(size);
    box.getCenter(center);

    const targetZ = -ROOM.D / 2 + size.z / 2 + WALL_GAP;
    group.position.set(
      -center.x, // centrar X
      -box.min.y, // base sobre el suelo
      targetZ - center.z, // cara trasera contra la pared del fondo
    );
  }, [cloned]);

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}
