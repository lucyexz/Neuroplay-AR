import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function BrushingCelebration() {
  const pointsRef = useRef<THREE.Points>(null);
  const starsRef = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    const colors = new Float32Array(150 * 3);
    const velocities = new Float32Array(150 * 3);

    const colorPalette = [
      [1, 1, 1],
      [0.8, 0.9, 1],
      [1, 1, 0.8],
      [0.9, 1, 1],
    ];

    for (let i = 0; i < 150; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 3 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      velocities[i * 3] = (Math.random() - 0.5) * 0.03;
      velocities[i * 3 + 1] = -Math.random() * 0.04 - 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.03;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }

    return { positions, colors, velocities };
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < 150; i++) {
        positions[i * 3] += particles.velocities[i * 3];
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

        if (positions[i * 3 + 1] < -2) {
          positions[i * 3 + 1] = 5;
          positions[i * 3] = (Math.random() - 0.5) * 5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (starsRef.current) {
      starsRef.current.rotation.y += 0.01;
      starsRef.current.children.forEach((star, i) => {
        star.rotation.z += 0.02 * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <>
      <Points ref={pointsRef} positions={particles.positions} colors={particles.colors}>
        <PointMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>

      <group ref={starsRef}>
        {[
          [-2, 2, 1],
          [2, 2, 1],
          [-1.5, -1, 1],
          [1.5, -1, 1],
          [0, 2.5, 1],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={2}
            />
            <pointLight intensity={1} color="#FFD700" distance={2} />
          </mesh>
        ))}
      </group>
    </>
  );
}
