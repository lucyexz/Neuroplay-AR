import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { Street } from './Street';
import { TrafficLight } from './TrafficLight';
import { Character } from './Character';
import { SuccessStars } from './SuccessStars';

interface GameWrapperProps {
  onComplete: () => void;
}

export function GameWrapper({ onComplete }: GameWrapperProps) {
  const [phase, setPhase] = useState<'waiting' | 'green' | 'walking' | 'success'>('waiting');
  const [characterZ, setCharacterZ] = useState(-6);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    if (phase === 'waiting') {
      const timer = setTimeout(() => {
        setPhase('green');
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (phase === 'green') {
      const timer = setTimeout(() => {
        setPhase('walking');
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (phase === 'walking') {
      const interval = setInterval(() => {
        setCharacterZ((prev) => {
          const newZ = prev + 0.15;
          if (newZ >= 6) {
            clearInterval(interval);
            setPhase('success');
            setShowStars(true);
            setTimeout(() => {
              onComplete();
            }, 3000);
            return 6;
          }
          return newZ;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [phase, onComplete]);

  const isGreen = phase === 'green' || phase === 'walking' || phase === 'success';
  const isWalking = phase === 'walking';

  return (
    <div className="relative w-full h-screen">
      <Canvas
        shadows
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={60} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />

          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <Environment preset="sunset" />

          <Street />
          <TrafficLight position={[-3, 0, -6]} isGreen={isGreen} />
          <TrafficLight position={[3, 0, -6]} isGreen={isGreen} />
          <Character position={[0, 0.5, characterZ]} isWalking={isWalking} />

          {showStars && <SuccessStars />}
        </Suspense>
      </Canvas>

      <div className="absolute top-6 left-6 right-6 pointer-events-none">
        {phase === 'waiting' && (
          <div className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-lg text-center text-lg sm:text-xl font-semibold">
            Espere o sinal ficar verde...
          </div>
        )}

        {phase === 'green' && (
          <div className="bg-green-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-lg text-center text-lg sm:text-xl font-semibold">
            Verde! Agora podemos atravessar!
          </div>
        )}

        {phase === 'walking' && (
          <div className="bg-blue-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-lg text-center text-lg sm:text-xl font-semibold">
            Atravessando com calma...
          </div>
        )}

        {phase === 'success' && (
          <div className="bg-purple-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-lg text-center text-lg sm:text-xl font-semibold">
            Você conseguiu! Atravessou com segurança! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
