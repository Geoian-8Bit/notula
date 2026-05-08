import { useMemo } from 'react';
import * as THREE from 'three';

const SHELF_W = 3.2;
const SHELF_H = 0.08;
const SHELF_D = 0.4;
const SHELVES = 3;
const BOOKS_PER_SHELF = 14;

const palette = ['#7f5539', '#b08968', '#9c6644', '#d8cfb8', '#3a2e2a', '#6f4e37'];

type BookSlot = { x: number; y: number; w: number; h: number; d: number; color: string };

function buildSlots(): BookSlot[] {
  const slots: BookSlot[] = [];
  for (let s = 0; s < SHELVES; s++) {
    const y = s * 0.55 + 0.32;
    const slotWidth = SHELF_W / BOOKS_PER_SHELF;
    for (let i = 0; i < BOOKS_PER_SHELF; i++) {
      const w = 0.07 + Math.random() * 0.05;
      const h = 0.32 + Math.random() * 0.08;
      const d = 0.22 + Math.random() * 0.06;
      const x = -SHELF_W / 2 + slotWidth * (i + 0.5);
      const color = palette[(i + s) % palette.length] ?? '#b08968';
      slots.push({ x, y, w, h, d, color });
    }
  }
  return slots;
}

export function Bookshelf() {
  const slots = useMemo(buildSlots, []);

  return (
    <group position={[0, 0, 0]}>
      {Array.from({ length: SHELVES + 1 }).map((_, i) => (
        <mesh key={`shelf-${i}`} position={[0, i * 0.55, 0]} receiveShadow castShadow>
          <boxGeometry args={[SHELF_W + 0.1, SHELF_H, SHELF_D]} />
          <meshStandardMaterial color="#3a2e2a" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[-SHELF_W / 2 - 0.05, (SHELVES * 0.55) / 2, 0]} receiveShadow>
        <boxGeometry args={[0.08, SHELVES * 0.55, SHELF_D]} />
        <meshStandardMaterial color="#3a2e2a" roughness={0.85} />
      </mesh>
      <mesh position={[SHELF_W / 2 + 0.05, (SHELVES * 0.55) / 2, 0]} receiveShadow>
        <boxGeometry args={[0.08, SHELVES * 0.55, SHELF_D]} />
        <meshStandardMaterial color="#3a2e2a" roughness={0.85} />
      </mesh>
      <mesh position={[0, (SHELVES * 0.55) / 2, -SHELF_D / 2]} receiveShadow>
        <boxGeometry args={[SHELF_W + 0.1, SHELVES * 0.55, 0.02]} />
        <meshStandardMaterial color="#2a211d" roughness={0.9} />
      </mesh>
      {slots.map((slot, idx) => (
        <Book key={idx} slot={slot} />
      ))}
    </group>
  );
}

function Book({ slot }: { slot: BookSlot }) {
  return (
    <mesh position={[slot.x, slot.y + slot.h / 2 + SHELF_H / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[slot.w, slot.h, slot.d]} />
      <meshStandardMaterial color={new THREE.Color(slot.color)} roughness={0.7} />
    </mesh>
  );
}
