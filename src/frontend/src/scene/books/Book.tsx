import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBox, Text } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { BOOK_MODELS } from './models';
import { hashToFloat } from './variation';
import { pickSaga } from './titles';
import { useLeatherMaps } from './leatherMaps';

interface BookProps {
  /** id estable de la saga (semilla de variación visual). */
  id: string;
  /** Nombre del modelo en BOOK_MODELS (decide dims + baseColor). */
  modelName: string;
  /** Centro de la BASE del libro en world space. */
  position: [number, number, number];
  rotation: [number, number, number];
  /** Multiplicador uniforme de tamaño (`shelf.bookScale`). */
  scale: number;
  sagaTitle?: string;
  bookCount?: number;
  onClick?: (id: string) => void;
}

/**
 * Render de un "lomo de saga" volumétrico: 4 piezas sólidas que
 * imitan la construcción de un libro de tapa dura.
 *   - Spine plate: tapa-binding visible al usuario (+Z), full Y/X.
 *   - Left/right cover plates: tapas laterales, finas en X, full Y/Z.
 *   - Page block: bloque de páginas centro, ligeramente recogido en
 *     Y (3 mm bajo top/bottom de tapa) y -Z (3 mm tras la fore-edge).
 *
 * Todas las tapas son `<RoundedBox>` con bevel suave en las esquinas
 * → contorno redondeado realista. El bloque de páginas usa
 * boxGeometry recta (papel = bordes vivos).
 *
 * Variación:
 *  - El `modelName` da color base + dimensiones globales.
 *  - El `id` aporta tinte fino sobre la tapa y matiz cream sobre
 *    páginas → dos sagas iguales no son idénticas.
 *
 * Interacción: click → callback con id; hover → scale-up + salida
 * leve hacia adelante.
 */
export function Book({
  id,
  modelName,
  position,
  rotation,
  scale,
  sagaTitle,
  bookCount,
  onClick,
}: BookProps) {
  const model = useMemo(
    () => BOOK_MODELS.find((m) => m.name === modelName) ?? BOOK_MODELS[0]!,
    [modelName],
  );
  const coverColor = useMemo(() => bookColor(id, model.baseColor), [id, model.baseColor]);
  const pageColor = useMemo(() => pageEdgeColor(id), [id]);
  const textColor = useMemo(() => labelColor(model.baseColor), [model.baseColor]);
  const saga = useMemo(() => pickSaga(id), [id]);
  const { normal: leatherNormal, roughness: leatherRoughness } = useLeatherMaps();
  const normalScale = useMemo(() => new THREE.Vector2(0.6, 0.6), []);
  const title = sagaTitle ?? saga.title;
  const count = bookCount ?? saga.bookCount;

  const dx = model.dims.x * scale;
  const dy = model.dims.y * scale;
  const dz = model.dims.z * scale;

  // Geometría del cover wrap.
  const coverT = Math.min(dx * 0.1, 0.005); // 4–5 mm grosor de tapa
  const pageInsetY = 0.003 * scale; // tapa protruye 3mm en Y (top y bottom)
  const pageInsetZ = 0.003 * scale; // pages recogen 3mm en fore-edge
  const cornerRadius = Math.min(coverT * 0.45, 0.0015);

  // Page block dims (bloque de papel).
  const pageDx = Math.max(dx - 2 * coverT, 0.001);
  const pageDy = Math.max(dy - 2 * pageInsetY, 0.001);
  const pageDz = Math.max(dz - coverT - pageInsetZ, 0.001);
  // Page block centro: flush con la cara interna del spine plate, y
  // recogido en -Z respecto al -Z de la tapa.
  const pageZCenter = (pageInsetZ - coverT) / 2;

  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.04 : 1;
    const targetZ = hovered ? 0.015 : 0;
    const damp = 12;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, damp, delta),
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      position[2] + targetZ,
      damp,
      delta,
    );
  });

  const titleFont = Math.min(dx * 0.34, dy * 0.062);
  const countFont = Math.max(titleFont * 0.55, 0.005);

  function handlePointerEnter(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }
  function handlePointerLeave(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = '';
  }
  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    onClick?.(id);
  }

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={new THREE.Euler(...rotation, 'XYZ')}
      onPointerOver={handlePointerEnter}
      onPointerOut={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Spine: la tapa visible al usuario (+Z). */}
      <RoundedBox
        args={[dx, dy, coverT]}
        radius={cornerRadius}
        smoothness={3}
        position={[0, dy / 2, dz / 2 - coverT / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={coverColor}
          roughness={0.85}
          metalness={0}
          normalMap={leatherNormal}
          normalScale={normalScale}
          roughnessMap={leatherRoughness}
        />
      </RoundedBox>

      {/* Tapa derecha (+X). */}
      <RoundedBox
        args={[coverT, dy, dz - coverT]}
        radius={cornerRadius}
        smoothness={3}
        position={[dx / 2 - coverT / 2, dy / 2, -coverT / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={coverColor}
          roughness={0.85}
          metalness={0}
          normalMap={leatherNormal}
          normalScale={normalScale}
          roughnessMap={leatherRoughness}
        />
      </RoundedBox>

      {/* Tapa izquierda (-X). */}
      <RoundedBox
        args={[coverT, dy, dz - coverT]}
        radius={cornerRadius}
        smoothness={3}
        position={[-dx / 2 + coverT / 2, dy / 2, -coverT / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={coverColor}
          roughness={0.85}
          metalness={0}
          normalMap={leatherNormal}
          normalScale={normalScale}
          roughnessMap={leatherRoughness}
        />
      </RoundedBox>

      {/* Bloque de páginas: cream, recogido bajo las tapas. */}
      <mesh position={[0, dy / 2, pageZCenter]} castShadow receiveShadow>
        <boxGeometry args={[pageDx, pageDy, pageDz]} />
        <meshStandardMaterial color={pageColor} roughness={0.95} metalness={0} />
      </mesh>

      {/* Título de la saga, rotado para leerse de abajo a arriba.
          Pintamos justo delante de la cara externa del spine plate. */}
      <Text
        position={[0, dy / 2, dz / 2 + 0.0008]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={titleFont}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={dy * 0.78}
        textAlign="center"
        outlineWidth={titleFont * 0.04}
        outlineColor={textColor}
      >
        {title}
      </Text>

      {/* Badge del nº de libros en la saga, abajo del lomo. */}
      {count > 1 && (
        <Text
          position={[0, dy * 0.08, dz / 2 + 0.0008]}
          rotation={[0, 0, 0]}
          fontSize={countFont}
          color={textColor}
          anchorX="center"
          anchorY="middle"
        >
          {count.toString()}
        </Text>
      )}
    </group>
  );
}

function bookColor(id: string, baseColor: string): THREE.Color {
  const r = 0.92 + hashToFloat(id + ':tintR') * 0.08;
  const g = 0.92 + hashToFloat(id + ':tintG') * 0.08;
  const b = 0.92 + hashToFloat(id + ':tintB') * 0.08;
  return new THREE.Color(baseColor).multiply(new THREE.Color(r, g, b));
}

function pageEdgeColor(id: string): THREE.Color {
  const seed = hashToFloat(id + ':page');
  const r = 0.96 + seed * 0.02;
  const g = 0.93 + seed * 0.03;
  const b = 0.84 + seed * 0.07;
  return new THREE.Color(r, g, b);
}

function labelColor(baseColor: string): string {
  const c = new THREE.Color(baseColor);
  const luminance = c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
  return luminance < 0.55 ? '#F2EBD8' : '#2A2A2A';
}
