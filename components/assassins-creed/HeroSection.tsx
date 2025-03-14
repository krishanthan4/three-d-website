'use client'

import { useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Html, PerspectiveCamera } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useAudio } from './AudioController'
import { FaPlay, FaArrowDown } from 'react-icons/fa' // Import React Icons

// Assassin model with interactive animations
function AssassinModel({ position = [0, -2, 0] }: { position?: [number, number, number] }) {
  const { scene, animations } = useGLTF('/models/assassins-creed/connor2.glb')
  const [hovering, setHovering] = useState(false)
  const [action, setAction] = useState('idle')
  
  useEffect(() => {
    // Configure animations and materials
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.material.roughness = 0.7
        // Enhance material properties for better visibility
        child.material.metalness = 0.4
        child.material.emissive = new THREE.Color(0x222222)
        child.material.emissiveIntensity = 0.2
      }
    })
  }, [scene])

  // Change animation based on user interaction
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Make assassin look at camera occasionally
    const lookAtCamera = Math.sin(time * 0.2) > 0.95
    
    if (lookAtCamera && action !== 'lookAround') {
      setAction('lookAround')
      setTimeout(() => setAction('idle'), 2000)
    }
    
    // Subtle breathing animation
    scene.rotation.y = Math.sin(time * 0.2) * 0.05 + (hovering ? 0.3 : 0)
  })

  return (
    <primitive 
      object={scene} 
      position={position} 
      scale={2} // Increased scale for better visibility
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
      onClick={() => setAction(action === 'attack' ? 'idle' : 'attack')}
    />
  )
}

// Rotating Assassin's Creed symbol
function AssassinSymbol() {
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

// Environmental elements
function Environment() {
  return (
    <>
      <ambientLight intensity={0.5} /> {/* Increased ambient light intensity */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2} // Increased light intensity
        castShadow 
        shadow-mapSize={1024}
      />
      <spotLight
        position={[0, 10, 0]}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        castShadow
        target-position={[0, -2, 0]} // Aims at Connor's position
      />
      <fog attach="fog" args={['#000000', 5, 30]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
    </>
  )
}

// Floating historical dates and locations
function HistoricalMarkers() {
  // More markers covering more of the screen space
  const markers = [
    // Original markers
    { text: "RENAISSANCE ITALY, 1476", position: [-8, 6, -5] as [number, number, number] },
    { text: "OTTOMAN ISTANBUL, 1511", position: [8, 4, -10] as [number, number, number] },
    { text: "COLONIAL AMERICA, 1754", position: [3, 8, -4] as [number, number, number] }, // Adjusted position
    { text: "REVOLUTIONARY PARIS, 1789", position: [-10, 10, -15] as [number, number, number] },
    { text: "ANCIENT EGYPT, 49 BCE", position: [-15, 5, -12] as [number, number, number] },
    { text: "VIKING AGE, 873 CE", position: [10, 3, -5] as [number, number, number] },
    
    // Additional markers to fill the screen
    { text: "INDUSTRIAL LONDON, 1868", position: [-6, 2, -3] as [number, number, number] },
    { text: "PTOLEMAIC EGYPT, 48 BCE", position: [6, 7, -8] as [number, number, number] },
    { text: "CARIBBEAN SEAS, 1715", position: [-4, 9, -6] as [number, number, number] },
    { text: "ANCIENT GREECE, 431 BCE", position: [12, 5, -10] as [number, number, number] },
    { text: "CRUSADER HOLY LAND, 1191", position: [-12, 4, -7] as [number, number, number] },
    { text: "MING DYNASTY CHINA, 1526", position: [5, 1, -3] as [number, number, number] }
  ]
  
  return (
    <>
      {markers.map((marker, idx) => (
        <Text 
          key={idx}
          position={marker.position}
          color="#ffffff"
          fontSize={0.7} // Larger text
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.9} // Higher opacity
          outlineWidth={0.04} // Thicker outline
          outlineColor="#ff0000"
        >
          {marker.text}
        </Text>
      ))}
    </>
  )
}

// Interactive info points
function InfoPoints({ playSound }: { playSound: (sound: string) => void }) {
  const [activePoint, setActivePoint] = useState<number | null>(null)
  
  const points = [
    { 
      position: [3, 0, 3] as [number, number, number], 
      title: "The Creed", 
      content: "Nothing is true, everything is permitted. Work in the dark to serve the light." 
    },
    { 
      position: [-3, 1, 2] as [number, number, number], 
      title: "Hidden Blade", 
      content: "The iconic weapon of the Assassin Brotherhood, dating back to ancient times." 
    },
    { 
      position: [2, 3, -2] as [number, number, number], 
      title: "Eagle Vision", 
      content: "A sixth sense that allows Assassins to identify allies and enemies." 
    }
  ]
  
  return (
    <>
      {points.map((point, idx) => (
        <group key={idx} position={point.position}>
          <mesh 
            onClick={() => {
              setActivePoint(activePoint === idx ? null : idx)
              playSound('notification')
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
              playSound('hover')
            }}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color="#ff0000" 
              emissive="#ff0000"
              emissiveIntensity={activePoint === idx ? 1 : 0.5}
            />
          </mesh>
          
          {activePoint === idx && (
            <Html position={[0, 0.5, 0]}>
              <div className="bg-black bg-opacity-80 p-3 rounded-md text-white w-64">
                <h4 className="font-bold text-red-500">{point.title}</h4>
                <p className="text-xs mt-1">{point.content}</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  )
}

// Eagle flying animation
function Eagle() {
  const { scene } = useGLTF('/models/assassins-creed/golden_eagle.glb')
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Flying animation path - adjusted to be lower and more visible
    scene.position.x = Math.sin(time * 0.2) * 10
    scene.position.y = Math.sin(time * 0.4) * 2 + 4 // Lower height (was +6)
    scene.position.z = Math.cos(time * 0.2) * 10
    
    // Banking animation
    scene.rotation.z = Math.sin(time * 0.2) * 0.2
    scene.rotation.y = Math.atan2(
      Math.cos(time * 0.2) * -10,
      Math.sin(time * 0.2) * -10
    )
  })

  return <primitive object={scene} scale={0.7} /> // Increased scale from 0.5 to 0.7
}

// Fallback loading component
function ModelFallback() {
  return (
    <Text color="#ffffff" fontSize={1} position={[0, 0, 0]}>
      Loading...
    </Text>
  )
}

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [sceneLoaded, setSceneLoaded] = useState(false)
  const { playSound, startMusicPlayback } = useAudio()
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Start music after all models have loaded
  useEffect(() => {
    if (sceneLoaded) {
      // Start background music after a short delay
      const timer = setTimeout(() => {
        startMusicPlayback()
        // Play synchronize sound when starting
        playSound('synchronize')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [sceneLoaded, startMusicPlayback, playSound])
  
  // Handle model loading complete
  const handleSceneLoaded = () => {
    setSceneLoaded(true)
  }
  
  return (
    <section id="hero" className="h-screen w-full relative overflow-hidden">
      {/* Darker background but not so dark that it hides the model */}
      <div className="absolute inset-0 z-0 bg-black/50"></div>
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 8], fov: 60 }} // Wider field of view
          gl={{ antialias: true, alpha: true, outputColorSpace: THREE.SRGBColorSpace }} // Better rendering quality
          onCreated={(state) => {
            // LegacyLights are deprecated, lights are physically correct by default now
            state.gl.toneMapping = THREE.ACESFilmicToneMapping; // Better color representation
            state.gl.toneMappingExposure = 1.5; // Brighter overall
            setTimeout(handleSceneLoaded, 2000);
          }}
        >
          <Suspense fallback={<ModelFallback />}>
            <Environment />
            <AssassinModel position={[0, -2.5, 0]} /> {/* Adjusted position to be more centered */}
            <AssassinSymbol />
            <HistoricalMarkers />
            <InfoPoints playSound={playSound} />
            <Eagle />
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} // Enable zooming to see model better
              maxZoom={2}
              minZoom={0.5}
              maxPolarAngle={Math.PI / 1.5} // Allow camera to go lower
              minPolarAngle={Math.PI / 6} // And higher
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Text Overlay - adjusted to not overwhelm the 3D scene */}
      <div 
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white pointer-events-none"
        style={{ 
          backgroundColor: `rgba(0, 0, 0, ${Math.min(0.4, scrollY / 1000)})` // Less overlay opacity
        }}
      >
        {/* Loading indicator shown until scene is loaded */}
        {!sceneLoaded && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: sceneLoaded ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Entering the Animus</h2>
              <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-800"
                  initial={{ width: '0%' }}
                  animate={{ width: sceneLoaded ? '100%' : '90%' }}
                  transition={{ duration: 2 }}
                />
              </div>
              <p className="mt-4 text-sm text-gray-400">Synchronizing memories...</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: sceneLoaded ? 1 : 0, y: sceneLoaded ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center px-4 pointer-events-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
            <span className="text-red-600">ASSASSIN'S</span> CREED
          </h1>
          <p className="max-w-2xl mx-auto text-xl mb-8 text-gray-300">
            Journey through the ages. Uncover conspiracies. 
            Alter the course of history in the shadows.
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <motion.button 
              className="bg-red-700 hover:bg-red-600 text-white px-8 py-3 rounded-sm flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playSound('blade')}
            >
              <FaPlay /> {/* React Icon instead of material icon */}
              Enter The Animus
            </motion.button>
            <motion.button 
              className="border border-gray-400 text-gray-200 hover:text-white hover:border-white px-8 py-3 rounded-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playSound('marker')}
            >
              Explore The Brotherhood
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white flex flex-col items-center"
      >
        <FaArrowDown className="text-2xl" /> {/* React Icon instead of material icon */}
        <span className="text-sm mt-2">Scroll to synchronize</span>
      </motion.div>
    </section>
  )
}
