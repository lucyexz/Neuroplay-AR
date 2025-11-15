import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Backpack } from './Backpack';
import { SchoolItem } from './SchoolItem';
import { Suspense, useState } from 'react';
import { Confetti } from './Confetti';

interface Item {
  id: string;
  type: 'pencil' | 'notebook' | 'bottle' | 'eraser' | 'ruler' | 'scissors';
  position: [number, number, number];
  collected: boolean;
}

const initialItems: Item[] = [
  { id: '1', type: 'pencil', position: [-2, 1, 1], collected: false },
  { id: '2', type: 'notebook', position: [2, 1.5, 1], collected: false },
  { id: '3', type: 'bottle', position: [-1.5, 2, -1], collected: false },
  { id: '4', type: 'eraser', position: [2.5, 1, -1], collected: false },
  { id: '5', type: 'ruler', position: [-2.5, 1.8, 0], collected: false },
  { id: '6', type: 'scissors', position: [1.8, 1.2, -1.5], collected: false },
];

interface Scene3DProps {
  onComplete: () => void;
  resetTrigger: number;
}

export function Scene3D({ onComplete, resetTrigger }: Scene3DProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleItemCollected = (itemId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, collected: true } : item
      );

      const allCollected = newItems.every((item) => item.collected);
      if (allCollected) {
        setShowConfetti(true);
        onComplete();
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4NVKno7bVhGgU7ltryxnMpBSh+zO/cjT0KF2G36+ihUREMTqfj8LdlHAY5k9n0y3orBSd7xu/dijwKFluz6+mjUxENUKjl7bNfGAU6mtvyxXQpBSaByO/ajD4KGGCz6OifUBEMTqnh7rVjGwU7nNv0yHYpBSh7xu/aizsKFl226eqkVBIMUarj7bVhGgU6nN30yHUpBSl8xe/ai0AKFluz6emiUxANU6vk8LRiGgY8nN30yHQqBSh8xO/di0EKGVy16OqjUhALT6rm7rZjGgU7n9z0x3MqBSh9xO/dikAKGF216+mjUhEKTavk8LRiGgU8nN30yXUrBSl8xO/bjEEKGl216+qjURALTqrm7rVhGgY7nN30yHUpBSl8xO/bjEEKGl216+qiUhAKTqvl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl226+qiURAKTqrk7rVhGgY8nN30yHYqBSl8xO/bjEEKGl226+qiURENUqvl7rVhGgY7nN30yHYrBSl8xO/bjEEKGl216+qjURALTqrk7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALTqrl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/b');
            audio.volume = 0.4;
            audio.play().catch(() => {});
          }
        }, 300);
      }

      return newItems;
    });
  };

  if (resetTrigger > 0) {
    if (items.some((item) => item.collected)) {
      setItems(initialItems);
      setShowConfetti(false);
    }
  }

  return (
    <Canvas
      shadows
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #FFF9C4 100%)' }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
        />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.4} color="#FFE5B4" />

        <Environment preset="sunset" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#A8E6CF" opacity={0.8} transparent />
        </mesh>

        <Backpack position={[0, 0, 0]} />

        {items.map((item) => (
          <SchoolItem
            key={item.id}
            type={item.type}
            position={item.position}
            onCollected={() => handleItemCollected(item.id)}
            isCollected={item.collected}
          />
        ))}

        {showConfetti && <Confetti />}
      </Suspense>
    </Canvas>
  );
}
