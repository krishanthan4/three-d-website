'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaUsers, FaBook, FaMapMarkedAlt, FaInfoCircle } from 'react-icons/fa'

export default function BrotherhoodPage() {
  const [activeTab, setActiveTab] = useState('creed')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Play ambience sound
    if (typeof window !== 'undefined') {
      try {
        const ambient = new Audio('/sounds/assassins-creed/brotherhood_ambient.mp3')
        ambient.volume = 0.15
        ambient.loop = true
        ambient.play().catch(e => console.log('Ambient sound prevented:', e))
        
        return () => {
          ambient.pause()
          setMounted(false)
        }
      } catch (error) {
        console.error('Ambient sound error:', error)
      }
    }
  }, [])
  
  const playSound = (soundName: string) => {
    if (typeof window !== 'undefined' && mounted) {
      try {
        const sound = new Audio(`/sounds/assassins-creed/${soundName}.mp3`)
        sound.volume = 0.3
        sound.play().catch(e => console.log(`${soundName} sound prevented:`, e))
      } catch (error) {
        console.error(`${soundName} sound error:`, error)
      }
    }
  }
  
  const tabs = [
    { id: 'creed', label: 'The Creed', icon: <FaBook className="mr-2" /> },
    { id: 'members', label: 'Notable Members', icon: <FaUsers className="mr-2" /> },
    { id: 'bureaus', label: 'Assassin Bureaus', icon: <FaMapMarkedAlt className="mr-2" /> },
    { id: 'history', label: 'Brotherhood History', icon: <FaInfoCircle className="mr-2" /> }
  ]
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'creed':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-red-600 mb-4">The Assassin's Creed</h2>
            <div className="border-l-4 border-red-800 pl-4 py-2 bg-gray-900 italic">
              "Nothing is true, everything is permitted."
            </div>
            <p>
              The Creed is a set of guiding principles that have stewarded the actions of the Assassin Brotherhood for centuries. 
              Unlike the rigid Templar ideology, the Creed encourages critical thinking and personal liberty.
            </p>
            <h3 className="text-xl font-semibold text-white mt-6">The Three Tenets</h3>
            <ul className="list-disc pl-5 space-y-4 text-gray-300">
              <li>
                <span className="font-bold text-white">Stay your blade from the flesh of an innocent.</span>
                <p className="mt-1">The Assassins seek to protect the innocent and only target those who would exploit or harm others.</p>
              </li>
              <li>
                <span className="font-bold text-white">Hide in plain sight.</span>
                <p className="mt-1">Become one with the crowd. An Assassin never compromises the Brotherhood by drawing unnecessary attention.</p>
              </li>
              <li>
                <span className="font-bold text-white">Never compromise the Brotherhood.</span>
                <p className="mt-1">The actions of one Assassin must never bring harm to all. If an Assassin fails, they stand alone.</p>
              </li>
            </ul>
            <div className="mt-8">
              <img src="/images/assassins-creed/brotherhood/assassin-symbol-large.png" alt="Assassin Symbol" className="mx-auto h-40 opacity-40" />
            </div>
          </div>
        )
      
      case 'members':
        return (
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-6">Notable Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Altaïr Ibn-La'Ahad", era: 'Third Crusade', role: 'Master Assassin', img: '/images/assassins-creed/brotherhood/altair.jpg' },
                { name: 'Ezio Auditore da Firenze', era: 'Renaissance', role: 'Mentor', img: '/images/assassins-creed/brotherhood/ezio.jpg' },
                { name: 'Edward Kenway', era: 'Golden Age of Piracy', role: 'Master Assassin', img: '/images/assassins-creed/brotherhood/edward.jpg' },
                { name: 'Arno Dorian', era: 'French Revolution', role: 'Master Assassin', img: '/images/assassins-creed/brotherhood/arno.jpg' }
              ].map((assassin, idx) => (
                <motion.div 
                  key={idx}
                  className="bg-gray-900 p-4 rounded border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={assassin.img} 
                        alt={assassin.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white">{assassin.name}</h3>
                      <div className="text-red-500 text-sm">{assassin.role}</div>
                      <div className="text-gray-400 text-sm">{assassin.era}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'bureaus':
        return (
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-6">Assassin Bureaus</h2>
            <div className="relative w-full h-[500px] bg-gray-900 rounded overflow-hidden">
              <img
                src="/images/assassins-creed/brotherhood/world-map.jpg" 
                alt="World Map" 
                className="w-full h-full object-cover opacity-70"
              />
              
              {[
                { location: 'Rome', coords: { top: '42%', left: '50%' } },
                { location: 'Constantinople', coords: { top: '38%', left: '57%' } },
                { location: 'Paris', coords: { top: '35%', left: '47%' } },
                { location: 'London', coords: { top: '30%', left: '45%' } },
                { location: 'Cairo', coords: { top: '50%', left: '55%' } },
                { location: 'Damascus', coords: { top: '44%', left: '58%' } }
              ].map((bureau, idx) => (
                <motion.div 
                  key={idx}
                  className="absolute w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={bureau.coords}
                  whileHover={{ scale: 1.3 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.2 }}
                  onClick={() => playSound('marker')}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <div className="absolute top-full mt-1 text-white text-xs whitespace-nowrap">
                    {bureau.location}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mt-6 text-gray-300">
              Assassin Bureaus are hidden sanctuaries established in major cities around the world.
              Serving as safe houses, intelligence centers, and strategic meeting points, these bureaus
              were essential to the Brotherhood's operations.
            </p>
          </div>
        )
      
      case 'history':
        return (
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-6">Brotherhood History</h2>
            <div className="relative border-l-2 border-red-800 ml-4 pl-8 pb-8 space-y-12">
              {[
                { year: '465 BCE', title: 'Formation of the Hidden Ones', content: 'Darius, a Persian proto-Assassin, assassinates King Xerxes I of Persia, marking one of the earliest uses of the hidden blade.' },
                { year: '47 BCE', title: 'The Hidden Ones', content: 'Bayek of Siwa and his wife Aya establish the Hidden Ones organization in Egypt, the precursor to the Assassin Brotherhood.' },
                { year: '1090', title: 'Alamut Era', content: 'Hassan-i Sabbāh establishes the Levantine Assassin Brotherhood, setting up the fortress of Alamut as headquarters.' },
                { year: '1191', title: 'Third Crusade', content: 'Altaïr Ibn-La\'Ahad begins his journey to redemption during the Third Crusade, eventually reforming the Brotherhood.' },
                { year: '1500', title: 'Italian Renaissance', content: 'Ezio Auditore rebuilds the Italian Brotherhood and expands Assassin influence throughout the Mediterranean.' }
              ].map((event, idx) => (
                <motion.div 
                  key={idx} 
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <div className="absolute -left-[40px] w-6 h-6 rounded-full border-2 border-red-600 bg-black" />
                  <div className="text-red-500 font-semibold">{event.year}</div>
                  <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
                  <p className="text-gray-300 mt-2">{event.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )
        
      default:
        return <div>Select a tab to learn about the Brotherhood</div>
    }
  }
  
  return (
    <div className="animus-container min-h-screen">
      {/* Header */}
      <header className="p-4 border-b border-red-800 flex items-center justify-between bg-black">
        <Link href="/" onClick={() => playSound('blade_retract')} className="flex items-center text-gray-300 hover:text-white group">
          <FaArrowLeft className="mr-2 group-hover:translate-x-[-2px] transition-transform" />
          <span>Return to Main</span>
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold">
            <span className="text-red-600">THE</span> BROTHERHOOD
          </h1>
        </div>
        <div className="w-24"></div> {/* Spacer for balance */}
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                playSound('click')
              }}
              className={`flex items-center px-4 py-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-red-700 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <motion.div 
          className="bg-gray-900 bg-opacity-70 p-6 rounded-sm border border-gray-800"
          key={activeTab} // Force re-render on tab change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </main>
      
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: "url('/images/assassins-creed/brotherhood/brotherhood-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(50%)'
        }}
      />
    </div>
  )
}
