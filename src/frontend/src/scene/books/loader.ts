import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { KEPT_TEXTURE_NAMES, FALLBACK_TEXTURE } from './models';

/**
 * Carga centralizada del pack FBX. El FBX referencia las 13 texturas
 * originales aunque hayamos borrado 8; sin URL rewrite, FBXLoader
 * ensucia la consola con 404. El manager redirige cualquier petición
 * de textura no presente al `FALLBACK_TEXTURE` (los nodos asociados a
 * libros descartados ni se renderizarán, así que la textura concreta
 * que vean es irrelevante).
 *
 * También resuelve la ruta: el FBX usa rutas relativas que no
 * coinciden con nuestra estructura `/models/books/textures/`. Sea
 * cual sea la ruta del FBX, extraemos el nombre de archivo y
 * apuntamos a nuestro directorio.
 */

export const FBX_URL = '/models/books/source/Book_pack.fbx';
const TEXTURE_DIR = '/models/books/textures';

export function createBookFBXLoader(): FBXLoader {
  const manager = new THREE.LoadingManager();
  manager.setURLModifier((url) => {
    if (!/\.(jpe?g|png|tga|bmp)$/i.test(url)) return url;
    const filename = url.split(/[/\\]/).pop() ?? url;
    if (KEPT_TEXTURE_NAMES.has(filename)) return `${TEXTURE_DIR}/${filename}`;
    // Textura referenciada por el FBX pero borrada del disco — fallback.
    return `${TEXTURE_DIR}/${FALLBACK_TEXTURE}`;
  });
  return new FBXLoader(manager);
}
