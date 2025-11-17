import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '../../store/gameStore';

export function Stars() {
  const groupRef = useRef<Group>(null);
  const stars = useGameStore((state) => state.stars);

  useFrame((state) => {
    if (groupRef.current && stars) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time;
      groupRef.current.position.y = 2 + Math.sin(time * 2) * 0.3;
    }
  });

  if (!stars) return null;

  const starPositions = [
    [0, 0, 0],
    [0.8, 0.3, 0],
    [-0.8, 0.3, 0],
    [0.5, 0.8, 0],
    [-0.5, 0.8, 0],
    [0, 1.2, 0]
  ];

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {starPositions.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0]} color="#ffd700" intensity={2} distance={3} />
    </group>
  );
}
