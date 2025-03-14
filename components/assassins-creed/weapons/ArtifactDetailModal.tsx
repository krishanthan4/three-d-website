'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Artifact } from './artifactData'
import ArtifactModel from './ArtifactModel'

interface ArtifactDetailModalProps {
  artifact: Artifact
  onClose: () => void
}

export default function ArtifactDetailModal({ artifact, onClose }: ArtifactDetailModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 rounded-lg max-w-4xl w-full border border-red-900 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-64 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
          <div className="h-full">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.4} />
              <spotLight position={[5, 5, 5]} intensity={0.6} castShadow />
              <spotLight position={[-5, -5, -5]} intensity={0.2} color="#ff4000" />
              <Suspense fallback={null}>
                <ArtifactModel 
                  modelPath={artifact.modelPath}
                  rotating={true}
                />
                <Environment preset="night" />
              </Suspense>
              <OrbitControls enablePan={false} enableZoom={true} />
            </Canvas>
          </div>
          
          <div className="absolute bottom-6 left-6 z-10">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {artifact.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-red-700 text-white px-2 py-0.5 text-xs rounded">
                {artifact.category}
              </span>
              <span className="text-gray-300 text-sm">
                {artifact.era}
              </span>
            </div>
          </div>
          
          <button
            className="absolute top-4 right-4 p-2 text-white bg-black bg-opacity-50 rounded-full"
            onClick={onClose}
            aria-label="Close detail view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 text-gray-300">
              <div className="mb-6">
                <h3 className="text-xl text-red-500 font-bold mb-2">Description</h3>
                <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                  <p className="mb-4">{artifact.description}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl text-red-500 font-bold mb-2">Historical Significance</h3>
                <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                  <p>{artifact.history}</p>
                </div>
              </div>
              
              {/* Power Stats Grid */}
              <div>
                <h3 className="text-xl text-red-500 font-bold mb-2">Power Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(artifact.stats).map(([key, value]) => (
                    <div key={key} className="bg-black bg-opacity-30 p-4 rounded-lg">
                      <h4 className="text-white font-bold mb-2 capitalize">{key}</h4>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
                        <div 
                          className="h-full bg-red-600 rounded-full" 
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">0</span>
                        <span className="text-white font-bold">{value}%</span>
                        <span className="text-gray-400">100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                <h3 className="text-white font-bold border-b border-gray-800 pb-2 mb-4">Artifact Data</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="text-gray-400 mb-1">Classification:</h4>
                    <p className="text-white">{artifact.category}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-400 mb-1">Era of Origin:</h4>
                    <p className="text-white">{artifact.era}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-400 mb-1">Threat Level:</h4>
                    <div className="flex items-center">
                      <span className="text-red-500 font-bold mr-2">HIGH</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="w-2 h-4 bg-red-600 mr-0.5"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-400 mb-1">Current Status:</h4>
                    <p className="text-yellow-500">LOCATION UNKNOWN</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-3">Known Wielders</h3>
                <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
                  <li>Altaïr Ibn-La'Ahad</li>
                  <li>Ezio Auditore da Firenze</li>
                  <li>Desmond Miles</li>
                  <li>[REDACTED]</li>
                </ul>
              </div>
              
              <div className="bg-red-900 bg-opacity-20 border border-red-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-300">
                    Unauthorized access to this artifact data will be reported. Extreme caution recommended when handling First Civilization technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
