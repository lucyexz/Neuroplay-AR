import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TrafficLightProps {
  position: [number, number, number];
  isGreen: boolean;
}

export function TrafficLight({ position, isGreen }: TrafficLightProps) {
  const lightRef = useRef<THREE.Mesh>(null);
  const [glowIntensity, setGlowIntensity] = useState(1);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    setGlowIntensity(0.8 + Math.sin(time * 2) * 0.2);
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.3, 2, 0.2]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      <mesh ref={lightRef} position={[0, 2.2, 0.11]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial
          color={isGreen ? '#00ff00' : '#ff0000'}
          emissive={isGreen ? '#00ff00' : '#ff0000'}
          emissiveIntensity={glowIntensity}
        />
      </mesh>

      <mesh position={[0, 1.8, 0.11]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial
          color={isGreen ? '#004400' : '#440000'}
          emissive={isGreen ? '#004400' : '#440000'}
          emissiveIntensity={0.2}
        />
      </mesh>

      {isGreen && (
        <pointLight
          position={[0, 2.2, 0.5]}
          color="#00ff00"
          intensity={glowIntensity * 2}
          distance={5}
        />
      )}

      {!isGreen && (
        <pointLight
          position={[0, 2.2, 0.5]}
          color="#ff0000"
          intensity={glowIntensity * 2}
          distance={5}
        />
      )}
    </group>
  );
}
