'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [loadingText, setLoadingText] = useState("Initializing Animus...")
  const [dnaStrands, setDnaStrands] = useState<number[]>([])
  const [glitching, setGlitching] = useState(false)

  // Loading phases text
  const loadingTexts = [
    "Initializing Animus...",
    "Accessing genetic memory...",
    "Synchronizing DNA sequence...",
    "Calibrating historical data...",
    "Establishing synchronization nodes...",
    "Memory sequence found. Entering Animus..."
  ]

  useEffect(() => {
    // Create random DNA strands for animation
    const strandCount = Math.floor(window.innerWidth / 15)
    const newStrands = Array.from({ length: strandCount }, () => Math.random() * 100)
    setDnaStrands(newStrands)
    
    // Progress loader
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 3
        
        // Update loading phase based on progress
        const phase = Math.min(5, Math.floor(next / 20))
        if (phase !== loadingPhase) {
          setLoadingPhase(phase)
          setLoadingText(loadingTexts[phase])
          
          // Trigger glitch effect at phase changes
          setGlitching(true)
          setTimeout(() => setGlitching(false), 500)
        }
        
        return next >= 100 ? 100 : next
      })
    }, 200)

    return () => clearInterval(interval)
  }, [loadingPhase])

  // Create randomized glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const shouldGlitch = Math.random() < 0.2
      if (shouldGlitch) {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 150 + Math.random() * 350)
      }
    }, 2000)
    
    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* DNA helix animation background */}
      <div className="absolute inset-0 opacity-20">
        {dnaStrands.map((strand, i) => (
          <div 
            key={i}
            className="absolute h-full w-0.5"
            style={{
              left: `${(i / dnaStrands.length) * 100}%`,
              animationDelay: `${strand * 0.01}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div 
                key={j}
                className="h-2 w-2 rounded-full absolute"
                style={{
                  top: `${(j * 10) - (strand % 10)}%`,
                  left: Math.sin((j / 3) + strand) * 15,
                  backgroundColor: j % 2 ? '#ff0000' : '#ffffff',
                  opacity: 0.5 + (Math.sin(j / 5) * 0.5),
                  transform: `scale(${0.5 + Math.sin(j / 10) * 0.5})`,
                  boxShadow: `0 0 10px ${j % 2 ? '#ff0000' : '#ffffff'}`
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Abstergo/Assassin's logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, type: "spring" }}
        className="relative mb-12"
      >
        <div className={`animus-logo ${glitching ? 'glitching' : ''}`}>
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,0,0,0.8)" strokeWidth="2" />
            <path d="M50 5 L95 85 L5 85 Z" fill="none" stroke="white" strokeWidth="2" />
            <path d="M50 20 L80 80 L20 80 Z" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </motion.div>

      {/* Loading status */}
      <div className="w-80 mb-6 z-10">
        <div className={`text-center text-white mb-2 font-mono text-sm ${glitching ? 'text-glitch' : ''}`}>
          {loadingText}
        </div>
        
        <div className="w-full bg-gray-900 h-1 rounded relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-red-600"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
          />
          
          {/* Loading percentage */}
          <div className="absolute -top-6 text-xs text-white font-mono" style={{ right: 0 }}>
            {Math.round(progress)}%
          </div>
        </div>
        
        {/* Technical-looking data output */}
        <div className="animus-data-output mt-4 font-mono text-xs opacity-70 h-24 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`text-xs ${i % 2 === 0 ? 'text-blue-400' : 'text-white'}`}>
              {`> ${(i + 1) * 512} memory blocks analyzed. Sequence ${i + 1} integrity: ${Math.round(80 + Math.random() * 19)}%`}
            </div>
          ))}
        </div>
      </div>

      {/* Warning message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], transition: { duration: 5, times: [0, 0.1, 0.9, 1], repeat: Infinity, repeatDelay: 5 }}}
        className="absolute bottom-10 text-center text-red-500 font-mono text-sm max-w-md px-4"
      >
        WARNING: Prolonged exposure to the Animus may lead to the bleeding effect.
        <br />
        Continue at your own risk.
      </motion.div>
      
      {/* Visual glitch overlay */}
      {glitching && (
        <div className="absolute inset-0 animus-glitch-overlay z-10"></div>
      )}
    </div>
  )
}
