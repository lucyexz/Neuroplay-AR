import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '../../store/gameStore';

export function Character() {
  const groupRef = useRef<Group>(null);
  const characterPosition = useGameStore((state) => state.characterPosition);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const setCharacterPosition = useGameStore((state) => state.setCharacterPosition);
  const setGamePhase = useGameStore((state) => state.setGamePhase);
  const setMessage = useGameStore((state) => state.setMessage);
  const setStars = useGameStore((state) => state.setStars);

  useEffect(() => {
    if (gamePhase === 'crossing') {
      const interval = setInterval(() => {
        setCharacterPosition(characterPosition + 0.05);

        if (characterPosition >= 6) {
          clearInterval(interval);
          setGamePhase('success');
          setMessage('🌟 Muito bem! Você atravessou com segurança!', true);
          setStars(true);

          const audio = new Audio();
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ4EYrXn66lYFQhJouL0vXAiBziM0/HPeCsGI3fI8N2RQAoVXbTq66lTFApGn+DywmwhBjCG0PPUgjQGHm++7+OYUg4FYrXn66lYFQhJoeLzw';
          audio.volume = 0.4;
          audio.play().catch(() => {});

          setTimeout(() => {
            setMessage('', false);
            setStars(false);
            setCharacterPosition(0);
            setGamePhase('waiting');
          }, 3000);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gamePhase, characterPosition, setCharacterPosition, setGamePhase, setMessage, setStars]);

  useFrame((state) => {
    if (groupRef.current && gamePhase === 'waiting') {
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[characterPosition - 3, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.4, 16, 32]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#ffd4a3" />
      </mesh>

      <mesh position={[0.15, 0.95, 0.12]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      <mesh position={[0.15, 0.95, -0.12]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      <mesh position={[0.18, 0.82, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      <mesh position={[0, 0.3, 0.25]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      <mesh position={[0, 0.3, -0.25]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      <mesh position={[0, -0.2, 0.1]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      <mesh position={[0, -0.2, -0.1]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
    </group>
  );
}
