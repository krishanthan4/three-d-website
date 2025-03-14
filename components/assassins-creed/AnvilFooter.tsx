'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAudio } from './AudioController'

export default function AnvilFooter() {
  const [showCredits, setShowCredits] = useState(false)
  const { playSound } = useAudio()
  
  const handleCreditsToggle = () => {
    setShowCredits(!showCredits)
    playSound(showCredits ? 'menu_close' : 'menu_open')
  }

  return (
    <footer className="bg-black border-t border-red-900 py-8 px-6 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Column */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src="/images/assassins-creed/ac-logo-white.jpg" 
              alt="Assassin's Creed" 
              className="h-12 mb-4"
            />
            <div className="text-center md:text-left">
              <div className="text-gray-400 text-xs mb-6">
                <p>Animus Version 4.3.7</p>
                <p>Memory Synchronization Complete</p>
              </div>
              <motion.button
                className="text-white bg-red-900 py-2 px-4 rounded-sm text-sm font-bold hover:bg-red-800 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreditsToggle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>Credits</span>
              </motion.button>
            </div>
          </div>
          
          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-bold mb-4 text-center md:text-left">Animus Navigation</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-400">
              <li>
                <a 
                  href="#hero" 
                  className="hover:text-white transition-colors hover:underline"
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                >
                  Main Interface
                </a>
              </li>
              <li>
                <a 
                  href="#timeline" 
                  className="hover:text-white transition-colors hover:underline"
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                >
                  Timeline
                </a>
              </li>
              <li>
                <a 
                  href="#locations" 
                  className="hover:text-white transition-colors hover:underline"
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                >
                  Locations
                </a>
              </li>
              <li>
                <a 
                  href="#characters" 
                  className="hover:text-white transition-colors hover:underline"
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                >
                  Characters
                </a>
              </li>
              <li>
                <a 
                  href="#weapons" 
                  className="hover:text-white transition-colors hover:underline"
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                >
                  Artifacts
                </a>
              </li>
              <li>
                <a 
                  href="#story" 
                  className="hover:text-white transition-colors hover:underline"
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                >
                  Story
                </a>
              </li>
            </ul>
          </div>
          
          {/* Animus Info Column */}
          <div className="text-center md:text-right">
            <div className="border border-gray-800 bg-black bg-opacity-50 rounded p-4 text-gray-400 text-sm max-w-xs ml-auto">
              <h3 className="text-white font-bold mb-2">ABSTERGO INDUSTRIES</h3>
              <p className="mb-2">This simulation is provided for educational purposes only. All genetic memories accessed via the Animus are property of Abstergo Industries.</p>
              <p>Unauthorized access is strictly prohibited under international law.</p>
            </div>
            
            <div className="mt-4 space-x-4 flex justify-center md:justify-end items-center">
              <button 
                className="text-gray-500 hover:text-white"
                onMouseEnter={() => playSound('hover')}
                onClick={() => playSound('click')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="text-gray-500 hover:text-white"
                onMouseEnter={() => playSound('hover')}
                onClick={() => playSound('click')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="text-gray-500 hover:text-white"
                onMouseEnter={() => playSound('hover')}
                onClick={() => {
                  playSound('click')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="mt-12 pt-4 border-t border-gray-800 text-center text-xs text-gray-600">
          <p>Assassin's Creed demonstration. All assets and rights belong to Ubisoft.</p>
          <p className="mt-1">This is a fan project created for educational purposes only.</p>
        </div>
        
        {/* Red line decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent"></div>
      </div>
      
      {/* Credits Modal */}
      {showCredits && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCreditsToggle}
        >
          <motion.div 
            className="bg-gray-900 rounded-lg max-w-2xl w-full border border-red-900 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-500">Animus Credits</h2>
                <button 
                  className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
                  onClick={handleCreditsToggle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center mb-8">
                <img 
                  src="/images/assassins-creed/assassin-symbol.png" 
                  alt="Assassin's Creed Symbol" 
                  className="h-16 mx-auto mb-4"
                />
                <h3 className="text-white text-lg font-bold">ASSASSIN'S CREED</h3>
                <p className="text-gray-400 text-sm">A tribute to the legendary game series</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-red-500 font-bold mb-2 border-b border-gray-800 pb-1">Original Game Series</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>Created by: Ubisoft</li>
                    <li>Original Concept: Patrice Désilets</li>
                    <li>Creative Direction: Jean Guesdon</li>
                    <li>Narrative Direction: Darby McDevitt, Corey May</li>
                    <li>Art Direction: Raphaël Lacoste</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-red-500 font-bold mb-2 border-b border-gray-800 pb-1">This Demo</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>Built with: React, Next.js, Three.js</li>
                    <li>3D Models: Various sources credited separately</li>
                    <li>UI Design: Fan interpretation of Animus interface</li>
                    <li>Audio: Sound effects from various sources</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 text-gray-400 text-xs border-t border-gray-800 pt-4 text-center">
                <p>This is a fan project created for educational and demonstration purposes only.</p>
                <p>All Assassin's Creed content, characters, and related elements are the property of Ubisoft.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </footer>
  )
}
