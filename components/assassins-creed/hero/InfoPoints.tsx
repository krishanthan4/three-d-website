'use client'

import { useState } from 'react'
import { Html } from '@react-three/drei'

interface InfoPointsProps {
  playSound: (sound: string) => void
}

export default function InfoPoints({ playSound }: InfoPointsProps) {
  const [activePoint, setActivePoint] = useState<number | null>(null)
  
  const points = [
    { 
      position: [3, 0, 3] as [number, number, number], 
      title: "The Creed", 
      content: "Nothing is true, everything is permitted. Work in the dark to serve the light." 
    },
    { 
      position: [-3, 1, 2] as [number, number, number], 
      title: "Hidden Blade", 
      content: "The iconic weapon of the Assassin Brotherhood, dating back to ancient times." 
    },
    { 
      position: [2, 3, -2] as [number, number, number], 
      title: "Eagle Vision", 
      content: "A sixth sense that allows Assassins to identify allies and enemies." 
    }
  ]
  
  return (
    <>
      {points.map((point, idx) => (
        <group key={idx} position={point.position}>
          <mesh 
            onClick={() => {
              setActivePoint(activePoint === idx ? null : idx)
              playSound('notification')
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
              playSound('hover')
            }}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color="#ff0000" 
              emissive="#ff0000"
              emissiveIntensity={activePoint === idx ? 1 : 0.5}
            />
          </mesh>
          
          {activePoint === idx && (
            <Html position={[0, 0.5, 0]}>
              <div className="bg-black bg-opacity-80 p-3 rounded-md text-white w-64">
                <h4 className="font-bold text-red-500">{point.title}</h4>
                <p className="text-xs mt-1">{point.content}</p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </>
  )
}
