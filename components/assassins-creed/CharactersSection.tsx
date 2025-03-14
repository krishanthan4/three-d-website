'use client'

import { useState, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from './AudioController'

// Character data
const assassins = [
  {
    id: 'altair',
    name: 'Altaïr Ibn-La\'Ahad',
    game: 'Assassin\'s Creed',
    era: '1191 CE',
    location: 'Holy Land',
    weapon: 'Hidden Blade',
    specialty: 'Stealth & Parkour',
    bio: 'The legendary Master Assassin who reformed the Brotherhood after discovering the true nature of the Apple of Eden. His actions and codex shaped the Brotherhood for centuries to come.',
    image: '/images/assassins-creed/altair.jpeg',
    modelPath: '/models/assassins-creed/altair.glb',
    quotes: [
      "Nothing is true, everything is permitted.",
      "When I was very young, I was foolish enough to believe that our Creed would bring an end to all these conflicts."
    ]
  },
  {
    id: 'ezio',
    name: 'Ezio Auditore da Firenze',
    game: 'Assassin\'s Creed II, Brotherhood, Revelations',
    era: '1476-1512 CE',
    location: 'Italy, Ottoman Empire',
    weapon: 'Hidden Blade, Sword',
    specialty: 'Charisma & Leadership',
    bio: 'From a Florentine nobleman to the Mentor of the Italian Brotherhood, Ezio\'s journey spans decades as he avenges his family and hunts down the corrupt members of the Templar Order across Italy and Constantinople.',
    image: '/images/assassins-creed/ezio.jpeg',
    modelPath: '/models/assassins-creed/ezio.glb',
    quotes: [
      "Requiescat in pace.",
      "The Templars may have been corrupt, but the Assassins are no better with their blind devotion to ancient laws."
    ]
  },
  {
    id: 'connor',
    name: 'Ratonhnhaké:ton (Connor Kenway)',
    game: 'Assassin\'s Creed III',
    era: '1754-1783 CE',
    location: 'Colonial America',
    weapon: 'Tomahawk, Bow',
    specialty: 'Strength & Hunting',
    bio: 'Half-Mohawk, half-British Assassin who fought during the American Revolution. Connor struggled to balance his Native American heritage with the realities of colonial expansion while fighting against Templar influence.',
    image: '/images/assassins-creed/connor.jpg',
    modelPath: '/models/assassins-creed/connor2.glb',
    quotes: [
      "Life is not ours to take, but I will take yours for those I love.",
      "I thought I might unite us, the colonists and my people - and I believed that Connor Kenway might be that unifier."
    ]
  },
  {
    id: 'edward',
    name: 'Edward Kenway',
    game: 'Assassin\'s Creed IV: Black Flag',
    era: '1715-1722 CE',
    location: 'Caribbean',
    weapon: 'Dual Swords, Hidden Blades',
    specialty: 'Naval Combat & Navigation',
    bio: 'A Welsh privateer-turned-pirate who stumbled into the centuries-old conflict between the Assassins and Templars. Initially motivated by personal gain, Edward eventually embraced the Assassin\'s Creed and its ideals.',
    image: '/images/assassins-creed/edward.jpeg',
    modelPath: '/models/assassins-creed/edward.glb',
    quotes: [
      "In a world without gold, we might have been heroes.",
      "If nothing is true, then why believe anything? And if everything is permitted... why not chase every desire?"
    ]
  },
  {
    id: 'bayek',
    name: 'Bayek of Siwa',
    game: 'Assassin\'s Creed: Origins',
    era: '49-47 BCE',
    location: 'Ancient Egypt',
    weapon: 'Shield, Bow',
    specialty: 'Combat & Investigation',
    bio: 'A Medjay of Egypt who, along with his wife Aya, founded the Hidden Ones - the organization that would eventually become the Assassin Brotherhood. Driven by vengeance for his son\'s death.',
    image: '/images/assassins-creed/bayek.jpg',
    modelPath: '/models/assassins-creed/bayek.glb',
    quotes: [
      "I am a Medjay. I protect and serve the people of Egypt.",
      "I am not a tool of the gods! My son's death will be avenged!"
    ]
  },
  {
    id: 'kassandra',
    name: 'Kassandra',
    game: 'Assassin\'s Creed: Odyssey',
    era: '431-422 BCE',
    location: 'Ancient Greece',
    weapon: 'Spear of Leonidas',
    specialty: 'Combat Versatility & Charisma',
    bio: 'A Spartan mercenary who wielded the Staff of Hermes Trismegistus and the Spear of Leonidas. Kassandra\'s bloodline would eventually lead to many future Assassins throughout history.',
    image: '/images/assassins-creed/kassandra.jpeg',
    modelPath: '/models/assassins-creed/kassandra.glb',
    quotes: [
      "There's always a choice.",
      "Sometimes the most brutal path is the only one that's left."
    ]
  }
]

// 3D Character Model component
function AssassinModel({ model, isActive = false }: { model: string, isActive?: boolean }) {
  const { scene } = useGLTF(model)
  const modelRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (modelRef.current) {
      // Subtle breathing animation
      modelRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
      
      // Subtle rotation if active
      if (isActive) {
        modelRef.current.rotation.y += 0.003
      }
    }
  })
  
  return (
    <group ref={modelRef} scale={1.5} position={[0, -1, 0]}>
      <primitive object={scene} />
    </group>
  )
}

export default function CharactersSection() {
  const [activeAssassin, setActiveAssassin] = useState<string | null>(null)
  const [detailView, setDetailView] = useState<string | null>(null)
  const { playSound } = useAudio()

  const handleAssassinClick = (id: string) => {
    setActiveAssassin(id === activeAssassin ? null : id)
    playSound('click')
  }
  
  const showDetailView = (id: string) => {
    setDetailView(id)
    playSound('menu_open')
    document.body.style.overflow = 'hidden'
  }
  
  const hideDetailView = () => {
    setDetailView(null)
    playSound('menu_close')
    document.body.style.overflow = ''
  }

  return (
    <section id="characters" className="min-h-screen py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-red-600">Legendary</span> Assassins
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Throughout history, the Brotherhood has produced exceptional individuals who have shaped the course of civilization from the shadows. Explore their stories and legacies.
          </p>
        </motion.div>
        
        {/* Character Gallery with hover effects */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {assassins.map((assassin) => (
            <motion.div
              key={assassin.id}
              className={`group cursor-pointer aspect-[3/4] rounded-lg overflow-hidden relative ${
                activeAssassin && activeAssassin !== assassin.id ? 'opacity-60' : ''
              }`}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              onClick={() => handleAssassinClick(assassin.id)}
              whileHover={{ y: -5 }}
              data-eagle-info="true"
            >
              <img 
                src={assassin.image} 
                alt={assassin.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-bold text-sm md:text-base">{assassin.name}</h3>
                <p className="text-xs text-gray-400">{assassin.era}</p>
              </div>
              
              {activeAssassin === assassin.id && (
                <motion.div 
                  className="absolute inset-0 bg-red-900 bg-opacity-20 flex items-center justify-center border-2 border-red-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="bg-black bg-opacity-70 text-white py-2 px-4 rounded-sm border border-red-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      showDetailView(assassin.id)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Profile
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Interactive 3D Character Viewer (displays when an assassin is selected) */}
        <AnimatePresence>
          {activeAssassin && (
            <motion.div
              className="bg-black bg-opacity-70 p-6 rounded-lg border border-gray-800 backdrop-blur-sm mb-12"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              {(() => {
                const selected = assassins.find(a => a.id === activeAssassin)
                if (!selected) return null
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 3D Model Viewer */}
                    <div className="h-[400px] bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
                      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                        <fog attach="fog" args={['#000', 4, 10]} />
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />  
                        <pointLight position={[-5, -5, -5]} intensity={0.8} />
                        <pointLight position={[0, 2, 2]} intensity={0.6} color="#ffffff" />
                        
                        <Suspense fallback={null}>
                          <AssassinModel model={selected.modelPath} isActive={true} />
                          <Environment preset="city" background={false} />  
                          <directionalLight intensity={0.8} position={[0, 2, 5]} /> 
                          <ContactShadows 
                            position={[0, -1.5, 0]}
                            opacity={0.10}
                            scale={10}
                            blur={1}
                            far={5}
                            resolution={256}
                          />
                        </Suspense>
                        
                        <OrbitControls 
                          enablePan={false}
                          enableZoom={false}
                          minPolarAngle={Math.PI / 4}
                          maxPolarAngle={Math.PI / 2}
                        />
                      </Canvas>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black bg-opacity-70 py-1 px-3 rounded-full">
                        Click and drag to rotate
                      </div>
                    </div>
                    
                    {/* <div className="h-[400px] bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden relative">
                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                            <color attach="background" args={['#050505']} />
                            <fog attach="fog" args={['#000', 5, 15]} />
                            <ambientLight intensity={0.4} />
                            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />  
                            <pointLight position={[-5, -5, -5]} intensity={0.6} />
                            <pointLight position={[0, 2, 2]} intensity={0.4} color="#ffffff" />
                            
                            <Suspense fallback={null}>
                                <group scale={1.0} position={[0, -0.5, 0]}>
                                    <AssassinModel model={selected.modelPath} isActive={true} />
                                </group>
                                <Environment preset="night" background={false} />  
                                <ContactShadows 
                                    position={[0, -1.5, 0]}
                                    opacity={0.2}
                                    scale={10}
                                    blur={2}
                                    far={5}
                                    resolution={256}
                                />
                            </Suspense>
                            
                            <OrbitControls 
                                enablePan={false}
                                enableZoom={true}
                                minDistance={2.5}
                                maxDistance={10}
                                minPolarAngle={Math.PI / 6}
                                maxPolarAngle={Math.PI / 2}
                                autoRotate
                                autoRotateSpeed={1}
                            />
                        </Canvas>
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black bg-opacity-80 py-1 px-3 rounded-full">
                            Click and drag to rotate • Scroll to zoom
                        </div>
                    </div> */}
                    {/* Character Info */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selected.name}</h3>
                      <p className="text-red-500 mb-4 text-sm">
                        {selected.era} • {selected.location}
                      </p>
                      
                      <div className="mb-6 text-gray-300">
                        <p className="mb-4">{selected.bio}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="text-white font-bold mb-1">Featured In</h4>
                            <p className="text-gray-400">{selected.game}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-bold mb-1">Weapon of Choice</h4>
                            <p className="text-gray-400">{selected.weapon}</p>
                          </div>
                          <div>
                            <h4 className="text-white font-bold mb-1">Specialty</h4>
                            <p className="text-gray-400">{selected.specialty}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-4">
                        <h4 className="text-white font-bold mb-3">Notable Quotes:</h4>
                        {selected.quotes.map((quote, index) => (
                          <div key={index} className="bg-black bg-opacity-60 p-3 rounded mb-2 text-sm italic text-gray-300">
                            "{quote}"
                          </div>
                        ))}
                      </div>
                      
                      <button
                        className="mt-6 bg-red-700 hover:bg-red-600 text-white py-2 px-4 w-full rounded flex items-center justify-center gap-2"
                        onClick={() => showDetailView(selected.id)}
                      >
                        <span>View Full Profile</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* DNA History Visualization */}
        <motion.div 
          className="bg-black bg-opacity-50 p-6 rounded-lg border border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h3 className="text-xl font-bold text-red-500 mb-4">Genetic Memory Lineage</h3>
          
          <div className="relative h-24">
            {/* DNA Timeline */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 transform -translate-y-1/2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-600 transform -translate-y-1/2" style={{ width: '70%' }}></div>
            </div>
            
            {/* Timeline Points */}
            {assassins.map((assassin, index) => {
              const position = (index / (assassins.length - 1)) * 100
              return (
                <div 
                  key={assassin.id}
                  className={`absolute top-1/2 transform -translate-y-1/2 -ml-3 ${
                    assassin.id === activeAssassin ? 'z-10' : 'z-0'
                  }`}
                  style={{ left: `${position}%` }}
                >
                  <button 
                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-transform ${
                      assassin.id === activeAssassin 
                        ? 'bg-red-600 scale-125' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => handleAssassinClick(assassin.id)}
                    onMouseEnter={() => playSound('hover')}
                  >
                    {index + 1}
                  </button>
                  
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-400">
                    {assassin.era}
                  </div>
                  
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-white">
                    {assassin.name.split(' ')[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
      
      {/* Character Detail Modal */}
      <AnimatePresence>
        {detailView && (() => {
          const character = assassins.find(a => a.id === detailView)
          if (!character) return null
          
          return (
            <motion.div 
              className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={hideDetailView}
            >
              <motion.div 
                className="bg-gray-900 max-w-6xl w-full rounded-lg border border-red-900 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-80">
                  <img 
                    src={character.image} 
                    alt={character.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  
                  <button 
                    className="absolute top-4 right-4 bg-black bg-opacity-60 p-2 rounded-full text-white hover:bg-opacity-80"
                    onClick={hideDetailView}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="absolute bottom-6 left-6">
                    <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                      {character.name}
                    </h2>
                    <div className="text-xl text-red-500 drop-shadow-md">{character.era}</div>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 text-gray-300">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-red-500 mb-4">Biography</h3>
                      <div className="bg-black bg-opacity-30 p-4 rounded-lg text-gray-300">
                        <p className="mb-4">{character.bio}</p>
                        <p>As a member of the Assassin Brotherhood, {character.name.split(' ')[0]} was trained in the arts of stealth, combat, and parkour. Their mission was to protect free will and fight against the Templar Order's desire for control through order.</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-red-500 mb-4">Skills & Abilities</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                          <h4 className="font-bold text-white mb-2">Combat Prowess</h4>
                          <div className="w-full bg-gray-700 h-2 mb-1 rounded-full">
                            <div className="bg-red-600 h-full rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <p className="text-sm text-gray-400">Expert in {character.weapon} combat techniques.</p>
                        </div>
                        <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                          <h4 className="font-bold text-white mb-2">Stealth</h4>
                          <div className="w-full bg-gray-700 h-2 mb-1 rounded-full">
                            <div className="bg-red-600 h-full rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <p className="text-sm text-gray-400">Masters of blending with crowds and striking unseen.</p>
                        </div>
                        <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                          <h4 className="font-bold text-white mb-2">Eagle Vision</h4>
                          <div className="w-full bg-gray-700 h-2 mb-1 rounded-full">
                            <div className="bg-red-600 h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <p className="text-sm text-gray-400">Heightened senses to identify allies and enemies.</p>
                        </div>
                        <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                          <h4 className="font-bold text-white mb-2">Freerunning</h4>
                          <div className="w-full bg-gray-700 h-2 mb-1 rounded-full">
                            <div className="bg-red-600 h-full rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <p className="text-sm text-gray-400">Unparalleled ability to navigate urban environments.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-red-500 mb-4">Key Missions</h3>
                      <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                        <div className="border-l-2 border-red-700 pl-4 mb-4">
                          <h4 className="font-bold text-white">Eliminate Templar Leadership</h4>
                          <p className="text-sm text-gray-400">Track down and assassinate key members of the Templar Order who threaten freedom.</p>
                        </div>
                        <div className="border-l-2 border-red-700 pl-4 mb-4">
                          <h4 className="font-bold text-white">Recover Ancient Artifacts</h4>
                          <p className="text-sm text-gray-400">Find and secure Pieces of Eden before they fall into Templar hands.</p>
                        </div>
                        <div className="border-l-2 border-red-700 pl-4">
                          <h4 className="font-bold text-white">Protect Innocent Civilians</h4>
                          <p className="text-sm text-gray-400">Defend those who cannot defend themselves against Templar oppression.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                      <h3 className="text-xl font-bold text-red-500 mb-4">Character Profile</h3>
                      
                      <div className="mb-4 pb-4 border-b border-gray-800">
                        <h4 className="text-white font-bold mb-1">Era</h4>
                        <p className="text-gray-400">{character.era}</p>
                      </div>
                      
                      <div className="mb-4 pb-4 border-b border-gray-800">
                        <h4 className="text-white font-bold mb-1">Location</h4>
                        <p className="text-gray-400">{character.location}</p>
                      </div>
                      
                      <div className="mb-4 pb-4 border-b border-gray-800">
                        <h4 className="text-white font-bold mb-1">Featured In</h4>
                        <p className="text-gray-400">{character.game}</p>
                      </div>
                      
                      <div className="mb-4 pb-4 border-b border-gray-800">
                        <h4 className="text-white font-bold mb-1">Weapons</h4>
                        <p className="text-gray-400">{character.weapon}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-white font-bold mb-1">Specialty</h4>
                        <p className="text-gray-400">{character.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                      <h3 className="text-white font-bold mb-3">Notable Quotes</h3>
                      {character.quotes.map((quote, index) => (
                        <div key={index} className="mb-3 italic text-sm text-gray-300">
                          "{quote}"
                        </div>
                      ))}
                    </div>
                    
                    <button
                      className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded flex items-center justify-center gap-2"
                      onClick={() => {
                        hideDetailView()
                        playSound('click')
                      }}
                    >
                      <span>Return to Animus</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </section>
  )
}
