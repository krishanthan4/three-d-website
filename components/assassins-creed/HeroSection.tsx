'use client'

import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { FaPlay, FaArrowDown } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

// Import components
import AssassinSymbol from './hero/AssassinSymbol'
import Environment from './hero/Environment'
import HistoricalMarkers from './hero/HistoricalMarkers'
import InfoPoints from './hero/InfoPoints'
import Eagle from './hero/Eagle'
import ModelFallback from './hero/ModelFallback'
import LoadingScreen from './hero/LoadingScreen'

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [sceneLoaded, setSceneLoaded] = useState(false)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  // Audio state
  const [bgMusic, setBgMusic] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Audio functions
  const playSound = (soundName: string) => {
    if (typeof window !== 'undefined' && mounted) {
      try {
        const sound = new Audio(`/sounds/assassins-creed/${soundName}.mp3`)
        sound.volume = 0.3
        sound.play().catch(e => console.log(`${soundName} sound prevented:`, e))
      } catch (error) {
        console.error(`${soundName} sound error:`, error)
      }
    }
  }

  const startMusicPlayback = () => {
    if (typeof window !== 'undefined' && mounted) {
      try {
        const music = new Audio('/sounds/assassins-creed/rogue-theme.mp3')
        music.volume = 0.15
        music.loop = true
        music.play().catch(e => console.log('Background music prevented:', e))
        setBgMusic(music)
      } catch (error) {
        console.error('Background music error:', error)
      }
    }
  }

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Start music after loading
  useEffect(() => {
    if (sceneLoaded) {
      const timer = setTimeout(() => {
        startMusicPlayback()
        playSound('synchronize')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [sceneLoaded])
  
  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (bgMusic) {
        bgMusic.pause()
        bgMusic.currentTime = 0
      }
    }
  }, [bgMusic])
  
  // Handle navigation
  const navigateToAnimus = () => {
    playSound('blade')
    router.push('/assassins-creed/animus')
  }
  
  const navigateToBrotherhood = () => {
    playSound('marker')
    router.push('/assassins-creed/brotherhood')
  }
  
  // Handle scene loading
  const handleSceneLoaded = () => {
    setSceneLoaded(true)
  }
  
  return (
    <section id="hero" className="h-screen w-full relative overflow-hidden">
      {/* Darker background */}
      <div className="absolute inset-0 z-0 bg-black/50"></div>
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true, outputColorSpace: THREE.SRGBColorSpace }}
          onCreated={(state) => {
            state.gl.toneMapping = THREE.ACESFilmicToneMapping;
            state.gl.toneMappingExposure = 1.5;
            setTimeout(handleSceneLoaded, 2000);
          }}
        >
          {/* Eagle moved outside of Suspense for immediate loading */}
          <Eagle />
          
          <Suspense fallback={<ModelFallback />}>
            <Environment />
            <AssassinSymbol />
            <HistoricalMarkers />
            <InfoPoints playSound={playSound} />
            <OrbitControls 
              enablePan={false} 
              enableZoom={false}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 6}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Text Overlay */}
      <div 
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white pointer-events-none"
        style={{ 
          backgroundColor: `rgba(0, 0, 0, ${Math.min(0.4, scrollY / 1000)})`
        }}
      >
        {/* Loading indicator */}
        {!sceneLoaded && <LoadingScreen />}

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
              onClick={navigateToAnimus}
            >
              <FaPlay />
              Enter The Animus
            </motion.button>
            <motion.button 
              className="border border-gray-400 text-gray-200 hover:text-white hover:border-white px-8 py-3 rounded-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateToBrotherhood}
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
        <FaArrowDown className="text-2xl" />
        <span className="text-sm mt-2">Scroll to synchronize</span>
      </motion.div>
    </section>
  )
}
