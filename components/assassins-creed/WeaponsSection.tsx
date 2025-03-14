'use client'

import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useAudio } from './AudioController'
import ArtifactModel from './weapons/ArtifactModel'
import ArtifactCard from './weapons/ArtifactCard'
import ArtifactDetailModal from './weapons/ArtifactDetailModal'
import { artifacts } from './weapons/artifactData'

export default function WeaponsSection() {
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null)
  const [detailView, setDetailView] = useState<string | null>(null)
  const { playSound } = useAudio()
  
  const handleArtifactClick = (id: string) => {
    setSelectedArtifact(id === selectedArtifact ? null : id)
    playSound('click')
  }
  
  const openDetailView = (id: string) => {
    setDetailView(id)
    playSound('menu_open')
  }
  
  const closeDetailView = () => {
    setDetailView(null)
    playSound('menu_close')
  }
  
  const selectedArtifactData = selectedArtifact 
    ? artifacts.find(a => a.id === selectedArtifact) 
    : null
    
  const detailArtifactData = detailView
    ? artifacts.find(a => a.id === detailView)
    : null

  return (
    <section id="weapons" className="min-h-screen py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-red-600">Legendary</span> Artifacts
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Throughout the centuries, Assassins have wielded powerful weapons and uncovered mysterious artifacts that can alter the course of history. Explore these legendary items.
          </p>
        </motion.div>
        
        {/* Artifacts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {artifacts.map((artifact) => (
            <ArtifactCard 
              key={artifact.id}
              artifact={artifact}
              isSelected={selectedArtifact === artifact.id}
              onClick={() => handleArtifactClick(artifact.id)}
            />
          ))}
        </div>
        
        {/* Selected Artifact Details */}
        <AnimatePresence>
          {selectedArtifact && selectedArtifactData && (
            <motion.div
              className="mb-16 bg-black bg-opacity-50 rounded-lg overflow-hidden border border-gray-800 backdrop-blur-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* 3D Model */}
                <div className="h-[400px] bg-gradient-to-b from-gray-900 to-black relative">
                  <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                    <ambientLight intensity={0.4} />
                    <spotLight position={[5, 5, 5]} intensity={0.6} castShadow />
                    <Suspense fallback={null}>
                      <ArtifactModel 
                        modelPath={selectedArtifactData.modelPath} 
                        rotating={true}
                      />
                      <Environment preset="night" />
                    </Suspense>
                    <OrbitControls 
                      enablePan={false} 
                      enableZoom={true} 
                      minDistance={2} 
                      maxDistance={6}
                    />
                  </Canvas>
                  
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-70 rounded py-1 px-3">
                    Drag to rotate • Scroll to zoom
                  </div>
                </div>
                
                {/* Artifact Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedArtifactData.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-red-900 text-white px-2 py-0.5 text-xs rounded">
                          {selectedArtifactData.category}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {selectedArtifactData.era}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button 
                      className="bg-red-700 hover:bg-red-600 text-white p-2 rounded"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openDetailView(selectedArtifactData.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v12.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    {selectedArtifactData.description}
                  </p>
                  
                  <div className="space-y-4">
                    {/* Stats Visualization */}
                    <div>
                      <h4 className="text-white font-bold mb-2 text-sm">Artifact Analysis</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedArtifactData.stats).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div className="text-gray-400 text-xs capitalize w-24">{key}</div>
                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-600 rounded-full" 
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <div className="text-xs text-white w-8 text-right">{value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-800 pt-4">
                    <button
                      className="w-full bg-red-900 hover:bg-red-800 text-white py-3 flex items-center justify-center gap-2"
                      onClick={() => openDetailView(selectedArtifactData.id)}
                    >
                      <span>Full Data Analysis</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Animus Data Repository Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-black bg-opacity-50 p-6 rounded-lg border border-gray-800 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-red-500 mb-6">Animus Data Repository</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 border-r border-gray-800 pr-4">
              <h4 className="text-white font-bold mb-4">Artifact Categories</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Pieces of Eden</span>
                    <span className="text-red-400">8 entries</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Assassin Weapons</span>
                    <span className="text-red-400">15 entries</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Historical Relics</span>
                    <span className="text-red-400">11 entries</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Isu Technology</span>
                    <span className="text-red-400">6 entries</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <h4 className="text-white font-bold mb-4">Historical Timeline of Key Artifacts</h4>
              
              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-700"></div>
                
                <div className="space-y-6 ml-10 relative">
                  <div>
                    <div className="absolute left-[-30px] top-0 w-3 h-3 rounded-full bg-red-600 border-2 border-gray-800"></div>
                    <h5 className="text-white font-bold">75,000 BCE</h5>
                    <p className="text-sm text-gray-400">The Isu civilization creates the Pieces of Eden as tools to control and maintain their human workforce.</p>
                  </div>
                  
                  <div>
                    <div className="absolute left-[-30px] top-0 w-3 h-3 rounded-full bg-red-600 border-2 border-gray-800"></div>
                    <h5 className="text-white font-bold">1191 CE</h5>
                    <p className="text-sm text-gray-400">Altaïr Ibn-La'Ahad recovers an Apple of Eden from Robert de Sablé at the Temple Mount in Jerusalem.</p>
                  </div>
                  
                  <div>
                    <div className="absolute left-[-30px] top-0 w-3 h-3 rounded-full bg-red-600 border-2 border-gray-800"></div>
                    <h5 className="text-white font-bold">1499-1512 CE</h5>
                    <p className="text-sm text-gray-400">Ezio Auditore acquires multiple Pieces of Eden including the Apple of Eden, the Staff, and the Masyaf Keys.</p>
                  </div>
                  
                  <div>
                    <div className="absolute left-[-30px] top-0 w-3 h-3 rounded-full bg-red-600 border-2 border-gray-800"></div>
                    <h5 className="text-white font-bold">2012 CE</h5>
                    <p className="text-sm text-gray-400">Desmond Miles sacrifices himself using the Eye to save the world from a catastrophic solar flare.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Artifact Detail Modal */}
      <AnimatePresence>
        {detailView && detailArtifactData && (
          <ArtifactDetailModal 
            artifact={detailArtifactData}
            onClose={closeDetailView} 
          />
        )}
      </AnimatePresence>
    </section>
  )
}
