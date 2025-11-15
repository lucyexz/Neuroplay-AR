import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Teeth } from './Teeth';
import { Toothbrush } from './Toothbrush';
import { BrushingCelebration } from './BrushingCelebration';

interface ToothBrushingSceneProps {
  onComplete: () => void;
  resetTrigger: number;
}

export function ToothBrushingScene({ onComplete, resetTrigger }: ToothBrushingSceneProps) {
  const [cleanedTeeth, setCleanedTeeth] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [brushPosition, setBrushPosition] = useState<[number, number, number]>([0, 0, 2]);
  const totalTeeth = 8;

  const handleToothCleaned = (toothId: number) => {
    setCleanedTeeth((prev) => {
      const newSet = new Set(prev);
      if (!newSet.has(toothId)) {
        newSet.add(toothId);

        if (typeof window !== 'undefined') {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4NVKno7bVhGgU7ltryxnMpBSh+zO/cjT0KF2G36+ihUREMTqfj8LdlHAY5k9n0y3orBSd7xu/dijwKFluz6+mjUxENUKjl7bNfGAU6mtvyxXQpBSaByO/ajD4KGGCz6OifUBEMTqnh7rVjGwU7nNv0yHYpBSh7xu/aizsKFl226eqkVBIMUarj7bVhGgU6nN30yHUpBSl8xe/ai0AKFluz6emiUxANU6vk8LRiGgY8nN30yHQqBSh8xO/di0EKGVy16OqjUhALT6rm7rZjGgU7n9z0x3MqBSh9xO/dikAKGF216+mjUhEKTavk8LRiGgU8nN30yXUrBSl8xO/bjEEKGl216+qjURALTqrm7rVhGgY7nN30yHUpBSl8xO/bjEEKGl216+qiUhAKTqvl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl226+qiURAKTqrk7rVhGgY8nN30yHYqBSl8xO/bjEEKGl226+qiURENUqvl7rVhGgY7nN30yHYrBSl8xO/bjEEKGl216+qjURALTqrk7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALTqrl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/b');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        }

        if (newSet.size === totalTeeth) {
          setShowCelebration(true);
          onComplete();
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4NVKno7bVhGgU7ltryxnMpBSh+zO/cjT0KF2G36+ihUREMTqfj8LdlHAY5k9n0y3orBSd7xu/dijwKFluz6+mjUxENUKjl7bNfGAU6mtvyxXQpBSaByO/ajD4KGGCz6OifUBEMTqnh7rVjGwU7nNv0yHYpBSh7xu/aizsKFl226eqkVBIMUarj7bVhGgU6nN30yHUpBSl8xe/ai0AKFluz6emiUxANU6vk8LRiGgY8nN30yHQqBSh8xO/di0EKGVy16OqjUhALT6rm7rZjGgU7n9z0x3MqBSh9xO/dikAKGF216+mjUhEKTavk8LRiGgU8nN30yXUrBSl8xO/bjEEKGl216+qjURALTqrm7rVhGgY7nN30yHUpBSl8xO/bjEEKGl216+qiUhAKTqvl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl226+qiURAKTqrk7rVhGgY8nN30yHYqBSl8xO/bjEEKGl226+qiURENUqvl7rVhGgY7nN30yHYrBSl8xO/bjEEKGl216+qjURALTqrk7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALTqrl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/b');
              audio.volume = 0.5;
              audio.play().catch(() => {});
            }
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
