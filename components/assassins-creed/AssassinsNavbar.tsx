'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from './AudioController'

const menuItems = [
  { id: 'hero', label: 'Animus' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'locations', label: 'Locations' },
  { id: 'characters', label: 'Assassins' },
  { id: 'weapons', label: 'Artifacts' },
  { id: 'story', label: 'Story' }
]

interface NavbarProps {
  synchronizationLevel: number
}

export default function AssassinsNavbar({ synchronizationLevel }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')
  const { playSound } = useAudio()
  
  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      menuItems.forEach(({ id }) => {
        const section = document.getElementById(id)
        if (section && scrollPosition >= section.offsetTop && scrollPosition < (section.offsetTop + section.offsetHeight)) {
          setCurrentSection(id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Synchronization Bar */}
      <div className="synchronization-bar" style={{ width: `${synchronizationLevel}%` }}></div>
      
      <div className="sync-percentage font-mono">
        <span className="mr-2">SYNC:</span>
        {Math.round(synchronizationLevel)}%
      </div>
      
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            onClick={() => playSound('click')}
          >
            <img 
              src="/images/assassins-creed/ac-logo.png" 
              alt="Assassin's Creed" 
              className="h-10"
            />
          </motion.a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3 py-2 text-sm font-bold tracking-wider relative hover:text-red-500 transition-colors ${
                  currentSection === item.id ? 'text-red-500' : 'text-white'
                }`}
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  playSound('click')
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                onMouseEnter={() => playSound('hover')}
              >
                {item.label}
                {currentSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                    layoutId="navbar-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.a>
            ))}
          </div>
          
          {/* Eagle Vision Toggle */}
          <div className="flex items-center">
            <motion.button
              className="text-white opacity-80 hover:opacity-100 hover:text-yellow-300 transition-colors flex items-center text-sm mr-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => playSound('hover')}
              onClick={() => {
                playSound('eagle')
                // Toggle eagle vision is handled globally via keyboard 'V' key
                alert('Press "V" key to toggle Eagle Vision')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Eagle Vision
            </motion.button>
            
            {/* Mobile menu toggle */}
            <motion.button
              className="md:hidden text-white p-2"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                playSound(isMenuOpen ? 'menu_close' : 'menu_open')
              }}
              whileTap={{ scale: 0.9 }}
              aria-expanded={isMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black bg-opacity-90 border-t border-red-900 mt-4"
            >
              <div className="flex flex-col">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`py-3 px-6 text-sm font-bold ${
                      currentSection === item.id ? 'text-red-500' : 'text-white'
                    } border-b border-red-900 border-opacity-30`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                      setIsMenuOpen(false)
                      playSound('click')
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
