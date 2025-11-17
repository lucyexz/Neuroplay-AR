import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Street() {
  const roadRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (roadRef.current) {
      const time = state.clock.getElapsedTime();
      roadRef.current.position.y = Math.sin(time * 0.5) * 0.02;
    }
  });

  return (
    <group>
      <mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <planeGeometry args={[2, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {[-2, -1, 0, 1, 2].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[-5, -0.49, z * 3]}>
          <planeGeometry args={[1, 0.3]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
      ))}

      {[-2, -1, 0, 1, 2].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.49, z * 3]}>
          <planeGeometry args={[1, 0.3]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, -0.47, 0]} receiveShadow>
        <planeGeometry args={[4, 20]} />
        <meshStandardMaterial color="#90ee90" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, -0.47, 0]} receiveShadow>
        <planeGeometry args={[4, 20]} />
        <meshStandardMaterial color="#90ee90" />
      </mesh>
    </group>
  );
}
