import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

interface ToothProps {
  position: [number, number, number];
  id: number;
  isCleaned: boolean;
  onCleaned: (id: number) => void;
  brushPosition: [number, number, number];
}

function Tooth({ position, id, isCleaned, onCleaned, brushPosition }: ToothProps) {
  const toothRef = useRef<Mesh>(null);
  const dirtRef = useRef<Mesh>(null);
  const dirtOpacity = useRef(1);
  const glowIntensity = useRef(0);

  useFrame(() => {
    if (!toothRef.current || !dirtRef.current) return;

    if (!isCleaned) {
      const toothPos = new Vector3(...position);
      const brushPos = new Vector3(...brushPosition);
      const distance = toothPos.distanceTo(brushPos);

      if (distance < 1.2) {
        dirtOpacity.current = Math.max(0, dirtOpacity.current - 0.02);

        if (dirtOpacity.current <= 0 && !isCleaned) {
          onCleaned(id);
          glowIntensity.current = 1;
        }
      }

      if (dirtRef.current.material && 'opacity' in dirtRef.current.material) {
        dirtRef.current.material.opacity = dirtOpacity.current;
      }
    }

    if (isCleaned && glowIntensity.current > 0) {
      glowIntensity.current = Math.max(0, glowIntensity.current - 0.02);
      if (toothRef.current.material && 'emissive' in toothRef.current.material) {
        (toothRef.current.material as any).emissiveIntensity = glowIntensity.current;
      }
    }

    if (toothRef.current && !isCleaned) {
      toothRef.current.rotation.z = Math.sin(Date.now() * 0.001 + id) * 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={toothRef} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.8, 0.3]} />
        <meshStandardMaterial
          color={isCleaned ? '#FFFFFF' : '#F5F5DC'}
          emissive={isCleaned ? '#FFFFFF' : '#000000'}
          emissiveIntensity={0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {!isCleaned && (
        <mesh ref={dirtRef} position={[0, 0, 0.16]}>
          <planeGeometry args={[0.35, 0.7]} />
          <meshStandardMaterial
            color="#E6C300"
            transparent
            opacity={1}
            roughness={0.8}
          />
        </mesh>
      )}

      {isCleaned && (
        <>
          <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#FFFFFF" distance={2} />
        </>
      )}
    </group>
  );
}

interface TeethProps {
  cleanedTeeth: Set<number>;
  onToothCleaned: (id: number) => void;
  brushPosition: [number, number, number];
}

export function Teeth({ cleanedTeeth, onToothCleaned, brushPosition }: TeethProps) {
  const teethPositions = useMemo<[number, number, number][]>(
    () => [
      [-1.5, 0.8, 0],
      [-0.5, 1, 0],
      [0.5, 1, 0],
      [1.5, 0.8, 0],
      [-1.5, -0.8, 0],
      [-0.5, -1, 0],
      [0.5, -1, 0],
      [1.5, -0.8, 0],
    ],
    []
  );

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0, -0.5]} receiveShadow>
        <boxGeometry args={[4, 3.5, 0.3]} />
        <meshStandardMaterial color="#FFB6C1" roughness={0.7} />
      </mesh>

      <mesh position={[0, 1.8, -0.3]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[4.2, 0.6, 0.5]} />
        <meshStandardMaterial color="#FFC0CB" />
      </mesh>

      <mesh position={[0, -1.8, -0.3]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[4.2, 0.6, 0.5]} />
        <meshStandardMaterial color="#FFC0CB" />
      </mesh>

      {teethPositions.map((pos, index) => (
        <Tooth
          key={index}
          position={pos}
          id={index}
          isCleaned={cleanedTeeth.has(index)}
          onCleaned={onToothCleaned}
          brushPosition={brushPosition}
        />
      ))}
    </group>
  );
}
