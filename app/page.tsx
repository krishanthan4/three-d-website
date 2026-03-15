"use client";
import AbstergoOverlay from "@/components/assassins-creed/AbstergoOverlay";
import AnimatedCursor from "@/components/assassins-creed/AnimatedCursor";
import AnvilFooter from "@/components/assassins-creed/AnvilFooter";
import AssassinsNavbar from "@/components/assassins-creed/AssassinsNavbar";
import AudioController from "@/components/assassins-creed/AudioController";
import CharactersSection from "@/components/assassins-creed/CharactersSection";
import EagleVisionMode from "@/components/assassins-creed/EagleVisionMode";
import HeroSection from "@/components/assassins-creed/HeroSection";
import HiddenBlade from "@/components/assassins-creed/HiddenBlade";
import LocationsSection from "@/components/assassins-creed/LocationsSection";
import ParallaxBackground from "@/components/assassins-creed/ParallaxBackground";
import StorytellingSection from "@/components/assassins-creed/StorytellingSection";
import TimelineSection from "@/components/assassins-creed/TimelineSection";
import WeaponsSection from "@/components/assassins-creed/WeaponsSection";
import LoadingScreen from "@/components/assassins-creed/LoadingScreen";
import { Suspense, useEffect, useState } from "react";

export default function Home() {

  const [loaded, setLoaded] = useState(false)
  const [eagleVisionActive, setEagleVisionActive] = useState(false)
  const [synchronizationLevel, setSynchronizationLevel] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Enable eagle vision mode with 'V' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'v') {
        setEagleVisionActive(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Increase synchronization based on scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY
      const scrollPercentage = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
      setSynchronizationLevel(scrollPercentage)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize components
  useEffect(() => {
    setIsClient(true)
    
    // Simulate Animus loading sequence
    const timer = setTimeout(() => {
      setLoaded(true)
      document.documentElement.style.overflow = 'auto'
    }, 5000)

    // Lock scrolling during loading
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.classList.add('assassins-creed-theme')

    return () => {
      clearTimeout(timer)
      document.documentElement.classList.remove('assassins-creed-theme')
    }
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <main id="animus-interface" className="animus-container max-w-7xl" >
    {!loaded && <LoadingScreen />}
    
    <AnimatedCursor />
    <ParallaxBackground />
    <AssassinsNavbar synchronizationLevel={synchronizationLevel} />

    {/* Hidden blade cursor effect activated on mouse down */}
    <HiddenBlade />

    <div className="animus-content">
      <HeroSection />
      <TimelineSection />
      <LocationsSection />
      <CharactersSection />
      <WeaponsSection />
      <StorytellingSection />
    </div>

    <AnvilFooter />
    <AudioController />

    <Suspense fallback={null}>
      <AbstergoOverlay />
      {eagleVisionActive && <EagleVisionMode />}
    </Suspense>
  </main>
  );
}
