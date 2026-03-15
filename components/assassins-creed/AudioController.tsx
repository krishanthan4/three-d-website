'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Create a context for audio functions
type AudioContextType = {
  playSound: (sound: string) => void
  toggleMusic: () => void
  isMusicPlaying: boolean
  startMusicPlayback: () => void
}

const AudioContext = createContext<AudioContextType>({
  playSound: () => {},
  toggleMusic: () => {},
  isMusicPlaying: false,
  startMusicPlayback: () => {}
})

// Custom hook to use audio
export const useAudio = () => useContext(AudioContext)

// Sound effects library
const SOUNDS = {
  click: '/sounds/assassins-creed/click.mp3',
  hover: '/sounds/assassins-creed/hover.mp3',
  marker: '/sounds/assassins-creed/marker.mp3',
  notification: '/sounds/assassins-creed/notification.mp3',
  synchronize: '/sounds/assassins-creed/synchronize.mp3',
  blade: '/sounds/assassins-creed/blade.mp3',
  menu_open: '/sounds/assassins-creed/menu_open.mp3',
  menu_close: '/sounds/assassins-creed/menu_close.mp3',
  eagle: '/sounds/assassins-creed/eagle.mp3'
}

// Background music tracks
const MUSIC_TRACKS = [
  '/sounds/assassins-creed/rogue-theme.mp3',
  '/sounds/assassins-creed/ezio-theme.mp3',
  '/sounds/assassins-creed/revelations.mp3'
]

export default function AudioController({ children }: { children?: React.ReactNode }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isAudioInitialized, setIsAudioInitialized] = useState(false)
  
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const soundsRef = useRef<{ [key: string]: HTMLAudioElement }>({})

  // Initialize audio elements
  useEffect(() => {
    // Create music player
    if (typeof window !== 'undefined') {
      musicRef.current = new Audio(MUSIC_TRACKS[currentTrack])
      musicRef.current.loop = true
      musicRef.current.volume = volume
      
      // Add ended event to handle continuous playback
      musicRef.current.addEventListener('ended', () => {
        nextTrack();
      });
      
      // Preload sound effects
      Object.entries(SOUNDS).forEach(([key, src]) => {
        const audio = new Audio(src)
        audio.preload = 'auto'
        audio.volume = volume
        soundsRef.current[key] = audio
      })
      
      setIsAudioInitialized(true)
    }
    
    return () => {
      // Cleanup
      if (musicRef.current) {
        musicRef.current.pause()
        musicRef.current.src = ''
      }
      
      Object.values(soundsRef.current).forEach(audio => {
        audio.pause()
        audio.src = ''
      })
    }
  }, [])
  
  // Update music volume when volume changes
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = volume
    }
    
    Object.values(soundsRef.current).forEach(audio => {
      audio.volume = volume
    })
  }, [volume])
  
  // Handle track changes
  useEffect(() => {
    if (musicRef.current && isAudioInitialized) {
      const wasPlaying = !musicRef.current.paused
      musicRef.current.pause()
      musicRef.current.src = MUSIC_TRACKS[currentTrack]
      musicRef.current.load() // Ensure the new source is loaded
      
      if (wasPlaying || isMusicPlaying) {
        musicRef.current.play()
          .catch(e => console.log('Music autoplay prevented:', e))
      }
    }
  }, [currentTrack, isMusicPlaying, isAudioInitialized])
  
  // Play a sound effect
  const playSound = (sound: string) => {
    if (soundsRef.current[sound]) {
      // Create a clone to allow overlapping sounds
      const clone = soundsRef.current[sound].cloneNode() as HTMLAudioElement
      clone.volume = volume
      clone.play()
        .catch(e => console.log('Sound play prevented:', e))
      
      // Remove clone after playing
      clone.onended = () => {
        clone.remove()
      }
    }
  }
  
  // Start music playback (called after page load)
  const startMusicPlayback = () => {
    if (musicRef.current && !isMusicPlaying) {
      musicRef.current.play()
        .then(() => {
          setIsMusicPlaying(true)
        })
        .catch(e => console.log('Music autoplay prevented:', e))
    }
  }
  
  // Toggle music playback
  const toggleMusic = () => {
    setIsMusicPlaying(prev => {
      if (prev) {
        musicRef.current?.pause()
        return false
      } else {
        musicRef.current?.play()
          .catch(e => console.log('Music autoplay prevented:', e))
        return true
      }
    })
    
    // Play UI sound
    playSound('click')
  }
  
  // Change to next track
  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % MUSIC_TRACKS.length)
    playSound('click')
  }
  
  // Change to previous track
  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length)
    playSound('click')
  }

  return (
    <AudioContext.Provider value={{ playSound, toggleMusic, isMusicPlaying, startMusicPlayback }}>
      {/* Audio Controls UI */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        <motion.button
          className="bg-black bg-opacity-70 text-white p-3 rounded-full mb-2 border border-red-800"
          onClick={() => {
            setShowControls(prev => !prev)
            playSound('menu_open')
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Audio controls"
        >
          {isMusicPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
              <path d="M10 8l6 4-6 4V8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
              <path d="M10 9h4v6h-4z" />
            </svg>
          )}
        </motion.button>
        
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="bg-black bg-opacity-80 p-4 rounded-lg border border-red-800 mb-2 w-64"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white">Audio Controls</h3>
                <div className="text-xs text-red-500 font-mono">
                  Track {currentTrack + 1}/{MUSIC_TRACKS.length}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <button 
                  className="text-white hover:text-red-500" 
                  onClick={prevTrack}
                  aria-label="Previous track"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 20L9 12l10-8v16z" />
                    <path d="M5 19V5" />
                  </svg>
                </button>
                <button 
                  className="bg-red-800 hover:bg-red-700 text-white p-2 rounded-full" 
                  onClick={toggleMusic}
                  aria-label={isMusicPlaying ? "Pause music" : "Play music"}
                >
                  {isMusicPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 4H6v16h4V4zM18 4h-4v16h4V4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>
                <button 
                  className="text-white hover:text-red-500" 
                  onClick={nextTrack}
                  aria-label="Next track"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 4l10 8-10 8V4z" />
                    <path d="M19 5v14" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-1 flex justify-between text-xs text-gray-400">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-red-600"
                aria-label="Volume control"
              />
              
              <div className="mt-3 text-xs text-gray-400 text-center border-t border-gray-700 pt-2">
                Press <kbd className="bg-gray-700 px-1">V</kbd> for Eagle Vision
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {children}
    </AudioContext.Provider>
  )
}
