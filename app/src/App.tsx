import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import HeroSection from './sections/HeroSection'
import TrendingRoomsSection from './sections/TrendingRoomsSection'
import FeaturesSection from './sections/FeaturesSection'
import LiveNowSection from './sections/LiveNowSection'
import LoginBonusSection from './sections/LoginBonusSection'
import FooterSection from './sections/FooterSection'

import ChatInterface from './components/ChatInterface'
import DirectMessageModal from './components/DirectMessageModal'
import RadioPlayer from './components/RadioPlayer'
import LoginModal from './components/LoginModal'
import ReactionSystem from './components/ReactionSystem'
import AnimatedBackground from './components/AnimatedBackground'
import { useChatStore } from './store/chatStore'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const { hasEnteredSite, activeRoom } = useChatStore()

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.4,
      gestureOrientation: 'vertical',
    })

    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#FFFFFF',
      }}
    >
      <AnimatedBackground />
      <div className="relative z-10">
        <HeroSection />
        
        {hasEnteredSite && (
          <>
            <FeaturesSection />
            <TrendingRoomsSection />
            <LiveNowSection />
            <LoginBonusSection />
            <FooterSection />

            {/* Chat Platform Modals and Overlays */}
            <LoginModal />
            <ChatInterface />
            <DirectMessageModal />
            {activeRoom && <RadioPlayer />}
            <ReactionSystem />
          </>
        )}
      </div>
    </div>
  )
}

export default App
