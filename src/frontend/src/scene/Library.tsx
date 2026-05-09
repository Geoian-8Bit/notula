import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ROOM_PALETTE } from './palette';
import { Room } from './Room';
import { Bookshelf } from './Bookshelf';

/**
 * Espacio 3D: cámara fija dentro de la habitación apuntando a la
 * estantería del fondo. La cámara sólo se mueve cuando el usuario
 * arrastra (click-drag en PC, drag-touch en móvil); al soltar vuelve
 * sola al centro.
 */

// Tilt base 0 (cámara nivelada). El bias de espacio arriba lo da
// que la cámara está en y=1.2 mientras el shelf va de y=0 a y=2.0.
const BASE_PITCH = 0;
const MAX_YAW = 0.07; // ~4° de "look-around" lateral
const MAX_PITCH = 0.035; // ~2° arriba/abajo
const DAMP = 2.5; // suavizado: ni instantáneo ni perezoso

export function Library() {
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);

  // Estado del drag (en refs para evitar re-renders)
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const baseYaw = useRef(0);
  const basePitch = useRef(0);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    baseYaw.current = targetYaw.current;
    basePitch.current = targetPitch.current;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    const w = e.currentTarget.clientWidth || 1;
    const h = e.currentTarget.clientHeight || 1;
    // Half-screen-drag = MAX. Sensación de "asomar" sin pasarse.
    targetYaw.current = clamp(baseYaw.current - (dx / w) * 2 * MAX_YAW, -MAX_YAW, MAX_YAW);
    targetPitch.current = clamp(
      basePitch.current + (dy / h) * 2 * MAX_PITCH,
      -MAX_PITCH,
      MAX_PITCH,
    );
  }

  function onPointerEnd(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    // Auto-retorno al centro
    targetYaw.current = 0;
    targetPitch.current = 0;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // pointer capture ya liberado: ignorar
    }
  }

  return (
    <div
      className="h-full w-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.2, -0.1], fov: 34 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Scene />
        <AsymmetricFrustum extraBottom={0.15} />
        <CameraRig targetYawRef={targetYaw} targetPitchRef={targetPitch} />
      </Canvas>
    </div>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={[ROOM_PALETTE.background]} />
      <fog attach="fog" args={[ROOM_PALETTE.background, 9, 18]} />

      <ambientLight color={ROOM_PALETTE.ambient} intensity={0.55} />
      <directionalLight
        color={ROOM_PALETTE.sun}
        intensity={1.4}
        position={[3, 4, 2]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <pointLight
        color={ROOM_PALETTE.ambient}
        intensity={0.35}
        position={[1.6, 2.4, 1.6]}
        distance={7}
        decay={2}
      />

      <Room palette={ROOM_PALETTE} />
      <Bookshelf palette={ROOM_PALETTE} />
    </>
  );
}

interface CameraRigProps {
  targetYawRef: React.MutableRefObject<number>;
  targetPitchRef: React.MutableRefObject<number>;
}

/**
 * Lee el yaw/pitch deseado de refs externas (controladas por los
 * handlers de drag) y los aplica a la cámara con damping exponencial.
 */
function CameraRig({ targetYawRef, targetPitchRef }: CameraRigProps) {
  const { camera } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);

  useFrame((_, delta) => {
    yaw.current = THREE.MathUtils.damp(yaw.current, targetYawRef.current, DAMP, delta);
    pitch.current = THREE.MathUtils.damp(pitch.current, targetPitchRef.current, DAMP, delta);
    camera.rotation.set(BASE_PITCH + pitch.current, yaw.current, 0, 'YXZ');
  });

  return null;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Reescribe la matriz de proyección de la cámara cada frame para
 * extender SÓLO el borde inferior del frustum. Laterales y borde
 * superior se mantienen exactamente como con un PerspectiveCamera
 * simétrico al `fov` actual.
 *
 * `extraBottom` es la fracción extra que añadimos al `tan(fov/2)`
 * inferior. Ej: 0.30 ⇒ el campo de visión hacia abajo es 30 % mayor
 * que hacia arriba.
 */
function AsymmetricFrustum({ extraBottom }: { extraBottom: number }) {
  useFrame(({ camera, size }) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const aspect = size.width / size.height;
    const near = camera.near;
    const far = camera.far;
    const top = near * Math.tan(halfFov);
    const bottom = -near * Math.tan(halfFov * (1 + extraBottom));
    const right = top * aspect;
    const left = -right;
    camera.projectionMatrix.makePerspective(left, right, top, bottom, near, far);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  });
  return null;
}
