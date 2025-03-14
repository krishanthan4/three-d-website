'use client'

export default function Environment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2}
        castShadow 
        shadow-mapSize={1024}
      />
      <spotLight
        position={[0, 10, 0]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        castShadow
        target-position={[0, -2, 0]}
      />
      <fog attach="fog" args={['#000000', 5, 30]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
    </>
  )
}
