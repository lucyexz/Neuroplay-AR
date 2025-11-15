import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface BackpackProps {
  position?: [number, number, number];
}

export function Backpack({ position = [0, 0, 0] }: BackpackProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[1.5, 2, 0.8]} />
      <meshStandardMaterial color="#FF6B6B" />

      <mesh position={[0, 0.3, 0.41]}>
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#FF8787" />
      </mesh>

      <mesh position={[-0.4, 0.9, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.8, 16]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[0.4, 0.9, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.8, 16]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
    </mesh>
  );
}
