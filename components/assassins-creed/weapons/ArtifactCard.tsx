'use client'

import { motion } from 'framer-motion'
import { Artifact } from './artifactData'

interface ArtifactCardProps {
  artifact: Artifact
  isSelected: boolean
  onClick: () => void
}

export default function ArtifactCard({ artifact, isSelected, onClick }: ArtifactCardProps) {
  return (
    <motion.div
      className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
        isSelected
          ? 'border-red-600' 
          : 'border-gray-800 hover:border-gray-700'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      whileHover={{ y: -5 }}
      data-eagle-info="true"
    >
      <div className="aspect-square bg-black">
        <img 
          src={artifact.image} 
          alt={artifact.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 bg-gray-900">
        <h3 className="font-bold text-white text-sm">{artifact.name}</h3>
        <p className="text-xs text-gray-400">{artifact.category}</p>
      </div>
    </motion.div>
  )
}
