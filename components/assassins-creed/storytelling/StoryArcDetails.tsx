'use client'

import { motion } from 'framer-motion'
import { useAudio } from '../AudioController'
import { StoryArc } from './storyData'

interface StoryArcDetailsProps {
  arc: StoryArc
  expandedEvent: number | null
  setExpandedEvent: (idx: number | null) => void
  onOpenStoryMap: () => void
}

export default function StoryArcDetails({ 
  arc, 
  expandedEvent, 
  setExpandedEvent,
  onOpenStoryMap 
}: StoryArcDetailsProps) {
  const { playSound } = useAudio()

  return (
    <motion.div
      key={arc.id}
      className="bg-black bg-opacity-70 p-6 rounded-lg border border-gray-800 backdrop-blur-sm mb-12"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-red-500 mb-1">{arc.title}</h3>
          <p className="text-gray-400 mb-4">{arc.period}</p>
          
          <p className="text-gray-300 mb-6">{arc.description}</p>
          
          <div>
            <h4 className="text-xl font-bold text-white mb-4">Key Events</h4>
            <div className="space-y-4">
              {arc.key_events.map((event, idx) => (
                <motion.div 
                  key={idx}
                  className={`bg-black bg-opacity-50 rounded-lg border ${
                    expandedEvent === idx ? 'border-red-600' : 'border-gray-800'
                  } cursor-pointer overflow-hidden`}
                  onClick={() => {
                    setExpandedEvent(expandedEvent === idx ? null : idx)
                    playSound('click')
                  }}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs bg-red-900 text-white px-2 py-1 rounded">{event.year}</span>
                        <h5 className="font-bold text-white">{event.title}</h5>
                      </div>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedEvent === idx ? 'transform rotate-180' : ''
                      }`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  {expandedEvent === idx && (
                    <motion.div 
                      className="px-4 pb-4 text-gray-300"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p>{event.description}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-black bg-opacity-60 p-5 rounded-lg border border-gray-800">
            <h4 className="text-white font-bold mb-4 border-b border-gray-800 pb-2">Narrative Analysis</h4>
            
            <div className="space-y-4 text-sm">
              <div>
                <h5 className="text-gray-400 mb-1">Main Conflict:</h5>
                <p className="text-white">Assassin Brotherhood vs. Templar Order</p>
              </div>
              
              <div>
                <h5 className="text-gray-400 mb-1">Central Theme:</h5>
                <p className="text-white">Freedom vs. Control</p>
              </div>
              
              <div>
                <h5 className="text-gray-400 mb-1">Historical Integration:</h5>
                <div className="w-full bg-gray-800 h-1 mt-1 mb-1 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600" style={{ width: '90%' }}></div>
                </div>
                <p className="text-gray-400 text-xs">Fictional narrative woven into verified historical events</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <button
                className="w-full py-2 bg-red-700 hover:bg-red-600 text-white flex items-center justify-center gap-2 rounded"
                onClick={onOpenStoryMap}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View Character Connections
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
