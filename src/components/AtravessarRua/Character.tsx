import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
  isWalking: boolean;
}

export function Character({ position, isWalking }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (isWalking) {
      const time = state.clock.getElapsedTime();
      const walkCycle = Math.sin(time * 5);

      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = walkCycle * 0.5;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -walkCycle * 0.5;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -walkCycle * 0.3;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = walkCycle * 0.3;
      }

      if (groupRef.current) {
        groupRef.current.position.y = position[1] + Math.abs(Math.sin(time * 5)) * 0.1;
      }
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;

      if (groupRef.current) {
        groupRef.current.position.y = position[1];
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.6, 16]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>

      <mesh ref={leftLegRef} position={[-0.12, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      <mesh ref={rightLegRef} position={[0.12, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      <mesh ref={leftArmRef} position={[-0.35, 0.4, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      <mesh ref={rightArmRef} position={[0.35, 0.4, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      <mesh position={[-0.1, 0.85, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      <mesh position={[0.1, 0.85, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      <mesh position={[0, 0.7, 0.25]} rotation={[0, 0, Math.PI]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
    </group>
  );
}
