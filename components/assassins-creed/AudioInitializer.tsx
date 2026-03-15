// filepath: /media/terminal/E/Development_apps/Selling/three-d-website/components/assassins-creed/AudioInitializer.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from './AudioController'

export default function AudioInitializer() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const { startMusicPlayback, playSound } = useAudio()

  // Check if we need to prompt for audio permission
  useEffect(() => {
    const hasInteracted = localStorage.getItem('audio_permission_granted')
    
    if (!hasInteracted) {
      // Show prompt after a delay to allow page to load
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 1500)
      
      return () => clearTimeout(timer)
    } else {
      // If permission was previously granted, initialize audio
      setAudioInitialized(true)
      startMusicPlayback()
    }
  }, [startMusicPlayback])

  // Handle user interaction
  const handleEnableAudio = () => {
    localStorage.setItem('audio_permission_granted', 'true')
    setAudioInitialized(true)
    setShowPrompt(false)
    startMusicPlayback()
    playSound('synchronize')
  }

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-90 p-4 rounded-lg border border-red-800 text-center text-white max-w-sm"
          >
            <h3 className="text-lg font-bold mb-2">Enable Audio Experience?</h3>
            <p className="mb-4 text-sm text-gray-300">
              For the best immersive experience, we recommend enabling sound effects and music.
            </p>
            <div className="flex space-x-3 justify-center">
              <button 
                onClick={handleEnableAudio}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white"
              >
                Enable Audio
              </button>
              <button 
                onClick={() => setShowPrompt(false)}
                className="px-4 py-2 border border-gray-600 hover:border-gray-400 rounded text-gray-300"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}