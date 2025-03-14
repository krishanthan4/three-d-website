'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAudio } from './AudioController'

export default function AbstergoOverlay() {
  const [time, setTime] = useState('')
  const [location, setLocation] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState({ lat: 40.7128, lng: -74.006 })
  const { playSound } = useAudio()
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }
    
    const timer = setInterval(updateTime, 1000)
    updateTime()
    
    return () => clearInterval(timer)
  }, [])
  
  // Listen for scroll events to update location based on current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      
      // Check which section we're in
      const sections = [
        { id: 'hero', name: 'ANIMUS LOADING BAY', coordinates: { lat: 40.7128, lng: -74.006 } },
        { id: 'timeline', name: 'HISTORICAL ARCHIVES', coordinates: { lat: 43.7696, lng: 11.2558 } },
        { id: 'locations', name: 'GEOGRAPHICAL DATA', coordinates: { lat: 41.9028, lng: 12.4964 } },
        { id: 'characters', name: 'SUBJECT PROFILES', coordinates: { lat: 48.8566, lng: 2.3522 } },
        { id: 'weapons', name: 'ARTIFACT STORAGE', coordinates: { lat: 51.5074, lng: -0.1278 } },
        { id: 'story', name: 'NARRATIVE CONSTRUCT', coordinates: { lat: 40.4168, lng: -3.7038 } }
      ]
      
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && scrollPosition >= element.offsetTop && scrollPosition < (element.offsetTop + element.offsetHeight)) {
          if (location !== section.name) {
            setLocation(section.name)
            setCoordinates(section.coordinates)
            
            // Play notification sound when location changes
            playSound('notification')
            
            // Add notification
            const notificationText = `Accessing ${section.name.toLowerCase()} data...`
            setNotifications(prev => [notificationText, ...prev.slice(0, 3)])
          }
          break
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location, playSound])
  
  return (
    <div className="pointer-events-none">
      {/* Top-left corner HUD element */}
      <motion.div 
        className="fixed top-4 left-4 z-30 font-mono text-xs text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center">
          <div className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          <div>
            <div>ABSTERGO INDUSTRIES</div>
            <div>ANIMUS OS v4.3.7</div>
          </div>
        </div>
      </motion.div>
      
      {/* Top-right corner date and time */}
      <motion.div 
        className="fixed top-4 right-4 z-30 font-mono text-xs text-white text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <div>{new Date().toLocaleDateString()}</div>
        <div className="text-red-500">{time}</div>
      </motion.div>
      
      {/* Location indicator */}
      {location && (
        <motion.div 
          className="fixed top-20 left-4 z-30 max-w-xs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="font-mono text-xs text-white bg-black bg-opacity-30 p-2 backdrop-blur-sm">
            <div className="text-red-500 font-bold">{location}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="h-1 w-1 bg-red-500 rounded-full"></span>
              <span>Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Bottom-left notifications */}
      <div className="fixed bottom-4 left-4 z-30 max-w-xs">
        {notifications.map((message, index) => (
          <motion.div 
            key={index}
            className="font-mono text-xs text-white bg-black bg-opacity-30 p-2 mb-2 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="flex items-center">
              <div className={`h-2 w-2 ${index === 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-500'} rounded-full mr-2`}></div>
              <div>{message}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Bottom line decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-red-900 opacity-50 z-30"></div>
      
      {/* Corner markers - decorative */}
      <div className="fixed top-0 left-0 w-20 h-px bg-red-500 opacity-50 z-30"></div>
      <div className="fixed top-0 left-0 w-px h-20 bg-red-500 opacity-50 z-30"></div>
      <div className="fixed top-0 right-0 w-20 h-px bg-red-500 opacity-50 z-30"></div>
      <div className="fixed top-0 right-0 w-px h-20 bg-red-500 opacity-50 z-30"></div>
      <div className="fixed bottom-0 left-0 w-20 h-px bg-red-500 opacity-50 z-30"></div>
      <div className="fixed bottom-0 left-0 w-px h-20 bg-red-500 opacity-50 z-30"></div>
      <div className="fixed bottom-0 right-0 w-20 h-px bg-red-500 opacity-50 z-30"></div>
      <div className="fixed bottom-0 right-0 w-px h-20 bg-red-500 opacity-50 z-30"></div>
    </div>
  )
}
