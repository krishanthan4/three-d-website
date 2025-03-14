'use client'

import { motion } from 'framer-motion'
import { StoryArc } from './storyData'

interface StoryArcCardProps {
  arc: StoryArc
  isActive: boolean
  onClick: () => void
}

export default function StoryArcCard({ arc, isActive, onClick }: StoryArcCardProps) {
  return (
    <motion.div
      id={`arc-${arc.id}`}
      className={`flex-shrink-0 w-72 rounded-lg overflow-hidden cursor-pointer border-2 ${
        isActive ? 'border-red-600' : 'border-gray-800'
      }`}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={arc.image} 
          alt={arc.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      <div className="p-4 bg-gray-900">
        <h4 className="font-bold text-white mb-1">{arc.title}</h4>
        <p className="text-xs text-red-500 mb-2">{arc.period}</p>
        <p className="text-xs text-gray-400">{arc.description}</p>
      </div>
    </motion.div>
  )
}
