'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAudio } from './AudioController'

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(true)
  const { playSound } = useAudio()
  
  useEffect(() => {
    // Check if it's a touch device - don't show custom cursor on touch devices
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      const target = e.target as HTMLElement
      const clickable = 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('interactive-marker')
      
      if (clickable && !hoveredElement) {
        setHoveredElement(target.tagName.toLowerCase())
        playSound('hover')
      } else if (!clickable && hoveredElement) {
        setHoveredElement(null)
      }
    }
    
    const handleMouseDown = () => {
      setClicked(true)
      playSound('click')
    }
    
    const handleMouseUp = () => {
      setClicked(false)
    }
    
    const handleMouseEnter = () => setHidden(false)
    const handleMouseLeave = () => setHidden(true)
    
    // Add all event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    // Add cursor styles to document
    document.documentElement.classList.add('cursor-none')
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.classList.remove('cursor-none')
    }
  }, [hoveredElement, playSound])
  
  if (isTouchDevice) return null
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        animate={{
          x: position.x - (clicked || hoveredElement ? 12 : 8),
          y: position.y - (clicked || hoveredElement ? 12 : 8),
          scale: clicked ? 0.8 : hoveredElement ? 1.5 : 1,
          opacity: hidden ? 0 : 1
        }}
        transition={{
          duration: 0,
          delay: 0
        }}
      >
        <svg 
          width={clicked || hoveredElement ? 24 : 16} 
          height={clicked || hoveredElement ? 24 : 16} 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="8" 
            cy="8" 
            r="7" 
            stroke="#ff0000" 
            strokeWidth="1" 
            fill="rgba(0, 0, 0, 0.2)" 
          />
          <circle 
            cx="8" 
            cy="8" 
            r="2" 
            fill="#ff0000" 
          />
        </svg>
      </motion.div>
      
      {/* Tracer effect */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          opacity: hidden ? 0 : 0.3
        }}
        transition={{
          duration: 0,
          delay: 0
        }}
      >
        <svg 
          width={16} 
          height={16} 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle 
            cx="8" 
            cy="8" 
            r="7" 
            stroke="rgba(255, 0, 0, 0.5)" 
            strokeWidth="1" 
            fill="none" 
          />
        </svg>
      </motion.div>
    </>
  )
}
