'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaPlay, FaSearch } from 'react-icons/fa'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function AnimusPage() {
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeMemory, setActiveMemory] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Play startup sound
    const timer = setTimeout(() => {
      playSound('animus_startup')
      setLoaded(true)
    }, 2000)
    
    return () => {
      setMounted(false)
      clearTimeout(timer)
    }
  }, [])

  // Audio function using the direct approach
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

  const memories = [
    {
      title: "Italian Renaissance",
      year: "1476-1499",
      character: "Ezio Auditore da Firenze",
      location: "Florence, Italy",
      description: "Experience the life of Ezio Auditore as he uncovers a vast conspiracy and transforms from a carefree nobleman to a Master Assassin.",
      image: "/images/assassins-creed/memories/ezio.jpg"
    },
    {
      title: "American Revolution",
      year: "1754-1783",
      character: "Connor Kenway (Ratonhnhaké:ton)",
      location: "Colonial America",
      description: "Follow the journey of Ratonhnhaké:ton, a half-Mohawk, half-British Assassin fighting for freedom during the American Revolution.",
      image: "/images/assassins-creed/memories/connor.jpg"
    },
    {
      title: "Golden Age of Piracy",
      year: "1715-1722",
      character: "Edward Kenway",
      location: "Caribbean Islands",
      description: "Sail the seas as Edward Kenway, a pirate trained by Assassins who becomes entangled in the ancient war between Assassins and Templars.",
      image: "/images/assassins-creed/memories/edward.jpg"
    },
    {
      title: "Ptolemaic Egypt",
      year: "49-47 BCE",
      character: "Bayek of Siwa",
      location: "Ancient Egypt",
      description: "Discover the origins of the Assassin Brotherhood through the eyes of Bayek, a Medjay who fought against dark forces controlling Egypt.",
      image: "/images/assassins-creed/memories/bayek.jpg"
    }
  ]

  return (
    <div className="animus-container min-h-screen">
      {/* Loading Animation */}
      {!loaded && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center">
          <motion.div 
            className="w-32 h-32 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <img src="/images/assassins-creed/animus-logo.png" alt="Animus" className="w-full h-full" />
          </motion.div>
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white">Initializing Animus Interface</h2>
            <p className="text-gray-400 mt-2">Scanning genetic memory...</p>
            <div className="w-64 h-2 bg-gray-800 rounded-full mt-4">
              <motion.div
                className="h-full bg-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Header */}
      <header className="p-4 border-b border-red-800 flex items-center justify-between bg-black">
        <Link href="/" onClick={() => playSound('blade_retract')} className="flex items-center text-gray-300 hover:text-white group">
          <FaArrowLeft className="mr-2 group-hover:translate-x-[-2px] transition-transform" />
          <span>Return to Main</span>
        </Link>
        <div className="text-red-600 font-bold text-xl">ANIMUS 5.0</div>
        <div onClick={() => playSound('notification')} className="cursor-pointer text-gray-400 hover:text-white">
          <FaSearch />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Genetic Memory <span className="text-red-600">Database</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Access ancestral memories through the Animus, a device that decodes genetic information stored in DNA.
            Select a memory sequence to begin synchronization.
          </p>
        </div>
        
        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((memory, index) => (
            <motion.div
              key={index}
              className={`border border-gray-800 rounded bg-gray-900 overflow-hidden cursor-pointer relative ${activeMemory === index ? 'ring-2 ring-red-600' : ''}`}
              whileHover={{ scale: 1.02, borderColor: '#A12B28' }}
              onClick={() => {
                setActiveMemory(index);
                playSound('memory_select');
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="h-40 bg-gray-800 relative">
                <img 
                  src={memory.image} 
                  alt={memory.title} 
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 text-xs text-red-500">
                  {memory.year}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white">{memory.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{memory.character} • {memory.location}</p>
                <p className="text-gray-300 text-sm">{memory.description}</p>
              </div>
              {activeMemory === index && (
                <div className="absolute inset-0 bg-red-900 bg-opacity-20 flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('synchronize');
                      // Would navigate to specific memory page
                    }} 
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
                  >
                    <FaPlay className="mr-2" /> Synchronize Memory
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* 3D Background Element */}
        <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
          <Canvas>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} />
            <mesh>
              <sphereGeometry args={[5, 32, 32]} />
              <meshStandardMaterial 
                color="#A12B28" 
                wireframe 
                emissive="#500000"
                emissiveIntensity={0.5}
              />
            </mesh>
            <OrbitControls 
              autoRotate
              autoRotateSpeed={0.5}
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Canvas>
        </div>
      </main>
    </div>
  )
}
