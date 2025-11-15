import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

interface SchoolItemProps {
  type: 'pencil' | 'notebook' | 'bottle' | 'eraser' | 'ruler' | 'scissors';
  position: [number, number, number];
  onCollected: () => void;
  isCollected: boolean;
}

export function SchoolItem({ type, position, onCollected, isCollected }: SchoolItemProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const targetPos = useRef(new Vector3(0, 0, 0));
  const startPos = useRef(new Vector3(...position));

  useFrame((state) => {
    if (!meshRef.current) return;

    if (!isMoving && !isCollected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }

    if (isMoving && meshRef.current) {
      const currentPos = meshRef.current.position;
      const distance = currentPos.distanceTo(targetPos.current);

      if (distance > 0.1) {
        currentPos.lerp(targetPos.current, 0.08);
        meshRef.current.rotation.x += 0.1;
        meshRef.current.rotation.y += 0.1;
      } else {
        setIsMoving(false);
        onCollected();
      }
    }
  });

  const handleClick = () => {
    if (!isCollected && !isMoving) {
      setIsMoving(true);
      targetPos.current.set(0, 0, 0);
      if (typeof window !== 'undefined') {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4NVKno7bVhGgU7ltryxnMpBSh+zO/cjT0KF2G36+ihUREMTqfj8LdlHAY5k9n0y3orBSd7xu/dijwKFluz6+mjUxENUKjl7bNfGAU6mtvyxXQpBSaByO/ajD4KGGCz6OifUBEMTqnh7rVjGwU7nNv0yHYpBSh7xu/aizsKFl226eqkVBIMUarj7bVhGgU6nN30yHUpBSl8xe/ai0AKFluz6emiUxANU6vk8LRiGgY8nN30yHQqBSh8xO/di0EKGVy16OqjUhALT6rm7rZjGgU7n9z0x3MqBSh9xO/dikAKGF216+mjUhEKTavk8LRiGgU8nN30yXUrBSl8xO/bjEEKGl216+qjURALTqrm7rVhGgY7nN30yHUpBSl8xO/bjEEKGl216+qiUhAKTqvl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl226+qiURAKTqrk7rVhGgY8nN30yHYqBSl8xO/bjEEKGl226+qiURENUqvl7rVhGgY7nN30yHYrBSl8xO/bjEEKGl216+qjURALTqrk7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALTqrl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/b');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }
  };

  const getGeometry = () => {
    switch (type) {
      case 'pencil':
        return (
          <>
            <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
            <meshStandardMaterial color="#FFD93D" />
          </>
        );
      case 'notebook':
        return (
          <>
            <boxGeometry args={[0.8, 1, 0.1]} />
            <meshStandardMaterial color="#6BCB77" />
          </>
        );
      case 'bottle':
        return (
          <>
            <cylinderGeometry args={[0.15, 0.2, 1, 16]} />
            <meshStandardMaterial color="#4D96FF" />
          </>
        );
      case 'eraser':
        return (
          <>
            <boxGeometry args={[0.4, 0.2, 0.6]} />
            <meshStandardMaterial color="#FFB6D9" />
          </>
        );
      case 'ruler':
        return (
          <>
            <boxGeometry args={[0.15, 1.5, 0.05]} />
            <meshStandardMaterial color="#FFA36C" />
          </>
        );
      case 'scissors':
        return (
          <>
            <boxGeometry args={[0.5, 0.3, 0.1]} />
            <meshStandardMaterial color="#B983FF" />
          </>
        );
      default:
        return null;
    }
  };

  if (isCollected && !isMoving) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered && !isMoving ? 1.2 : 1}
    >
      {getGeometry()}
    </mesh>
  );
}
