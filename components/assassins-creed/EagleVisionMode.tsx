'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAudio } from './AudioController'

export default function EagleVisionMode() {
  const [activeTargets, setActiveTargets] = useState<Element[]>([])
  const [activeAllies, setActiveAllies] = useState<Element[]>([])
  const [activeInfo, setActiveInfo] = useState<Element[]>([])
  const { playSound } = useAudio()
  
  useEffect(() => {
    // Play eagle vision sound effect
    playSound('eagle')
    
    // Identify targets, allies and info points
    const targets = document.querySelectorAll('[data-eagle-target="true"]')
    const allies = document.querySelectorAll('[data-eagle-ally="true"]')
    const info = document.querySelectorAll('[data-eagle-info="true"]')
    
    // Apply glow effects
    targets.forEach(target => target.classList.add('eagle-vision-target'))
    allies.forEach(ally => ally.classList.add('eagle-vision-ally'))
    info.forEach(item => item.classList.add('eagle-vision-info'))
    
    setActiveTargets(Array.from(targets))
    setActiveAllies(Array.from(allies))
    setActiveInfo(Array.from(info))
    
    // Add locked targets
    const interactiveMarkers = document.querySelectorAll('.interactive-marker')
    interactiveMarkers.forEach(marker => {
      if (marker.classList.contains('border-red-600')) {
        marker.classList.add('eagle-vision-target')
        setActiveTargets(prev => [...prev, marker])
      } else if (marker.classList.contains('border-blue-600')) {
        marker.classList.add('eagle-vision-ally')
        setActiveAllies(prev => [...prev, marker])
      } else {
        marker.classList.add('eagle-vision-info')
        setActiveInfo(prev => [...prev, marker])
      }
    })
    
    return () => {
      // Remove glow effects
      targets.forEach(target => target.classList.remove('eagle-vision-target'))
      allies.forEach(ally => ally.classList.remove('eagle-vision-ally'))
      info.forEach(item => item.classList.remove('eagle-vision-info'))
      
      // Remove from interactive markers
      interactiveMarkers.forEach(marker => {
        marker.classList.remove('eagle-vision-target')
        marker.classList.remove('eagle-vision-ally')
        marker.classList.remove('eagle-vision-info')
      })
    }
  }, [playSound])
  
  return (
    <>
      {/* Eagle vision overlay */}
      <div className="eagle-vision">
        {/* Information display */}
        <div className="fixed bottom-10 left-10 text-white font-mono text-sm z-[101]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-2"
          >
            <span className="text-red-500">● </span> 
            <span>Targets: {activeTargets.length}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <span className="text-blue-500">● </span> 
            <span>Allies: {activeAllies.length}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-yellow-500">● </span> 
            <span>Information: {activeInfo.length}</span>
          </motion.div>
        </div>
        
        {/* Line pattern overlay */}
        <div 
          className="absolute inset-0 z-[101]"
          style={{ 
            backgroundImage: 'linear-gradient(0deg, rgba(0,30,60,0.1) 50%, transparent 50%)', 
            backgroundSize: '4px 4px',
            pointerEvents: 'none',
            mixBlendMode: 'overlay'
          }}
        ></div>
        
        {/* Pulse effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 1.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="fixed inset-0 bg-blue-900 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            width: '200vw',
            height: '200vh',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 100
          }}
        />
      </div>
    </>
  )
}
