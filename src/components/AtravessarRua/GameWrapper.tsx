import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { Street } from './Street';
import { TrafficLight } from './TrafficLight';
import { Character } from './Character';
import { Stars } from './Stars';
import { UI } from './UI';

interface GameWrapperProps {
  onComplete: () => void;
}

export function GameWrapper({ onComplete }: GameWrapperProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas
        shadows
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={60} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
            touches={{
              ONE: 2,
              TWO: 0
            }}
          />

          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          <Environment preset="sunset" />

          <Street />
          <TrafficLight />
          <Character />
          <Stars />
        </Suspense>
      </Canvas>

      <UI />
    </div>
  );
}
