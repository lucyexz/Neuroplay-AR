import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useGameStore } from '../store/gameStore';

export function TrafficLight() {
  const redLightRef = useRef<Mesh>(null);
  const greenLightRef = useRef<Mesh>(null);
  const trafficLight = useGameStore((state) => state.trafficLight);
  const setTrafficLight = useGameStore((state) => state.setTrafficLight);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLight(trafficLight === 'red' ? 'green' : 'red');

      if (trafficLight === 'red') {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4EYrXn66lYFQhJouL0vXAiBziM0/HPeCsGI3fI8N2RQAoVXbTq66lTFApGn+DywmwhBjCG0PPUgjQGHm++7+OYUg4FYrXn66lYFQhJoeLzw';
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [trafficLight, setTrafficLight]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (redLightRef.current && trafficLight === 'red') {
      redLightRef.current.material.emissiveIntensity = 0.8 + Math.sin(time * 3) * 0.2;
    }
    if (greenLightRef.current && trafficLight === 'green') {
      greenLightRef.current.material.emissiveIntensity = 0.8 + Math.sin(time * 3) * 0.2;
    }
  });

  return (
    <group position={[4, 2, -3]}>
      {/* Poste */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Caixa do semáforo */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 1.2, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Luz vermelha */}
      <mesh ref={redLightRef} position={[0, 0.35, 0.16]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial
          color={trafficLight === 'red' ? '#ff0000' : '#440000'}
          emissive={trafficLight === 'red' ? '#ff0000' : '#000000'}
          emissiveIntensity={trafficLight === 'red' ? 1 : 0}
        />
      </mesh>

      {/* Luz verde */}
      <mesh ref={greenLightRef} position={[0, -0.35, 0.16]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial
          color={trafficLight === 'green' ? '#00ff00' : '#004400'}
          emissive={trafficLight === 'green' ? '#00ff00' : '#000000'}
          emissiveIntensity={trafficLight === 'green' ? 1 : 0}
        />
      </mesh>

      {/* Luz pontual */}
      {trafficLight === 'red' && (
        <pointLight position={[0, 0.35, 0.5]} color="#ff0000" intensity={2} distance={5} />
      )}
      {trafficLight === 'green' && (
        <pointLight position={[0, -0.35, 0.5]} color="#00ff00" intensity={2} distance={5} />
      )}
    </group>
  );
}
