'use client'

import { motion } from 'framer-motion'

export default function ModernDayNarrative() {
  return (
    <motion.div
      className="bg-black bg-opacity-60 p-6 rounded-lg border border-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <h3 className="text-2xl font-bold text-red-500 mb-6">Modern Day Narrative</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xl text-white font-bold mb-3">The Animus Project</h4>
          <p className="text-gray-300 mb-4">
            In the modern era, the conflict between Assassins and Templars has evolved with technology. Abstergo Industries, a corporate front for the Templar Order, developed the Animus - a device that allows users to relive genetic memories of their ancestors stored in their DNA.
          </p>
          
          <div className="bg-black bg-opacity-50 p-4 rounded-lg">
            <h5 className="font-bold text-white mb-2">Key Modern Characters</h5>
            <ul className="text-gray-300 space-y-2">
              <li><span className="text-red-500 font-bold">Desmond Miles:</span> Descendant of multiple Assassin bloodlines, vital to preventing the 2012 catastrophe.</li>
              <li><span className="text-red-500 font-bold">Layla Hassan:</span> Former Abstergo employee who joined the Assassins after discovering historical secrets.</li>
              <li><span className="text-red-500 font-bold">Rebecca Crane & Shaun Hastings:</span> Assassin tech specialists supporting field operations.</li>
            </ul>
          </div>
        </div>
        
        <div>
          <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-white">The Grand Temple Incident</h5>
                <p className="text-gray-400 text-sm">2012 - Desmond's sacrifice to prevent global catastrophe</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-white">The Phoenix Project</h5>
                <p className="text-gray-400 text-sm">Abstergo's attempt to sequence precursor DNA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-white">The Instruments of the First Will</h5>
                <p className="text-gray-400 text-sm">Modern cult seeking to revive Isu dominance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
