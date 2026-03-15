'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from 'react-error-boundary'

// Dynamically import components to handle errors better
const Eagle = dynamic(() => import('./Eagle'), { 
  ssr: false,
  loading: () => null 
})

const AssassinJump = dynamic(() => import('./AssassinJump'), { 
  ssr: false,
  loading: () => null 
})

function FallbackComponent({ error }: { error: Error }) {
  return (
    <div className="text-white bg-red-900/50 p-4 rounded">
      <h2 className="text-xl font-bold">Something went wrong:</h2>
      <pre className="mt-2 text-sm overflow-auto max-h-40">{error.message}</pre>
    </div>
  )
}

export default function AssassinsHero() {
  const [debug, setDebug] = useState(true)
  
  return (
    <div className="w-full h-screen bg-black relative">
      {/* Debug UI */}
      {debug && (
        <div className="absolute top-0 left-0 bg-black/50 text-white p-2 z-10 text-sm">
          <div>Debug Mode: ON</div>
          <button 
            className="bg-red-500 hover:bg-red-700 px-2 py-1 rounded mt-1"
            onClick={() => setDebug(false)}
          >
            Turn Off Debug
          </button>
        </div>
      )}
    
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Canvas shadows className="bg-black">
          {/* Camera setup - adjusted for better view of the jump */}
          <PerspectiveCamera 
            makeDefault 
            position={[0, 10, 30]} 
            fov={50} 
          />
          <OrbitControls 
            enableZoom={true} 
            enablePan={debug}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={debug ? 0 : Math.PI / 4}
          />
          
          {/* Lighting - made stronger for better visibility */}
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={3}
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <ambientLight intensity={0.7} />
          <spotLight position={[0, 15, 0]} intensity={2} angle={0.5} penumbra={1} />
          
          {/* Environment */}
          <Environment preset="sunset" />
          <color attach="background" args={['#111']} />
          
          {/* 3D Content */}
          <Suspense fallback={null}>
            <AssassinJump debug={debug} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}
