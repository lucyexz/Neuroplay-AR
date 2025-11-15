import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Teeth } from './Teeth';
import { Toothbrush } from './Toothbrush';
import { BrushingCelebration } from './BrushingCelebration';
import { useBrushingSound } from '../hooks/useBrushingSound';

interface ToothBrushingSceneProps {
  onComplete: () => void;
  resetTrigger: number;
}

export function ToothBrushingScene({ onComplete, resetTrigger }: ToothBrushingSceneProps) {
  const [cleanedTeeth, setCleanedTeeth] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [brushPosition, setBrushPosition] = useState<[number, number, number]>([0, 0, 2]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const totalTeeth = 8;
  const { playSparkleSound, playEncouragementSound, playCelebrationSound } = useBrushingSound({
    enabled: soundEnabled,
    volume: 0.3,
  });

  const handleToothCleaned = (toothId: number) => {
    setCleanedTeeth((prev) => {
      const newSet = new Set(prev);
      if (!newSet.has(toothId)) {
        newSet.add(toothId);

        playSparkleSound();

        if (newSet.size % 2 === 0 && newSet.size < totalTeeth) {
          playEncouragementSound();
        }

        if (newSet.size === totalTeeth) {
          setShowCelebration(true);
          onComplete();
          setTimeout(() => {
            playCelebrationSound();
          }, 300);
        }
      }
      return newSet;
    });
  };

  if (resetTrigger > 0) {
    if (cleanedTeeth.size > 0) {
      setCleanedTeeth(new Set());
      setShowCelebration(false);
      setBrushPosition([0, 0, 2]);
    }
  }

  const progressPercentage = Math.round((cleanedTeeth.size / totalTeeth) * 100);

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'linear-gradient(135deg, #E0F7FA 0%, #FFF9E6 100%)' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={12}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
          />

          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={0.9} castShadow />
          <pointLight position={[-5, 3, 3]} intensity={0.4} color="#B3E5FC" />
          <pointLight position={[5, 3, 3]} intensity={0.4} color="#FFF9C4" />

          <Environment preset="dawn" />

          <Teeth
            cleanedTeeth={cleanedTeeth}
            onToothCleaned={handleToothCleaned}
            brushPosition={brushPosition}
          />

          <Toothbrush
            position={brushPosition}
            onPositionChange={setBrushPosition}
            soundEnabled={soundEnabled}
          />

          {showCelebration && <BrushingCelebration />}
        </Suspense>
      </Canvas>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <p className="text-lg font-semibold text-gray-800">
            Limpando o sorriso: {progressPercentage}%
          </p>
        </div>
      </div>

      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute top-6 right-6 z-10 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
        aria-label={soundEnabled ? 'Desligar som' : 'Ligar som'}
      >
        {soundEnabled ? (
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </button>

      {progressPercentage < 100 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-blue-100/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
            <p className="text-base font-medium text-blue-800">
              Arraste a escova sobre os dentes
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
