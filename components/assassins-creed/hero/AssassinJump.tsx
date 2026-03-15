'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, useGLTF, Center, Text, useHelper } from '@react-three/drei'
import { Group, Vector3, Box3, BoxHelper } from 'three'
import * as THREE from 'three'

// Define interfaces for the GLTF result
type GLTFResult = {
  nodes: Record<string, THREE.Object3D>
  materials: Record<string, THREE.Material>
  animations: THREE.AnimationClip[]
  scene: THREE.Group
}

export default function AssassinJump({ 
  text = "ASSASSIN'S CREED", 
  fontUrl = '/fonts/Montserrat_Bold.json',
  jumpDelay = 2, // Seconds before jump starts
  debug = true // Enable debugging visuals
}) {
  const [modelError, setModelError] = useState(false)
  const [fontError, setFontError] = useState(false)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelPath, setModelPath] = useState('/models/assassins-creed/golden_eagle.glb')
  
  // Reference for debugging
  const debugRef = useRef<THREE.Object3D>(null)
  
  // Try multiple model paths if one fails
  const alternativeModels = [
    '/models/assassins-creed/altair.glb',
    '/models/assassins-creed/golden_eagle.glb',
    '/models/assassins-creed/eagle.glb',
    '/models/assassins-creed/connor.glb'
  ]
  
  // Load model with error handling
  const { scene } = useGLTF(modelPath, true) as GLTFResult
  
  const textRef = useRef<Group>(null)
  const assassinRef = useRef<Group>(null)
  const [jumpStarted, setJumpStarted] = useState(false)
  const [jumpCompleted, setJumpCompleted] = useState(false)
  const [jumpTime, setJumpTime] = useState(0)
  
  // Starting and ending positions
  const startPosition = new Vector3(0, 30, -10) // High up and behind
  const endPosition = new Vector3(0, 1, 0) // Just above the text
  
  // Animation parameters
  const jumpDuration = 2 // Seconds
  const landingDuration = 0.5 // Seconds
  // Clone and setup the character
  useEffect(() => {
    if (scene && !modelError && modelLoaded) {
      try {
        // Clear the group before adding the new scene
        if (assassinRef.current) {
          while (assassinRef.current.children.length) {
            assassinRef.current.remove(assassinRef.current.children[0])
          }
          
          // Clone the scene to avoid mutations
          const clonedScene = scene.clone()
          
          // Calculate appropriate scale based on model
          const box = new Box3().setFromObject(clonedScene)
          const size = box.getSize(new Vector3())
          const scale = 2 / Math.max(size.x, size.y, size.z) // Scale to roughly 2 units tall
          
          // Scale and position the assassin
          clonedScene.scale.set(scale, scale, scale)
          clonedScene.position.copy(startPosition)
          clonedScene.rotation.set(0, Math.PI, 0) // Face forward
          
          // Add to group for easier manipulation
          assassinRef.current.add(clonedScene)
          
          // For debugging - add a reference
          if (debug && debugRef.current) {
            debugRef.current.add(clonedScene.clone())
          }
          
          console.log(`✅ Model setup complete. Scale: ${scale}`)
          
          // Start the jump after delay
          const timer = setTimeout(() => {
            setJumpStarted(true)
            console.log('✅ Jump animation started')
          }, jumpDelay * 1000)
          
          return () => clearTimeout(timer)
        }
      } catch (err) {
        console.error('❌ Error setting up assassin:', err)
        setModelError(true)
      }
    }
  }, [scene, jumpDelay, modelError, modelLoaded, debug])
  
  // Animation loop
  useFrame((state) => {
    if (!jumpStarted || !assassinRef.current || modelError || assassinRef.current.children.length === 0) return
    
    try {
      const character = assassinRef.current.children[0]
      
      // Update jump time
      if (!jumpCompleted) {
        setJumpTime(prev => {
          const newTime = prev + state.clock.elapsedTime - state.clock.oldTime
          return newTime
        })
      }
      
      // Calculate jump progress (0 to 1)
      const progress = Math.min(jumpTime / jumpDuration, 1)
      
      if (progress < 1) {
        // Jump trajectory - arc motion with forward momentum
        const x = startPosition.x + (endPosition.x - startPosition.x) * progress
        const z = startPosition.z + (endPosition.z - startPosition.z) * progress
        
        // Parabolic height (arch shape)
        const y = startPosition.y + 
                  (endPosition.y - startPosition.y) * progress + 
                  Math.sin(progress * Math.PI) * 10 // Extra height in middle of jump
        
        // Update position
        character.position.set(x, y, z)
        
        // Dynamic rotation during jump - lean forward
        const leanForward = Math.sin(progress * Math.PI) * 0.5
        character.rotation.x = leanForward
        
        // Spinning effect
        if (progress < 0.7) {
          character.rotation.y = Math.PI + progress * Math.PI * 2
        } else {
          // Stabilize rotation near landing
          character.rotation.y = Math.PI
        }
      } 
      else if (!jumpCompleted) {
        // Jump is complete, finalize position
        character.position.copy(endPosition)
        character.rotation.set(0, Math.PI, 0)
        setJumpCompleted(true)
        console.log('✅ Jump animation completed')
        
        // Add landing effect - slight bounce
        const landingAnimation = (t: number) => {
          const bounce = Math.abs(Math.sin(t * 10)) * 0.3 * (1 - t)
          character.position.y = endPosition.y - bounce
          
          if (t >= 1) {
            character.position.y = endPosition.y
          } else {
            requestAnimationFrame(() => landingAnimation(t + 0.05))
          }
        }
        
        landingAnimation(0)
      }
    } catch (err) {
      console.error('❌ Error in animation frame:', err)
      setModelError(true)
    }
  })

  // Check if font exists to prevent error
  useEffect(() => {
    // Try to load the font file
    fetch(fontUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Font not found: ${fontUrl}`);
        }
        return response.json(); // Try to parse as JSON
      })
      .then(() => {
        setFontLoaded(true);
        console.log('✅ Font loaded successfully')
      })
      .catch(error => {
        console.error('❌ Error loading font:', error);
        setFontError(true);
      });
  }, [fontUrl]);

  return (
    <>
      {/* Debug view */}
      {debug && (
        <>
          <axesHelper args={[10]} />
          <gridHelper args={[20, 20]} />
          <group ref={debugRef} position={[0, 0, 0]} />
        </>
      )}
      
      {/* Assassin model */}
      <group ref={assassinRef} />
      
      {/* Text */}
      <Center position={[0, 0, 0]}>
        <group ref={textRef}>
          {!fontError && fontLoaded ? (
            <Text3D
              font={fontUrl}
              size={2}
              height={0.5}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.1}
              bevelSize={0.02}
              bevelSegments={5}
            >
              {text}
              <meshStandardMaterial 
                color="#b8860b" // Gold color
                metalness={0.8}
                roughness={0.2}
              />
            </Text3D>
          ) : (
            // Fallback to regular Text component if font can't be loaded
            <Text
              fontSize={2}
              color="#b8860b"
              anchorX="center"
              anchorY="middle"
              font="Arial"
            >
              {text}
              <meshStandardMaterial 
                color="#b8860b"
                metalness={0.8}
                roughness={0.2}
              />
            </Text>
          )}
        </group>
      </Center>
    </>
  )
}
