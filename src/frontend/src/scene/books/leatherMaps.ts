import { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import * as THREE from 'three';

/**
 * Carga las texturas de cuero (Poly Haven, CC0). Devuelve normal +
 * roughness en formato three.Texture, configurados para repetirse a
 * lo largo del lomo/tapas. Se omite el diffuse a propósito: queremos
 * que el color base venga del cosmético / saga, no del rojo del PNG.
 *
 * Carga única vía Suspense — useLoader cachea por URL, así todos los
 * libros comparten la misma textura.
 */

const NORMAL_URL = '/textures/leather/leather_red_02_nor_gl_4k.exr';
const ROUGHNESS_URL = '/textures/leather/leather_red_02_rough_4k.exr';

export function useLeatherMaps(): {
  normal: THREE.Texture;
  roughness: THREE.Texture;
} {
  const normal = useLoader(EXRLoader, NORMAL_URL);
  const roughness = useLoader(EXRLoader, ROUGHNESS_URL);

  useEffect(() => {
    for (const t of [normal, roughness]) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      // Repeat (2, 6): 2 tiles a lo ancho del lomo/tapa, 6 a lo alto.
      // El grano queda fino sin parecer gigante. Ajustar si la
      // textura sale o demasiado borrosa o demasiado pixelada.
      t.repeat.set(2, 6);
      t.anisotropy = 8;
      t.needsUpdate = true;
    }
  }, [normal, roughness]);

  return { normal, roughness };
}
