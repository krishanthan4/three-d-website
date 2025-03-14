'use client'
import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function ArtifactModel({ 
  modelPath, 
  rotating = false,
  scale = 1
}: { 
  modelPath: string, 
  rotating?: boolean,
  scale?: number
}) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (modelRef.current && rotating) {
      modelRef.current.rotation.y += 0.005
    }
  })
  
  return (
    <group ref={modelRef} scale={scale}>
      <primitive object={scene} position={[0, 0, 0]} />
    </group>
  )
}
