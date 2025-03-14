'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Text, Html } from '@react-three/drei'
import { useAudio } from './AudioController'
import InteractiveMarker from './InteractiveMarker'

// Game data for the timeline
const games = [
  {
    id: 1,
    title: "Assassin's Creed",
    year: 2007,
    protagonist: "Altaïr Ibn-La'Ahad",
    setting: "Holy Land, 1191",
    description: "The game that started it all. Experience the adventures of Altaïr during the Third Crusade as he works to stop Robert de Sablé and the Templars.",
    coverImage: "/images/assassins-creed/ac1-cover.jpg",
    color: "#9c1d10",
    iconModel: "altair_symbol.glb"
  },
  {
    id: 2,
    title: "Assassin's Creed II",
    year: 2009,
    protagonist: "Ezio Auditore da Firenze",
    setting: "Renaissance Italy, 1476-1499",
    description: "Follow Ezio Auditore through Renaissance Italy as he becomes an Assassin to avenge his family and uncover a conspiracy reaching the Vatican.",
    coverImage: "/images/assassins-creed/ac2-cover.jpg",
    color: "#1f4fad",
    iconModel: "ezio_symbol.glb"
  },
  {
    id: 3,
    title: "Assassin's Creed: Brotherhood",
    year: 2010,
    protagonist: "Ezio Auditore da Firenze",
    setting: "Rome, 1499-1507",
    description: "Continue Ezio's journey in Rome as he works to rebuild the Assassin Brotherhood and fight against Cesare Borgia.",
    coverImage: "/images/assassins-creed/acb-cover.jpg",
    color: "#7a211a",
    iconModel: "brotherhood_symbol.glb"
  },
  {
    id: 4,
    title: "Assassin's Creed: Revelations",
    year: 2011,
    protagonist: "Ezio Auditore & Altaïr Ibn-La'Ahad",
    setting: "Constantinople, 1511-1512",
    description: "The conclusion of Ezio's story, where he follows Altaïr's footsteps to Constantinople to discover the secrets of the Assassin Order.",
    coverImage: "/images/assassins-creed/acr-cover.jpg",
    color: "#384e88",
    iconModel: "revelations_symbol.glb"
  },
  {
    id: 5,
    title: "Assassin's Creed III",
    year: 2012,
    protagonist: "Connor Kenway (Ratonhnhaké:ton)",
    setting: "Colonial America, 1754-1783",
    description: "Experience the American Revolution through the eyes of Connor, a half-English, half-Mohawk Assassin fighting for freedom.",
    coverImage: "/images/assassins-creed/ac3-cover.jpg",
    color: "#173a59",
    iconModel: "ac3_symbol.glb"
  },
  {
    id: 6,
    title: "Assassin's Creed IV: Black Flag",
    year: 2013,
    protagonist: "Edward Kenway",
    setting: "Caribbean, 1715-1722",
    description: "Set sail on the high seas as Edward Kenway, a pirate and eventual Assassin, during the Golden Age of Piracy.",
    coverImage: "/images/assassins-creed/ac4-cover.jpg",
    color: "#167a8b",
    iconModel: "black_flag_symbol.glb"
  },
  {
    id: 7,
    title: "Assassin's Creed: Unity",
    year: 2014,
    protagonist: "Arno Dorian",
    setting: "Paris, French Revolution, 1789-1799",
    description: "Join Arno Dorian in Paris during the French Revolution, as he searches for redemption while uncovering a conspiracy.",
    coverImage: "/images/assassins-creed/acu-cover.jpg",
    color: "#2a3572",
    iconModel: "unity_symbol.glb"
  },
  {
    id: 8,
    title: "Assassin's Creed: Syndicate",
    year: 2015,
    protagonist: "Jacob & Evie Frye",
    setting: "London, Industrial Revolution, 1868",
    description: "Control twin Assassins Jacob and Evie Frye as they navigate Victorian London and fight against Templar control.",
    coverImage: "/images/assassins-creed/acs-cover.jpg",
    color: "#382f1e",
    iconModel: "syndicate_symbol.glb"
  },
  {
    id: 9,
    title: "Assassin's Creed: Origins",
    year: 2017,
    protagonist: "Bayek of Siwa",
    setting: "Ptolemaic Egypt, 49-43 BCE",
    description: "Discover the origins of the Assassin Brotherhood through the eyes of Bayek, the last Medjay of Egypt.",
    coverImage: "/images/assassins-creed/aco-cover.jpg",
    color: "#d9a03e",
    iconModel: "origins_symbol.glb"
  },
  {
    id: 10,
    title: "Assassin's Creed: Odyssey",
    year: 2018,
    protagonist: "Alexios/Kassandra",
    setting: "Ancient Greece, Peloponnesian War, 431-422 BCE",
    description: "Embark on an epic journey through Ancient Greece as a mercenary caught between the conflict of Athens and Sparta.",
    coverImage: "/images/assassins-creed/acod-cover.jpg",
    color: "#26629e",
    iconModel: "odyssey_symbol.glb"
  },
  {
    id: 11,
    title: "Assassin's Creed: Valhalla",
    year: 2020,
    protagonist: "Eivor",
    setting: "England, Viking Age, 873 CE",
    description: "Lead epic Viking raids against Saxon strongholds as Eivor, while becoming entangled in the centuries-old conflict between Assassins and Templars.",
    coverImage: "/images/assassins-creed/acv-cover.jpg",
    color: "#0a3c5d",
    iconModel: "valhalla_symbol.glb"
  }
]

export default function TimelineSection() {
  const [activeGame, setActiveGame] = useState<number | null>(null)
  const [detailView, setDetailView] = useState<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { playSound } = useAudio()
  const controls = useAnimation()

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"]
  })
  
  const timelineProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1])
  
  useEffect(() => {
    const unsubscribe = timelineProgress.onChange(v => {
      controls.start({
        width: `${v * 100}%`,
        transition: { duration: 0.1 }
      })
    })
    
    return () => unsubscribe()
  }, [timelineProgress, controls])

  const handleGameClick = (index: number) => {
    setActiveGame(index === activeGame ? null : index)
    playSound('click')
  }
  
  const openDetailView = (index: number) => {
    setDetailView(index)
    playSound('menu_open')
    document.body.style.overflow = 'hidden'
  }
  
  const closeDetailView = () => {
    setDetailView(null)
    playSound('menu_close')
    document.body.style.overflow = ''
  }

  return (
    <section id="timeline" className="min-h-screen py-24 px-4 relative" ref={timelineRef}>
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold mb-20 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-red-600">Chronological</span> Timeline
        </motion.h2>
        
        {/* Interactive Timeline */}
        <div className="relative mb-24">
          {/* Progress line */}
          <div className="absolute top-12 left-0 w-full h-1 bg-gray-800">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-red-600"
              animate={controls}
            />
          </div>
          
          {/* Year marks */}
          <div className="absolute top-0 left-0 w-full flex justify-between text-sm text-gray-500">
            <span>2007</span>
            <span>2023</span>
          </div>
          
          {/* Game markers */}
          <div className="flex relative pt-16">
            {games.map((game, index) => (
              <div 
                key={index} 
                className="flex-1 relative"
              >
                <motion.div 
                  className={`absolute left-1/2 transform -translate-x-1/2 -top-[50px] cursor-pointer ${activeGame === index ? 'z-10' : 'z-0'}`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  onClick={() => handleGameClick(index)}
                >
                  <div 
                    className={`w-4 h-4 rounded-full border-2 border-red-600 bg-black mx-auto ${activeGame === index ? 'scale-150' : ''}`}
                    style={{ backgroundColor: activeGame === index ? game.color : 'black' }}
                  />
                  <div 
                    className="w-0.5 h-8 bg-red-800 mx-auto opacity-70"
                  />
                  <motion.div 
                    className={`w-20 text-center text-sm font-medium transition-all ${activeGame === index ? 'text-white' : 'text-gray-500'}`}
                    animate={activeGame === index ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {game.year}
                  </motion.div>
                </motion.div>
                
                {/* Game image preview */}
                <AnimatePresence>
                  {activeGame === index && (
                    <motion.div 
                      className="absolute left-1/2 top-8 transform -translate-x-1/2 flex flex-col items-center origin-bottom"
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ type: 'spring', damping: 20 }}
                    >
                      <div 
                        className="w-40 h-56 rounded-md overflow-hidden bg-gray-900 shadow-xl border-2"
                        style={{ borderColor: game.color }}
                      >
                        <img 
                          src={game.coverImage} 
                          alt={game.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-110"
                          onClick={() => openDetailView(index)}
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <h4 className="font-bold text-white text-sm">{game.title}</h4>
                        <p className="text-red-500 text-xs">{game.setting}</p>
                      </div>
                      <motion.button 
                        className="mt-2 px-3 py-1 bg-red-800 hover:bg-red-700 text-white text-xs rounded flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openDetailView(index)}
                      >
                        <span>Details</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        
        {/* Animus data visualization */}
        <motion.div 
          className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-red-900"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-red-500">DNA Memory Sequence</h3>
            <div className="text-xs font-mono text-gray-400">
              15 SEQUENCES AVAILABLE • 11 SYNCHRONIZED
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Memory stats */}
            <div className="md:col-span-1 bg-black bg-opacity-70 p-4 rounded-lg">
              <h4 className="text-white font-bold mb-4 border-b border-red-900 pb-2">Genetic Memory Statistics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">DNA Synchronization</span>
                    <span className="text-red-400">73%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: '73%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Memory Corruption</span>
                    <span className="text-yellow-400">18%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-600" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Animus Stability</span>
                    <span className="text-green-400">92%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Total Memory Sequences:</span>
                  <span className="text-white">1,392</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessed Memories:</span>
                  <span className="text-white">874</span>
                </div>
                <div className="flex justify-between">
                  <span>Corrupted Data:</span>
                  <span className="text-yellow-400">215 blocks</span>
                </div>
              </div>
            </div>
            
            {/* Timeline overview */}
            <div className="md:col-span-2">
              <div className="text-sm text-gray-400 mb-4">
                Navigate through the Assassin's Creed series spanning multiple historical eras. Each entry follows the eternal conflict between the Assassin Brotherhood, fighting for free will, and the Templar Order, seeking control through order.
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black bg-opacity-70 p-3 rounded-lg border border-gray-800">
                  <h5 className="text-red-500 text-sm font-bold mb-2">Earliest Era</h5>
                  <p className="text-white text-sm font-bold">Ancient Greece, 431 BCE</p>
                  <p className="text-xs text-gray-400">Assassin's Creed: Odyssey</p>
                </div>
                
                <div className="bg-black bg-opacity-70 p-3 rounded-lg border border-gray-800">
                  <h5 className="text-red-500 text-sm font-bold mb-2">Latest Era</h5>
                  <p className="text-white text-sm font-bold">Viking Age England, 873 CE</p>
                  <p className="text-xs text-gray-400">Assassin's Creed: Valhalla</p>
                </div>
                
                <div className="bg-black bg-opacity-70 p-3 rounded-lg border border-gray-800">
                  <h5 className="text-red-500 text-sm font-bold mb-2">Most Memories</h5>
                  <p className="text-white text-sm font-bold">Ezio Auditore da Firenze</p>
                  <p className="text-xs text-gray-400">3 Full Games (AC2, Brotherhood, Revelations)</p>
                </div>
                
                <div className="bg-black bg-opacity-70 p-3 rounded-lg border border-gray-800">
                  <h5 className="text-red-500 text-sm font-bold mb-2">Key Artifact</h5>
                  <p className="text-white text-sm font-bold">The Apple of Eden</p>
                  <p className="text-xs text-gray-400">Found across multiple timelines</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Detail view modal */}
      {detailView !== null && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-900 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg border border-red-900"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-[40vh]">
              <img 
                src={games[detailView].coverImage} 
                alt={games[detailView].title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent"></div>
              
              <button 
                className="absolute top-4 right-4 bg-black bg-opacity-60 p-2 rounded-full text-white hover:bg-opacity-80"
                onClick={closeDetailView}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="absolute bottom-6 left-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                  {games[detailView].title}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="bg-red-600 text-white px-2 py-1 text-xs rounded">
                    {games[detailView].year}
                  </div>
                  <div className="text-white text-sm">
                    {games[detailView].setting}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-red-500 font-bold text-xl mb-4">Synopsis</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {games[detailView].description}
                  </p>
                  
                  <h3 className="text-red-500 font-bold text-xl mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Historical Setting</h4>
                      <p className="text-sm text-gray-400">Explore an authentic recreation of {games[detailView].setting.split(',')[0]} during this pivotal time in history.</p>
                    </div>
                    <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Protagonist</h4>
                      <p className="text-sm text-gray-400">Play as {games[detailView].protagonist}, whose journey will shape the Brotherhood's future.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-800 pt-6">
                    <h3 className="text-red-500 font-bold text-xl mb-4">Historical Timeline</h3>
                    <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-3 mb-3">
                        <div className="mb-2 sm:mb-0">
                          <span className="text-white font-bold mr-2">Time Period:</span>
                          <span className="text-gray-300">{games[detailView].setting.split(',')[1]?.trim() || games[detailView].setting}</span>
                        </div>
                        <div className="bg-red-900 bg-opacity-50 px-2 py-1 rounded text-xs text-white">
                          Historical Era
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        This game is set during a pivotal moment in human history, featuring real historical events and figures intertwined with the fictional narrative of the Assassin-Templar conflict.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                    <h4 className="text-white font-bold border-b border-gray-800 pb-2 mb-4">Game Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Release Date:</span>
                        <span className="text-white">{games[detailView].year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Developer:</span>
                        <span className="text-white">Ubisoft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Main Platform:</span>
                        <span className="text-white">Multiple</span>
                      </div>
                      <div className="border-t border-gray-800 pt-3 mt-3">
                        <span className="text-gray-400 block mb-2">Main Villain:</span>
                        <span className="text-white font-medium">Templar Order</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-red-900 bg-opacity-20 rounded-lg border border-red-900">
                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Animus Data Integrity
                    </h4>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Memory Sync</span>
                        <span className="text-gray-300">89%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300">
                      This memory sequence has good synchronization with minimal data corruption. Full immersion recommended.
                    </p>
                  </div>
                  
                  <button
                    className="mt-4 w-full py-3 flex justify-center items-center bg-red-700 hover:bg-red-600 text-white rounded"
                    onClick={() => {
                      playSound('click')
                      closeDetailView()
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" className="mr-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Enter Memory
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
