import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlassCard from '../components/GlassCard'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: '🎙️',
    title: 'Live Voice Rooms',
    body: 'RJ become karyam — host your own room or join others. Talk about movies, life, or just chill.',
    glowColor: 'rgba(45,138,94,0.25)',
    iconBg: 'rgba(45,138,94,0.2)',
    iconBorder: 'rgba(45,138,94,0.3)',
  },
  {
    icon: '🏆',
    title: 'Daily Rewards',
    body: '100 coins = ₹1. Login daily, stay active, earn real rewards. Your time here is valued.',
    glowColor: 'rgba(255,140,105,0.25)',
    iconBg: 'rgba(255,140,105,0.2)',
    iconBorder: 'rgba(255,140,105,0.3)',
  },
  {
    icon: '👑',
    title: 'VIP & Badges',
    body: 'Stand out with premium frames and exclusive badges. Show your status in the community.',
    glowColor: 'rgba(212,168,67,0.25)',
    iconBg: 'rgba(212,168,67,0.2)',
    iconBorder: 'rgba(212,168,67,0.3)',
  },
  {
    icon: '🎵',
    title: 'Voice Notes',
    body: '2x coin reward for voice notes. Share your thoughts, sing, or just say hi.',
    glowColor: 'rgba(107,45,91,0.25)',
    iconBg: 'rgba(107,45,91,0.2)',
    iconBorder: 'rgba(107,45,91,0.3)',
  },
]

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      headerRef.current,
      { skewX: 30, x: '-100vw', opacity: 0 },
      { skewX: 0, x: 0, opacity: 1, duration: 1.2, ease: 'cubic.inOut' }
    )

    const cards = gridRef.current.children
    tl.fromTo(
      cards,
      { skewX: -30, x: '100vw', opacity: 0 },
      {
        skewX: 0,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'cubic.inOut',
        stagger: 0.1,
      },
      '-=0.8'
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 5vw',
        background: '#001F3F',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16 will-change-transform"
        >
          <span className="font-label text-xs text-[#D4A843] block mb-4">
            ✨ WHAT YOU GET
          </span>
          <h2
            className="font-h1 text-white"
            style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}
          >
            Built for Real Connections
          </h2>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <GlassCard key={feature.title} glowColor={feature.glowColor}>
              <div className="flex flex-col items-start">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5"
                  style={{
                    background: feature.iconBg,
                    border: `1px solid ${feature.iconBorder}`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-white font-semibold text-2xl mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-[#B0B0B0]"
                  style={{
                    fontSize: '18px',
                    lineHeight: '1.7',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {feature.body}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
