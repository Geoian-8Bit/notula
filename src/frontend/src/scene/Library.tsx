import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Bookshelf } from './Bookshelf';

export function Library() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.4, 4.5], fov: 50 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#0f0f10']} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Environment preset="apartment" />
      <Bookshelf />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2.5}
        maxDistance={7}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
