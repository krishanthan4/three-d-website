'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from './AudioController'
import StoryArcCard from './storytelling/StoryArcCard'
import StoryArcDetails from './storytelling/StoryArcDetails'
import StoryPhilosophy from './storytelling/StoryPhilosophy'
import ModernDayNarrative from './storytelling/ModernDayNarrative'
import CharacterConnectionMap from './storytelling/CharacterConnectionMap'
import { storyArcs } from './storytelling/storyData'

export default function StorytellingSection() {
  const [activeArc, setActiveArc] = useState<string | null>(null)
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [showStoryMap, setShowStoryMap] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { playSound } = useAudio()

  // Scroll timeline to center when arc changes
  useEffect(() => {
    if (activeArc && timelineRef.current) {
      const activeElement = document.getElementById(`arc-${activeArc}`)
      if (activeElement) {
        const containerRect = timelineRef.current.getBoundingClientRect()
        const elementRect = activeElement.getBoundingClientRect()
        const scrollPosition = elementRect.left - containerRect.left - (containerRect.width / 2) + (elementRect.width / 2)
        
        timelineRef.current.scrollTo({
          left: scrollPosition + timelineRef.current.scrollLeft,
          behavior: 'smooth'
        })
      }
    }
  }, [activeArc])

  return (
    <section id="story" className="min-h-screen py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-white">
            <span className="text-red-600">The Creed</span> Through Time
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Explore the centuries-long conflict between the Assassin Brotherhood and the Templar Order that has shaped the course of human history from the shadows.
          </p>
        </motion.div>
        
        {/* Story Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-white">Story Arcs</h3>
          
          <div 
            ref={timelineRef}
            className="flex overflow-x-auto pb-8 hide-scrollbar mask-edges"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex space-x-6 px-8">
              {storyArcs.map((arc) => (
                <StoryArcCard 
                  key={arc.id}
                  arc={arc}
                  isActive={activeArc === arc.id}
                  onClick={() => {
                    setActiveArc(arc.id === activeArc ? null : arc.id)
                    playSound('click')
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Timeline Navigation Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {storyArcs.map((arc) => (
              <button
                key={arc.id}
                className={`w-3 h-3 rounded-full ${
                  activeArc === arc.id ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => {
                  setActiveArc(arc.id)
                  playSound('click')
                }}
                aria-label={`Show ${arc.title}`}
              />
            ))}
          </div>
        </div>
        
        {/* Active Arc Details */}
        <AnimatePresence>
          {activeArc && (() => {
            const arc = storyArcs.find(a => a.id === activeArc)
            if (!arc) return null
            
            return (
              <StoryArcDetails 
                arc={arc}
                expandedEvent={expandedEvent}
                setExpandedEvent={setExpandedEvent}
                onOpenStoryMap={() => {
                  setShowStoryMap(true)
                  playSound('menu_open')
                }}
              />
            )
          })()}
        </AnimatePresence>
        
        {/* The Creed Philosophy */}
        <StoryPhilosophy />
        
        {/* Modern Day Storyline */}
        <ModernDayNarrative />
      </div>
      
      {/* Character Connection Map Modal */}
      <AnimatePresence>
        {showStoryMap && (
          <CharacterConnectionMap 
            onClose={() => {
              setShowStoryMap(false)
              playSound('menu_close')
            }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
