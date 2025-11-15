import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Raycaster, Vector2 } from 'three';

interface ToothbrushProps {
  position: [number, number, number];
  onPositionChange: (position: [number, number, number]) => void;
}

export function Toothbrush({ position, onPositionChange }: ToothbrushProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl, size } = useThree();
  const targetPosition = useRef(new Vector3(...position));
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const lastSoundTime = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (event: PointerEvent | TouchEvent) => {
      setIsDragging(true);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    const handlePointerMove = (event: PointerEvent | TouchEvent) => {
      if (!isDragging && event.type !== 'touchmove') return;

      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      mouse.current.x = (clientX / size.width) * 2 - 1;
      mouse.current.y = -(clientY / size.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      const distance = 8;
      const newPosition = raycaster.current.ray.origin
        .clone()
        .add(raycaster.current.ray.direction.clone().multiplyScalar(distance));

      targetPosition.current.copy(newPosition);
      targetPosition.current.z = Math.min(Math.max(newPosition.z, -2), 4);

      const now = Date.now();
      if (now - lastSoundTime.current > 150) {
        lastSoundTime.current = now;
        if (typeof window !== 'undefined') {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4NVKno7bVhGgU7ltryxnMpBSh+zO/cjT0KF2G36+ihUREMTqfj8LdlHAY5k9n0y3orBSd7xu/dijwKFluz6+mjUxENUKjl7bNfGAU6mtvyxXQpBSaByO/ajD4KGGCz6OifUBEMTqnh7rVjGwU7nNv0yHYpBSh7xu/aizsKFl226eqkVBIMUarj7bVhGgU6nN30yHUpBSl8xe/ai0AKFluz6emiUxANU6vk8LRiGgY8nN30yHQqBSh8xO/di0EKGVy16OqjUhALT6rm7rZjGgU7n9z0x3MqBSh9xO/dikAKGF216+mjUhEKTavk8LRiGgU8nN30yXUrBSl8xO/bjEEKGl216+qjURALTqrm7rVhGgY7nN30yHUpBSl8xO/bjEEKGl216+qiUhAKTqvl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl226+qiURAKTqrk7rVhGgY8nN30yHYqBSl8xO/bjEEKGl226+qiURENUqvl7rVhGgY7nN30yHYrBSl8xO/bjEEKGl216+qjURALTqrk7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALTqrl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/bjEEKGl216+qiUhALT6rl7rVhGgY7nN30yHYqBSl8xO/b');
          audio.volume = 0.15;
          audio.play().catch(() => {});
        }
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('touchstart', handlePointerDown);
    canvas.addEventListener('touchend', handlePointerUp);
    canvas.addEventListener('touchmove', handlePointerMove);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchend', handlePointerUp);
      canvas.removeEventListener('touchmove', handlePointerMove);
    };
  }, [isDragging, camera, gl.domElement, size]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPosition.current, 0.15);
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.005) * 0.1;

      onPositionChange([
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z,
      ]);
    }

    if (meshRef.current && isDragging) {
      meshRef.current.rotation.x += 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.12, 1.5, 16]} />
        <meshStandardMaterial color="#4FC3F7" roughness={0.4} metalness={0.2} />
      </mesh>

      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.35]} />
        <meshStandardMaterial color="#81C784" roughness={0.6} />
      </mesh>

      <group position={[0, 1.1, 0]}>
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const x = Math.cos(angle) * 0.06;
          const z = Math.sin(angle) * 0.06;
          return (
            <mesh key={i} position={[x, 0, z]}>
              <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
              <meshStandardMaterial color="#E3F2FD" />
            </mesh>
          );
        })}
      </group>

      <pointLight position={[0, 0.8, 0]} intensity={0.3} color="#4FC3F7" distance={2} />
    </group>
  );
}
