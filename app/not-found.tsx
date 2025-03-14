'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Float, Center, Text3D } from '@react-three/drei';
import { Mesh, MathUtils } from 'three';

// 3D Model Component
const ErrorModel = () => {
  const mesh = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = MathUtils.lerp(mesh.current.rotation.y, (state.mouse.x * Math.PI) / 5, 0.075);
      mesh.current.rotation.x = MathUtils.lerp(mesh.current.rotation.x, (state.mouse.y * Math.PI) / 5, 0.075);
    }
  });

  return (
    <mesh ref={mesh} rotation={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial color="#ff6b6b" roughness={0.3} metalness={0.8} />
    </mesh>
  );
};

// 404 Text Component - This uses properly static font path that won't cause fetch issues
const ErrorText = () => {
  return (
    <Center position={[0, -1.5, 0]}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        curveSegments={32}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={0.1}
        height={0.5}
        lineHeight={0.5}
        letterSpacing={0.1}
        size={1}
      >
        {`404`}
        <meshNormalMaterial />
      </Text3D>
    </Center>
  );
};

// Generated particles with consistent seeds
const generateParticles = (count: number) => {
  // Use a fixed seed for consistent rendering between server and client
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    // Use consistent values based on index instead of random
    const size = 5 + (i % 10);
    const posX = ((i * 17) % 100);
    const posY = ((i * 23) % 100);
    const r = ((i * 50) % 255);
    const g = ((i * 70) % 255);
    const b = 255;
    const duration = 20 + (i % 10);
    
    particles.push({
      id: i,
      size,
      posX,
      posY,
      color: `rgba(${r}, ${g}, ${b}, 0.8)`,
      duration
    });
  }
  
  return particles;
};

// Fallback component for 3D loading
const CanvasFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-white text-xl">Loading 3D elements...</div>
  </div>
);

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [has3DError, setHas3DError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const particles = generateParticles(20);

  // Only initialize after component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize audio after component has mounted
  useEffect(() => {
    if (mounted && !audioInitialized) {
      try {
        audioRef.current = new Audio('/sounds/assassins-creed/synchronize.mp3');
        audioRef.current.volume = 1;
        
        // Use a user interaction to start audio (auto-play policies)
        const handleFirstInteraction = () => {
          if (audioRef.current && !audioInitialized) {
            audioRef.current.play()
              .then(() => {
                setAudioInitialized(true);
                document.removeEventListener('click', handleFirstInteraction);
                document.removeEventListener('keydown', handleFirstInteraction);
              })
              .catch(error => {
                console.log('Audio play prevented by browser policy:', error);
              });
          }
        };
        
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
        
        return () => {
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('keydown', handleFirstInteraction);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
          }
        };
      } catch (error) {
        console.error('Audio initialization error:', error);
      }
    }
  }, [mounted, audioInitialized]);

  // Handle click sound for link (only client-side)
  const playClickSound = () => {
    if (typeof window !== 'undefined' && mounted) {
      try {
        const clickSound = new Audio('/sounds/assassins-creed/click.mp3');
        clickSound.volume = 0.3;
        clickSound.play().catch(e => console.log('Click sound prevented:', e));
      } catch (error) {
        console.error('Click sound error:', error);
      }
    }
  };

  // Handle 3D error
  const handle3DError = (error: any) => {
    console.error('3D rendering error:', error);
    setHas3DError(true);
  };

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white">
      {/* 3D Background - Only render on client side */}
      {mounted && !has3DError && (
        <div className="absolute inset-0 z-0">
          <ErrorBoundary fallback={<CanvasFallback />} onError={handle3DError}>
            <Suspense fallback={<CanvasFallback />}>
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <PresentationControls
                  global
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                  <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                    <ErrorModel />
                    <mesh position={[0, -1.5, 0]}>
                      <torusGeometry args={[1.5, 0.5, 16, 32]} />
                      <meshNormalMaterial />
                    </mesh>
                  </Float>
                </PresentationControls>
              </Canvas>
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Page Not Found
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 text-gray-300">
          The dimension you're looking for doesn't exist in this universe.
        </p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-medium text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
          onClick={playClickSound}
        >
          Return to Reality
        </Link>
      </div>
      
      {/* Animated Background Elements - Using predictable values rather than random ones */}
      <div className="absolute inset-0 z-0 opacity-20">
        {particles.map((particle) => (
          <div 
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.posX}%`,
              top: `${particle.posY}%`,
              background: particle.color,
              boxShadow: '0 0 10px 2px rgba(99, 102, 241, 0.5)',
              animation: `floatParticle${particle.id % 3} ${particle.duration}s linear infinite`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes floatParticle0 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(100px, -100px) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        
        @keyframes floatParticle1 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-80px, -50px) rotate(120deg);
          }
          66% {
            transform: translate(80px, 50px) rotate(240deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
        
        @keyframes floatParticle2 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(50px, -80px) rotate(90deg);
          }
          50% {
            transform: translate(100px, 0px) rotate(180deg);
          }
          75% {
            transform: translate(50px, 80px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Error boundary component to catch 3D rendering errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Add React import needed for the ErrorBoundary component
import React from 'react';