'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from './AudioController'

interface MarkerProps {
  id: string
  x: string | number  // Percentage or pixel value
  y: string | number  // Percentage or pixel value
  title: string
  description: string
  image?: string
  video?: string
  model?: string
  onOpen?: () => void
  type?: 'info' | 'target' | 'ally' | 'enemy' | 'objective'
}

export default function InteractiveMarker({
  id,
  x, 
  y,
  title,
  description,
  image,
  video,
  model,
  onOpen,
  type = 'info'
}: MarkerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const markerRef = useRef<HTMLDivElement>(null)
  const { playSound } = useAudio()
  
  // Handle positioning
  const getPosition = () => {
    // Handle percentage or pixel values
    const xPos = typeof x === 'number' ? `${x}px` : x
    const yPos = typeof y === 'number' ? `${y}px` : y
    return { left: xPos, top: yPos }
  }
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (markerRef.current && !markerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  // Marker color based on type
  const getMarkerClass = () => {
    switch (type) {
      case 'target': return 'border-red-600 bg-red-500 bg-opacity-30'
      case 'ally': return 'border-blue-600 bg-blue-500 bg-opacity-30'
      case 'enemy': return 'border-red-800 bg-red-700 bg-opacity-30'
      case 'objective': return 'border-yellow-600 bg-yellow-500 bg-opacity-30'
      default: return 'border-white bg-white bg-opacity-20'
    }
  }
  
  // Toggle marker popup
  const toggleMarker = () => {
    const newState = !isOpen
    setIsOpen(newState)
    
    if (newState) {
      playSound('marker')
      if (onOpen) onOpen()
    } else {
      playSound('menu_close')
    }
  }

  return (
    <div 
      ref={markerRef}
      className="marker-container"
      style={{ position: 'absolute', ...getPosition(), zIndex: isOpen ? 50 : 10 }}
    >
      <button
        className={`interactive-marker ${getMarkerClass()} ${isOpen ? 'scale-125' : ''}`}
        onClick={toggleMarker}
        onMouseEnter={() => {
          setIsHovered(true)
          playSound('hover')
        }}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Interactive point: ${title}`}
        aria-expanded={isOpen}
      >
        {/* Inner dot animation */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          animate={isHovered || isOpen ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: isHovered && !isOpen ? Infinity : 0, duration: 1 }}
        >
          <span className={`w-2 h-2 rounded-full ${
            type === 'info' ? 'bg-white' :
            type === 'target' ? 'bg-red-500' :
            type === 'ally' ? 'bg-blue-500' :
            type === 'enemy' ? 'bg-red-700' :
            'bg-yellow-500'
          }`}></span>
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="ac-popup absolute left-full ml-4 z-50 min-w-[300px] max-w-md"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <div className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-[#A12B28]"></div>
            
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => {
                setIsOpen(false)
                playSound('menu_close')
              }}
              aria-label="Close details"
            >
              ✕
            </button>
            
            <div className="ac-popup-content">
              <h3 className="ac-popup-title">{title}</h3>
              
              {image && (
                <div className="mb-4 overflow-hidden">
                  <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-auto object-cover hover:scale-105 transition-transform"
                    style={{ maxHeight: '200px' }} 
                  />
                </div>
              )}
              
              {video && (
                <div className="mb-4 aspect-video">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-auto"
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              
              <p className="text-sm text-gray-300">{description}</p>
              
              {model && (
                <button 
                  className="mt-4 py-2 px-4 bg-red-800 hover:bg-red-700 text-white text-sm font-bold rounded flex items-center gap-2"
                  onClick={() => {
                    playSound('click')
                    // Handle view model action
                  }}
                >
                  <span>View 3D Model</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12l-7-7v4H3v6h11v4l7-7z" />
                  </svg>
                </button>
              )}
              
              <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
                <span>Memory Fragment #{id}</span>
                <span className="text-red-500">Click anywhere to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
