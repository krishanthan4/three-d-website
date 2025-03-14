'use client'

import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-black z-20"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Entering the Animus</h2>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-red-600 to-red-800"
            initial={{ width: '0%' }}
            animate={{ width: '90%' }}
            transition={{ duration: 2 }}
          />
        </div>
        <p className="mt-4 text-sm text-gray-400">Synchronizing memories...</p>
      </div>
    </motion.div>
  )
}
