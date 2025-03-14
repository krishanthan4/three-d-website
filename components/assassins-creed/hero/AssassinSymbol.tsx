'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

export default function AssassinSymbol() {
  const mesh = useLoader(TextureLoader, '/images/assassins-creed/assassin-symbol.png')
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Levitating and rotating effect
    state.camera.lookAt(0, 0, 0)
    state.camera.position.y = Math.sin(time * 0.2) * 0.3 + 2
  })

  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial 
        map={mesh} 
        transparent={true} 
        emissive="#ff0000"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}
