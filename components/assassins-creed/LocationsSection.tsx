'use client'
import * as THREE from 'three'

import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from './AudioController'
import InteractiveMarker from './InteractiveMarker'

// Location data
const locations = [
  {
    id: 'florence',
    name: 'Florence',
    country: 'Italy',
    era: 'Renaissance (1476-1499)',
    description: 'The birthplace of the Renaissance where Ezio Auditore begins his journey as an Assassin following the betrayal and execution of his family.',
    landmarks: ['Duomo Santa Maria del Fiore', 'Palazzo Vecchio', 'Ponte Vecchio'],
    coordinates: { x: '30%', y: '30%' },
    image: '/images/assassins-creed/florence.jpeg',
    mapPosition: [1, 0, 0],
    model: 'florence'
  },
  {
    id: 'constantinople',
    name: 'Constantinople',
    country: 'Ottoman Empire',
    era: 'Ottoman Rule (1511-1512)',
    description: 'The crossroads of Europe and Asia where Ezio searches for the keys to Altaïr\'s library while the city stands at the center of a power struggle.',
    landmarks: ['Hagia Sophia', 'Grand Bazaar', 'Galata Tower'],
    coordinates: { x: '55%', y: '25%' },
    image: '/images/assassins-creed/constantinople.jpeg',
    mapPosition: [3, 0, 2],
    model: 'constantinople'
  },
  {
    id: 'london',
    name: 'London',
    country: 'England',
    era: 'Industrial Revolution (1868)',
    description: 'A city transformed by industry and controlled by Templar Starrick during Victorian era. The twins Jacob and Evie Frye work to reclaim the city.',
    landmarks: ['Big Ben', 'Buckingham Palace', 'Tower of London'],
    coordinates: { x: '40%', y: '20%' },
    image: '/images/assassins-creed/london.jpg',
    mapPosition: [-1, 0, -3],
    model: 'london'
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    era: 'French Revolution (1789-1799)',
    description: 'The city in turmoil during the bloody French Revolution, where Arno Dorian pursues redemption amidst chaos and conspiracy.',
    landmarks: ['Notre Dame Cathedral', 'Bastille', 'Tuileries Palace'],
    coordinates: { x: '45%', y: '18%' },
    image: '/images/assassins-creed/paris.jpg',
    mapPosition: [0, 0, -2],
    model: 'paris'
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    country: 'Egypt',
    era: 'Ptolemaic Egypt (49-43 BCE)',
    description: 'The great ancient metropolis where Bayek and Aya begin their quest for vengeance that leads to the birth of the Hidden Ones.',
    landmarks: ['Great Library', 'Lighthouse of Alexandria', 'Royal Palace'],
    coordinates: { x: '60%', y: '40%' },
    image: '/images/assassins-creed/alexandria.jpg',
    mapPosition: [4, 0, -1],
    model: 'alexandria'
  },
  {
    id: 'havana',
    name: 'Havana',
    country: 'Cuba',
    era: 'Golden Age of Piracy (1715-1722)',
    description: 'A Spanish colonial port city frequented by pirates and privateers during Edward Kenway\'s adventures in the Caribbean.',
    landmarks: ['Morro Castle', 'Plaza de Armas', 'Cathedral of Havana'],
    coordinates: { x: '20%', y: '50%' },
    image: '/images/assassins-creed/havana.jpeg',
    mapPosition: [-3, 0, 2],
    model: 'havana'
  },
]

// Simplified 3D city model with procedural generation
function CityModel({ name, position = [0, 0, 0], active = false }: { name: string, position: number[], active?: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { playSound } = useAudio()
  
  // Generate pseudo-random buildings based on city name as seed
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const buildingCount = 20 + (seed % 30)
  
  // Create buildings with consistent randomness based on seed
  const buildings = Array.from({ length: buildingCount }, (_, i) => {
    const pseudoRandom = (seed + i) % 100 / 100
    const height = 0.2 + pseudoRandom * 1.2
    const width = 0.1 + ((seed + i * 13) % 100) / 100 * 0.3
    const depth = 0.1 + ((seed + i * 7) % 100) / 100 * 0.3
    const x = (((seed + i * 3) % 100) / 100 * 2 - 1) * 1.5
    const z = (((seed + i * 5) % 100) / 100 * 2 - 1) * 1.5
    
    return { height, width, depth, x, z }
  })

  useFrame(() => {
    if (group.current && active) {
      group.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={group} position={position as [number, number, number]}>
      {/* Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color={active ? "#334" : "#223"} />
      </mesh>
      
      {/* Buildings */}
      {buildings.map((building, i) => (
        <mesh 
          key={i} 
          position={[building.x, building.height / 2, building.z]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial 
            color={active ? 
              `rgb(${150 + i % 60}, ${150 + i % 50}, ${180 + i % 70})` : 
              `rgb(${120 + i % 40}, ${120 + i % 40}, ${140 + i % 40})`
            }
            emissive={active ? "#112" : "#000"}
            emissiveIntensity={active ? 0.2 : 0}
          />
        </mesh>
      ))}
      
      {/* City name label */}
      <Text
        position={[0, 1.5, 0]}
        color={active ? "#ff3333" : "#ffffff"}
        fontSize={0.2}
        maxWidth={2}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={active ? 0.004 : 0}
        outlineColor="#ff0000"
      >
        {name}
      </Text>

      {/* Interactive hitbox - invisible but clickable */}
      <mesh 
        position={[0, 0.5, 0]} 
        visible={false} 
        onClick={() => playSound('click')}
      >
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#ff0000" wireframe />
      </mesh>
    </group>
  )
}

// Map component with interactive elements
function WorldMap({ activeLocation, setActiveLocation }: { 
  activeLocation: string | null, 
  setActiveLocation: (id: string | null) => void 
}) {
  const { playSound } = useAudio()
  
  return (
    <div className="relative h-[600px] md:h-[700px] w-full bg-[url('/images/assassins-creed/old-world-map.jpg')] bg-cover bg-center rounded-lg overflow-hidden">
      {/* Map grid lines overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      {/* Location markers */}
      {locations.map(location => (
        <InteractiveMarker
          key={location.id}
          id={location.id}
          x={location.coordinates.x}
          y={location.coordinates.y}
          title={location.name}
          description={`${location.era} - ${location.description}`}
          image={location.image}
          type={location.id === activeLocation ? 'target' : 'info'}
          onOpen={() => {
            setActiveLocation(location.id)
            playSound('marker')
          }}
        />
      ))}
      
      {/* Compass rose decoration */}
      <div className="absolute bottom-6 right-6 w-32 h-32 opacity-80">
        <img 
          src="/images/assassins-creed/compass-rose.png" 
          alt="Compass rose" 
          className="w-full h-full"
        />
      </div>
      
      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 p-3 rounded text-white text-xs max-w-xs backdrop-blur-sm">
        <h4 className="font-bold text-red-500 mb-1">ANIMUS MAP INTERFACE</h4>
        <p className="text-gray-300 mb-2">Click markers to explore historical locations visited by Assassins throughout the ages.</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <span>Memory Available</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>Selected Memory</span>
        </div>
      </div>
    </div>
  )
}

export default function LocationsSection() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [showDetailView, setShowDetailView] = useState(false)
  const { playSound } = useAudio()
  const activeLocationData = activeLocation ? locations.find(loc => loc.id === activeLocation) : null
  
  const handleViewDetails = () => {
    setShowDetailView(true)
    playSound('menu_open')
  }
  
  return (
    <section id="locations" className="min-h-screen py-20 px-4 sm:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-6 text-white text-center">
          <span className="text-red-600">Iconic</span> Locations
        </h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          The Animus allows us to revisit historical locations throughout time. Explore cities where Assassins shaped history from the shadows.
        </p>
        
        <WorldMap activeLocation={activeLocation} setActiveLocation={setActiveLocation} />
        
        {/* Location information panel */}
        <motion.div 
          className="mt-8 bg-black bg-opacity-70 p-6 rounded-lg backdrop-blur-sm border border-gray-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: activeLocation ? 1 : 0,
            height: activeLocation ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {activeLocationData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-red-500 mb-1">{activeLocationData.name}</h3>
                <p className="text-gray-400 mb-4">{activeLocationData.country} • {activeLocationData.era}</p>
                
                <p className="text-gray-300 mb-4">{activeLocationData.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-white font-bold mb-2">Notable Landmarks:</h4>
                  <ul className="list-disc pl-5 text-gray-300">
                    {activeLocationData.landmarks.map((landmark, idx) => (
                      <li key={idx}>{landmark}</li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 flex items-center gap-2"
                  onClick={handleViewDetails}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </svg>
                  View Details
                </button>
              </div>
              <div className="h-60 relative overflow-hidden rounded-lg">
                <img 
                  src={activeLocationData.image} 
                  alt={activeLocationData.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-3 left-3 text-white text-xs">
                  {activeLocationData.name}, {activeLocationData.country}
                </div>
                <div className="absolute top-2 right-2 bg-red-600 text-xs text-white px-2 py-1 rounded">
                  {activeLocationData.era.split(' ')[0]}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      {/* 3D City Explorer */}
      <div className="max-w-7xl mx-auto mt-16">
        <motion.h3 
          className="text-2xl font-bold mb-6 text-white text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Explore Historical Cities
        </motion.h3>
        
        <div className="h-80 sm:h-96 w-full rounded-lg overflow-hidden">
          <Canvas shadows camera={{ position: [0, 6, 10], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[5, 8, 5]} 
              intensity={0.8} 
              castShadow 
              shadow-mapSize={1024} 
            />
            <Suspense fallback={null}>
              {locations.map((location) => (
                <CityModel
                  key={location.id}
                  name={location.name}
                  position={location.mapPosition as number[]}
                  active={location.id === activeLocation}
                />
              ))}
            </Suspense>
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              minDistance={5}
              maxDistance={20}
            />
          </Canvas>
          
          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 p-2 rounded">
            <p>Click and drag to orbit • Scroll to zoom</p>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Select a location from the map to explore its 3D representation
          </p>
        </div>
      </div>
      
      {/* Detail view modal */}
      {showDetailView && activeLocationData && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setShowDetailView(false)
            playSound('menu_close')
          }}
        >
          <motion.div
            className="bg-gray-900 border border-red-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-80 overflow-hidden">
                <img 
                  src={activeLocationData.image} 
                  alt={activeLocationData.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              </div>
              
              <button
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center"
                onClick={() => {
                  setShowDetailView(false)
                  playSound('menu_close')
                }}
              >
                ✕
              </button>
              
              <div className="absolute bottom-6 left-6">
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">{activeLocationData.name}</h2>
                <p className="text-xl text-gray-300 drop-shadow-md">{activeLocationData.country}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-red-500 mb-2">Historical Context</h3>
                    <div className="bg-black bg-opacity-50 p-4 rounded-lg text-gray-300">
                      <p className="mb-4">{activeLocationData.description}</p>
                      <p>During {activeLocationData.era}, this location witnessed pivotal events that would shape the ongoing conflict between the Brotherhood of Assassins and the Templar Order. The streets held secrets and the architecture itself became a playground for those who mastered freerunning.</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-red-500 mb-2">Notable Landmarks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {activeLocationData.landmarks.map((landmark, idx) => (
                        <div key={idx} className="bg-black bg-opacity-50 p-4 rounded-lg">
                          <h4 className="font-bold text-white mb-1">{landmark}</h4>
                          <p className="text-sm text-gray-400">Historical site with ties to the Brotherhood.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-red-500 mb-2">Memory Sequences</h3>
                    <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                      <div className="border-l-2 border-red-700 pl-4 mb-4">
                        <h4 className="font-bold text-white">Memory Block 03</h4>
                        <p className="text-sm text-gray-400">Follow the target through the crowded streets. Avoid detection while gathering intelligence.</p>
                      </div>
                      <div className="border-l-2 border-red-700 pl-4">
                        <h4 className="font-bold text-white">Memory Block 07</h4>
                        <p className="text-sm text-gray-400">Infiltrate the fortress and eliminate the target. Escape the area without being detected.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-red-500 mb-4">Location Data</h3>
                  
                  <div className="mb-4 pb-4 border-b border-gray-800">
                    <h4 className="text-white font-bold mb-1">Era</h4>
                    <p className="text-gray-400">{activeLocationData.era}</p>
                  </div>
                  
                  <div className="mb-4 pb-4 border-b border-gray-800">
                    <h4 className="text-white font-bold mb-1">Historical Figures</h4>
                    <ul className="list-disc pl-4 text-gray-400">
                      <li>Assassin Contact</li>
                      <li>Local Resistance Leader</li>
                      <li>Templar Target</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4 pb-4 border-b border-gray-800">
                    <h4 className="text-white font-bold mb-1">Collectibles</h4>
                    <div className="flex justify-between text-gray-400">
                      <span>Viewpoints</span>
                      <span>8/12</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Treasures</span>
                      <span>24/30</span>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-4 bg-red-700 hover:bg-red-600 text-white w-full py-2 rounded flex items-center justify-center gap-2"
                    onClick={() => {
                      setShowDetailView(false)
                      playSound('click')
                    }}
                  >
                    <span>Enter Memory Sequence</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
