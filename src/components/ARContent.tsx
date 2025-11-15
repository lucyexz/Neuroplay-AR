import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Group } from 'three';
import { Backpack } from './Backpack';
import { SchoolItem } from './SchoolItem';
import { Confetti } from './Confetti';
import { Environment } from '@react-three/drei';

interface Item {
  id: string;
  type: 'pencil' | 'notebook' | 'bottle' | 'eraser' | 'ruler' | 'scissors';
  position: [number, number, number];
  collected: boolean;
}

const initialItems: Item[] = [
  { id: '1', type: 'pencil', position: [-0.3, 0.2, 0.15], collected: false },
  { id: '2', type: 'notebook', position: [0.3, 0.25, 0.15], collected: false },
  { id: '3', type: 'bottle', position: [-0.25, 0.3, -0.15], collected: false },
  { id: '4', type: 'eraser', position: [0.35, 0.2, -0.15], collected: false },
  { id: '5', type: 'ruler', position: [-0.35, 0.28, 0], collected: false },
  { id: '6', type: 'scissors', position: [0.28, 0.22, -0.25], collected: false },
];

export function ARContent() {
  const groupRef = useRef<Group>(null);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [showConfetti, setShowConfetti] = useState(false);
  const { isPresenting } = useXR();

  const handleItemCollected = (itemId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, collected: true } : item
      );

      const allCollected = newItems.every((item) => item.collected);
      if (allCollected) {
        setShowConfetti(true);
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4NVKno7bVhGgU7ltryxnMpBSh+zO/cjT0KF2G36+ihUREMTqfj8LdlHAY5k9n0y3orBSd7xu/dijwKFluz6+mjUxENUKjl7bNfGAU6mtvyxXQpBSaByO/ajD4KGGCz6OifUBEMTqnh7rVjGwU7nNv0yHYpBSh7xu/aizsKFl226eqkVBIMUarj7bVhGgU6nN30yHUpBSl8xe/ai0AKFluz6emiUxANU6vk8LRiGgY8nN30yHQqBSh8xO/di0EKGVy16OqjUhALT6rm7rZjGgU7n9z0x3MqBSh9xO/dikAKGF216+mjUhEKTavk8LRiGgU8nN30yXUrBSl8xO/bjEEKGl216+qjURALTqrm7rVhGgY7nN30yHUpBSl8xO/bjEEKGl216+qiUhAKTqvl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl226+qiURAKTqrk7rVhGgY8nN30yHYqBSl8xO/bjEEKGl226+qiURENUqvl7rVhGgY7nN30yHYrBSl8xO/bjEEKGl216+qjURALTqrk7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALTqrl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/b');
            audio.volume = 0.4;
            audio.play().catch(() => {});
          }, 300);
        }
      }

      return newItems;
    });
  };

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <Environment preset="sunset" />

      <group ref={groupRef} position={[0, -0.5, -1.5]}>
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

        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial color="#A8E6CF" transparent opacity={0.3} />
        </mesh>
      </group>
    </>
  );
}
