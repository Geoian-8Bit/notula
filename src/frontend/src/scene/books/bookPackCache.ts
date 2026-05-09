import * as THREE from 'three';
import { createBookFBXLoader, FBX_URL } from './loader';

/**
 * Cache global del pack FBX. Se carga una sola vez para toda la app
 * (la escena, el inspector y el calibrador comparten el resultado).
 *
 * `useBookPack()` es Suspense-compatible: si el FBX aún no está
 * cargado, lanza la promesa y React Suspense muestra fallback hasta
 * que resuelva.
 */

let cachedGroup: THREE.Group | null = null;
let loadingPromise: Promise<THREE.Group> | null = null;

export function loadBookPack(): Promise<THREE.Group> {
  if (cachedGroup) return Promise.resolve(cachedGroup);
  if (!loadingPromise) {
    loadingPromise = new Promise<THREE.Group>((resolve, reject) => {
      const loader = createBookFBXLoader();
      loader.load(
        FBX_URL,
        (g) => {
          tameMaterials(g);
          cachedGroup = g;
          resolve(g);
        },
        undefined,
        reject,
      );
    });
  }
  return loadingPromise;
}

/**
 * Quita brillo a las materiales del pack: el FBX viene con Phong de
 * `shininess` alta + `specular` claro, lo que hace que los lomos
 * reflejen mucho la luz direccional / ambient. Ajustamos in-place
 * porque las materiales son compartidas entre instancias y queremos
 * el cambio global. Se ejecuta una sola vez al cargar.
 *
 * - Phong: bajamos shininess y oscurecemos specular.
 * - Standard: subimos roughness, ponemos metalness=0, bajamos
 *   envMapIntensity para que el HDRI no haga reflejos espejo.
 */
function tameMaterials(group: THREE.Group) {
  const seen = new Set<THREE.Material>();
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((m) => {
      if (!m || seen.has(m)) return;
      seen.add(m);
      const phong = m as THREE.MeshPhongMaterial;
      const std = m as THREE.MeshStandardMaterial;
      if (phong.shininess !== undefined) {
        phong.shininess = 5;
        phong.specular = new THREE.Color('#000000');
      }
      if (std.roughness !== undefined) {
        std.roughness = 0.92;
        std.metalness = 0;
      }
      if (std.envMapIntensity !== undefined) {
        std.envMapIntensity = 0.35;
      }
      m.needsUpdate = true;
    });
  });
}

export function useBookPack(): THREE.Group {
  if (cachedGroup) return cachedGroup;
  // Pattern para Suspense: throw una promise hasta que resuelva.
  throw loadBookPack();
}

/**
 * Localiza el nodo top-level por nombre dentro del pack ya cargado.
 * Devuelve `null` si no existe.
 */
export function findBookNode(pack: THREE.Group, modelName: string): THREE.Object3D | null {
  return pack.children.find((c) => c.name === modelName) ?? null;
}
