'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from './AudioController'

export default function HiddenBlade() {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isTouchDevice, setIsTouchDevice] = useState(true)
  const { playSound } = useAudio()
  
  useEffect(() => {
    // Check if it's a touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).tagName.toLowerCase() !== 'button' && 
          (e.target as Element).tagName.toLowerCase() !== 'a' && 
          !(e.target as Element).closest('button') && 
          !(e.target as Element).closest('a')) {
        setIsActive(true)
        playSound('blade')
      }
    }
    
    const handleMouseUp = () => {
      setIsActive(false)
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [playSound])
  
  if (isTouchDevice) return null
  
  return (
    <>
      {isActive && (
        <div 
          className="fixed inset-0 z-[9995] pointer-events-none hidden-blade-active"
          aria-hidden="true"
        >
          {/* Hidden blade effect */}
          <AnimatePresence>
            <motion.div
              key="blade"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{
                position: 'fixed',
                left: position.x - 150,
                top: position.y - 150,
                width: 100,
                height: 100,
                backgroundImage: "url('/images/assassins-creed/hidden-blade-effect.png')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                transformOrigin: "center",
                zIndex: 9996
              }}
              transition={{ duration: 0.15 }}
            />
          </AnimatePresence>
          
          {/* Blood splatter on click
          <AnimatePresence>
            <motion.div
              key="blood"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                left: position.x - 100,
                top: position.y - 40,
                width: 200,
                height: 80,
                backgroundImage: "url('/images/assassins-creed/blood-splatter.jpeg')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                zIndex: 9995,
                filter: "brightness(1.2) contrast(1.2)"
              }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence> */}
        </div>
      )}
    </>
  )
}
