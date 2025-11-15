import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function Confetti() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    const velocities = new Float32Array(200 * 3);

    const colorPalette = [
      [1, 0.4, 0.4],
      [0.4, 1, 0.4],
      [0.4, 0.4, 1],
      [1, 1, 0.4],
      [1, 0.4, 1],
      [0.4, 1, 1],
    ];

    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 2 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -Math.random() * 0.05 - 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

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

      for (let i = 0; i < 200; i++) {
        positions[i * 3] += particles.velocities[i * 3];
        positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
        positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

        if (positions[i * 3 + 1] < -1) {
          positions[i * 3 + 1] = 5;
          positions[i * 3] = (Math.random() - 0.5) * 4;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles.positions} colors={particles.colors}>
      <PointMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}
