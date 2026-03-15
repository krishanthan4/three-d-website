'use client'

import { motion } from 'framer-motion'
import { connections } from './storyData'

interface CharacterConnectionMapProps {
  onClose: () => void
}

export default function CharacterConnectionMap({ onClose }: CharacterConnectionMapProps) {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-900 rounded-lg max-w-6xl w-full border border-red-900 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-500">Character Connections</h2>
            <button 
              className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-black bg-opacity-50 p-6 rounded-lg overflow-auto" style={{ minHeight: '500px' }}>
            <div className="text-center text-white mb-6">
              <p>A visualization of key relationships between characters across the Assassin's Creed timeline.</p>
            </div>
            
            <div className="relative w-full h-[500px] border border-gray-800 rounded-lg overflow-hidden">
              {/* Network visualization would be implemented here with a library like D3.js or react-force-graph */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <svg width="400" height="400" viewBox="0 0 400 400" className="character-network">
                  {/* Connection Lines */}
                  <line x1="100" y1="100" x2="200" y2="100" stroke="#f87171" strokeWidth="2" />
                  <line x1="200" y1="100" x2="300" y2="100" stroke="#60a5fa" strokeWidth="2" />
                  <line x1="100" y1="200" x2="200" y2="200" stroke="#4ade80" strokeWidth="2" />
                  <line x1="100" y1="200" x2="200" y2="100" stroke="#f87171" strokeWidth="2" />
                  <line x1="200" y1="200" x2="300" y2="200" stroke="#f87171" strokeWidth="2" />
                  <line x1="200" y1="200" x2="200" y2="300" stroke="#4ade80" strokeWidth="2" />
                  <line x1="300" y1="200" x2="300" y2="300" stroke="#60a5fa" strokeWidth="2" />
                  <line x1="200" y1="300" x2="300" y2="300" stroke="#f87171" strokeWidth="2" />
                  
                  {/* Character Nodes */}
                  <circle cx="100" cy="100" r="20" fill="#374151" stroke="#f87171" strokeWidth="2" />
                  <circle cx="200" cy="100" r="20" fill="#374151" stroke="#f87171" strokeWidth="2" />
                  <circle cx="300" cy="100" r="20" fill="#374151" stroke="#60a5fa" strokeWidth="2" />
                  <circle cx="100" cy="200" r="20" fill="#374151" stroke="#f87171" strokeWidth="2" />
                  <circle cx="200" cy="200" r="20" fill="#374151" stroke="#f87171" strokeWidth="2" />
                  <circle cx="300" cy="200" r="20" fill="#374151" stroke="#f87171" strokeWidth="2" />
                  <circle cx="200" cy="300" r="20" fill="#374151" stroke="#4ade80" strokeWidth="2" />
                  <circle cx="300" cy="300" r="20" fill="#374151" stroke="#4ade80" strokeWidth="2" />
                  
                  {/* Character Labels */}
                  <text x="100" y="100" dy="-25" textAnchor="middle" fill="white" fontSize="12">Altaïr</text>
                  <text x="200" y="100" dy="-25" textAnchor="middle" fill="white" fontSize="12">Ezio</text>
                  <text x="300" y="100" dy="-25" textAnchor="middle" fill="white" fontSize="12">Leonardo</text>
                  <text x="100" y="200" dy="-25" textAnchor="middle" fill="white" fontSize="12">Bayek</text>
                  <text x="200" y="200" dy="-25" textAnchor="middle" fill="white" fontSize="12">Connor</text>
                  <text x="300" y="200" dy="-25" textAnchor="middle" fill="white" fontSize="12">Haytham</text>
                  <text x="200" y="300" dy="-25" textAnchor="middle" fill="white" fontSize="12">Edward</text>
                  <text x="300" y="300" dy="-25" textAnchor="middle" fill="white" fontSize="12">Desmond</text>
                </svg>
                
                <p className="text-gray-400 mt-4">Interactive character relationship network</p>
              </div>
              
              <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-black bg-opacity-70 p-2 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-0.5 bg-blue-500"></div>
                  <span>Allies</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span>Enemies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500"></div>
                  <span>Family</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection, idx) => (
                <div key={idx} className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-800">
                  <div className="flex justify-between">
                    <span className="text-white">{connection.from}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mx-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">{connection.to}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-center italic">
                    {connection.relationship}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 text-gray-300 text-sm bg-black bg-opacity-40 p-4 rounded-lg">
            <h3 className="text-white font-bold mb-2">ANIMUS DATA ANALYSIS</h3>
            <p>The Assassin's Creed saga weaves a complex tapestry of relationships spanning centuries. From mentor-student bonds to family ties, these connections have shaped the eternal struggle between Assassins and Templars.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
