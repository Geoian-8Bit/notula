import * as THREE from 'three';

/**
 * Texturas procedurales generadas en <canvas>. Sin assets externos: el repo
 * no engorda y todo queda determinista. Calidad inferior a un PBR real de
 * Poly Haven, pero suficiente para que la madera deje de parecer plástico
 * de un solo color. Cuando el proyecto tenga texturas reales, swap directo
 * por `useTexture` de drei.
 *
 * Cada material expone un canvas cacheado a nivel módulo (la generación es
 * lo caro). El `THREE.CanvasTexture` se crea fresco por llamada para que
 * cada instancia pueda fijar su propio `repeat`.
 */

interface WoodOptions {
  size: number;
  base: string;
  grain: string;
  ringDensity: number;
  wobble: number;
  noiseAmount: number;
  knotCount: number;
  knotColor: string;
}

function makeWoodCanvas(opts: WoodOptions): HTMLCanvasElement {
  const { size, base, grain, ringDensity, wobble, noiseAmount, knotCount, knotColor } = opts;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Variación tonal vertical sutil para que no sea plano uniforme
  const shade = ctx.createLinearGradient(0, 0, 0, size);
  shade.addColorStop(0, 'rgba(0,0,0,0)');
  shade.addColorStop(0.5, 'rgba(0,0,0,0.06)');
  shade.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);

  // Líneas de veta horizontales con ondulación tipo seno + ruido
  ctx.strokeStyle = grain;
  const lineCount = Math.max(1, Math.floor(size * ringDensity));
  for (let i = 0; i < lineCount; i++) {
    const y0 = (i / lineCount) * size + (Math.random() - 0.5) * 3;
    ctx.beginPath();
    ctx.lineWidth = 0.5 + Math.random() * 1.4;
    ctx.globalAlpha = 0.18 + Math.random() * 0.35;
    ctx.moveTo(0, y0);
    const segs = 80;
    for (let s = 1; s <= segs; s++) {
      const x = (s / segs) * size;
      const w =
        Math.sin(x * 0.012 + i * 0.7) * wobble +
        Math.sin(x * 0.045 + i) * (wobble * 0.45) +
        (Math.random() - 0.5) * noiseAmount;
      ctx.lineTo(x, y0 + w);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Nudos: gradientes radiales oscuros
  for (let k = 0; k < knotCount; k++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const r = 4 + Math.random() * 14;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, knotColor);
    g.addColorStop(0.6, knotColor.replace(/^#/, '#') + '88');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function canvasToTexture(
  canvas: HTMLCanvasElement,
  repeat: [number, number],
  rotation = 0,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 8;
  if (rotation !== 0) {
    tex.center.set(0.5, 0.5);
    tex.rotation = rotation;
  }
  tex.needsUpdate = true;
  return tex;
}

let walnutCanvas: HTMLCanvasElement | null = null;
function getWalnutCanvas() {
  if (!walnutCanvas) {
    walnutCanvas = makeWoodCanvas({
      size: 512,
      base: '#5C3A20',
      grain: '#2B1810',
      ringDensity: 0.07,
      wobble: 6,
      noiseAmount: 1.6,
      knotCount: 3,
      knotColor: '#1A0E08',
    });
  }
  return walnutCanvas;
}

let oakFloorCanvas: HTMLCanvasElement | null = null;
function getOakFloorCanvas() {
  if (!oakFloorCanvas) {
    oakFloorCanvas = makeWoodCanvas({
      size: 512,
      base: '#7A5A3A',
      grain: '#4A3220',
      ringDensity: 0.05,
      wobble: 4,
      noiseAmount: 1.2,
      knotCount: 2,
      knotColor: '#2E1F12',
    });
  }
  return oakFloorCanvas;
}

let lightShelfCanvas: HTMLCanvasElement | null = null;
function getLightShelfCanvas() {
  if (!lightShelfCanvas) {
    lightShelfCanvas = makeWoodCanvas({
      size: 512,
      base: '#8B6F47',
      grain: '#553A22',
      ringDensity: 0.07,
      wobble: 5,
      noiseAmount: 1.4,
      knotCount: 2,
      knotColor: '#3A2410',
    });
  }
  return lightShelfCanvas;
}

export function makeWalnutTexture(
  repeat: [number, number] = [1, 1],
  rotation = 0,
): THREE.CanvasTexture {
  return canvasToTexture(getWalnutCanvas(), repeat, rotation);
}

export function makeOakFloorTexture(
  repeat: [number, number] = [1, 1],
  rotation = 0,
): THREE.CanvasTexture {
  return canvasToTexture(getOakFloorCanvas(), repeat, rotation);
}

export function makeLightShelfTexture(
  repeat: [number, number] = [1, 1],
  rotation = 0,
): THREE.CanvasTexture {
  return canvasToTexture(getLightShelfCanvas(), repeat, rotation);
}
