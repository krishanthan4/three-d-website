'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxBackground() {
  const [windowHeight, setWindowHeight] = useState(0)
  const { scrollY } = useScroll()
  
  // Parallax effect for background layers
  const y1 = useTransform(scrollY, [0, windowHeight], [0, windowHeight * 0.2])
  const y2 = useTransform(scrollY, [0, windowHeight], [0, windowHeight * 0.5])
  const y3 = useTransform(scrollY, [0, windowHeight], [0, windowHeight * 0.8])
  const opacity1 = useTransform(scrollY, [0, windowHeight * 0.5], [1, 0])
  
  useEffect(() => {
    setWindowHeight(window.innerHeight)
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Sky gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#1c2431] to-[#0e1216]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
      
      {/* Stars background */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 5%, transparent 5.5%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.15) 0%, transparent 0.5%)',
          backgroundSize: '8px 8px, 100% 100%',
          opacity: 0.8,
          y: y1
        }}
      />
      
      {/* Mountains far away */}
      <motion.div 
        className="absolute bottom-[-5%] left-0 right-0"
        style={{ 
          backgroundImage: 'url("/images/assassins-creed/mountains-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          height: '50%',
          y: y2
        }}
      />
      
      {/* City silhouette closer */}
      <motion.div 
        className="absolute bottom-[-10%] left-0 right-0"
        style={{ 
          backgroundImage: 'url("/images/assassins-creed/city-silhouette.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          height: '40%',
          y: y3
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.8) 100%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Red haze effect */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(161, 43, 40, 0) 80%, rgba(161, 43, 40, 0.1) 100%)',
          opacity: opacity1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: 'url("/images/assassins-creed/noise-texture.jpg")',
          backgroundSize: '200px 200px',
          opacity: 0.03,
          mixBlendMode: 'overlay',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
