import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ROOM } from '../Room';

/**
 * Mesh del shelf "starter-oak". Cargado desde GLB con auto-fit:
 * mide el bounding box, lo escala a TARGET_HEIGHT, lo centra en X y lo
 * pega contra la pared del fondo. Las constantes de slot del cosmético
 * (en `starter-oak.tsx`) están calibradas para esta escala/posición.
 */
const MODEL_URL = '/models/bookshelf.glb';
useGLTF.preload(MODEL_URL);

const TARGET_HEIGHT = 2.0;
const WIDTH_STRETCH = 1.21;
const WALL_GAP = 0.08;

export function StarterOakModel() {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

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

    group.scale.setScalar(1);
    group.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const scale = TARGET_HEIGHT / size.y;
    group.scale.set(scale * WIDTH_STRETCH, scale, scale);

    box.setFromObject(group);
    box.getSize(size);
    box.getCenter(center);

    const targetZ = -ROOM.D / 2 + size.z / 2 + WALL_GAP;
    group.position.set(-center.x, -box.min.y, targetZ - center.z);
  }, [cloned]);

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}
