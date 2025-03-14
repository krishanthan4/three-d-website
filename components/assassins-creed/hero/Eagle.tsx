'use client'

import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Eagle() {
  const { scene } = useGLTF('/models/assassins-creed/golden_eagle.glb')
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Flying animation path - adjusted to be lower and more visible
    scene.position.x = Math.sin(time * 0.2) * 10
    scene.position.y = Math.sin(time * 0.4) * 2 + 4 
    scene.position.z = Math.cos(time * 0.2) * 10
    
    // Banking animation
    scene.rotation.z = Math.sin(time * 0.2) * 0.2
    scene.rotation.y = Math.atan2(
      Math.cos(time * 0.2) * -10,
      Math.sin(time * 0.2) * -10
    )
  })

  return <primitive object={scene} scale={0.5} />
}
