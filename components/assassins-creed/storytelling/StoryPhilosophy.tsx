'use client'

import { motion } from 'framer-motion'

export default function StoryPhilosophy() {
  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black bg-opacity-70 p-6 rounded-lg backdrop-blur-sm border border-gray-800">
          <h3 className="text-2xl font-bold text-red-500 mb-4">The Assassin's Creed</h3>
          
          <div className="space-y-6">
            <div className="border-l-4 border-red-700 pl-4">
              <p className="text-white text-xl italic">"Nothing is true, everything is permitted."</p>
              <p className="text-gray-400 mt-2">The maxim of the Assassin Brotherhood, reminding that reality is subjective and we define our own limitations.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-white font-bold mb-1">The Creed's Three Tenets:</h4>
                <ol className="list-decimal pl-5 text-gray-300 space-y-1">
                  <li>Stay your blade from the flesh of an innocent.</li>
                  <li>Hide in plain sight, be one with the crowd.</li>
                  <li>Never compromise the Brotherhood.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-black bg-opacity-70 p-6 rounded-lg backdrop-blur-sm border border-gray-800">
          <h3 className="text-2xl font-bold text-red-500 mb-4">The Templar Vision</h3>
          
          <div className="space-y-6">
            <div className="border-l-4 border-gray-600 pl-4">
              <p className="text-white text-xl italic">"May the Father of Understanding guide us."</p>
              <p className="text-gray-400 mt-2">The Templars seek to create a perfect world through order and control, believing humanity needs guidance.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-white font-bold mb-1">The Templar Principles:</h4>
                <ol className="list-decimal pl-5 text-gray-300 space-y-1">
                  <li>Order through control is necessary for progress.</li>
                  <li>Humanity requires guidance from enlightened rulers.</li>
                  <li>Peace through power and unified vision.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
