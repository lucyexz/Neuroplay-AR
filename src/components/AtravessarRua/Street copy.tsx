export function Street() {
  return (
    <group>
      {/* Chão da rua */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Calçada esquerda */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, -0.49, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#b8b8b8" />
      </mesh>

      {/* Calçada direita */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.49, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#b8b8b8" />
      </mesh>

      {/* Faixa de pedestres - listras brancas */}
      {[-2, -1, 0, 1, 2].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, z]}>
          <planeGeometry args={[6, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Linha central da rua - amarela */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 4]}>
        <planeGeometry args={[6, 0.1]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, -4]}>
        <planeGeometry args={[6, 0.1]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>

      {/* Árvores decorativas na calçada esquerda */}
      {[-3, 0, 3].map((z, i) => (
        <group key={`tree-left-${i}`} position={[-7, 0, z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[0.5, 1, 8]} />
            <meshStandardMaterial color="#90ee90" />
          </mesh>
        </group>
      ))}

      {/* Árvores decorativas na calçada direita */}
      {[-3, 0, 3].map((z, i) => (
        <group key={`tree-right-${i}`} position={[7, 0, z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[0.5, 1, 8]} />
            <meshStandardMaterial color="#90ee90" />
          </mesh>
        </group>
      ))}

      {/* Prédio simples ao fundo */}
      <mesh position={[-8, 2, -5]}>
        <boxGeometry args={[3, 4, 2]} />
        <meshStandardMaterial color="#e8d4b8" />
      </mesh>

      <mesh position={[8, 2, -5]}>
        <boxGeometry args={[3, 4, 2]} />
        <meshStandardMaterial color="#d4c4a8" />
      </mesh>

      {/* Céu/fundo */}
      <mesh position={[0, 5, -10]}>
        <planeGeometry args={[30, 15]} />
        <meshBasicMaterial color="#87ceeb" />
      </mesh>

      {/* Nuvens decorativas */}
      <group position={[-5, 7, -9]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.4, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[4, 6, -9]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
