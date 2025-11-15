import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export function CalmBackground() {
  const particlesRef = useRef<Mesh[]>([]);
  const wavesRef = useRef<Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        particle.position.y = Math.sin(time * 0.3 + i) * 0.5;
        particle.scale.setScalar(0.8 + Math.sin(time * 0.5 + i) * 0.2);
      }
    });

    wavesRef.current.forEach((wave, i) => {
      if (wave) {
        wave.rotation.z = time * 0.1 * (i % 2 === 0 ? 1 : -1);
        wave.scale.setScalar(1 + Math.sin(time * 0.3 + i) * 0.1);
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.3} />

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <mesh
            key={`particle-${i}`}
            position={[x, y, -5]}
            ref={(el) => {
              if (el) particlesRef.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#A5D6FF' : i % 3 === 1 ? '#C3B1E1' : '#B8E6D5'}
              transparent
              opacity={0.4}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`wave-${i}`}
          position={[0, 0, -8 - i * 2]}
          ref={(el) => {
            if (el) wavesRef.current[i] = el;
          }}
        >
          <torusGeometry args={[4 + i * 2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#D5E8F7' : '#E8D5F7'}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}
