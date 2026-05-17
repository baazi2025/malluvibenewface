import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AudioWaveform from '../components/AudioWaveform'

gsap.registerPlugin(ScrollTrigger)

export default function LiveNowSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !cardRef.current) return

    gsap.fromTo(
      cardRef.current,
      { skewX: -30, x: '100vw', opacity: 0 },
      {
        skewX: 0,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'cubic.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
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
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-[20px] p-10 will-change-transform"
          style={{
            background: 'linear-gradient(135deg, #1A0A3E 0%, #0D1B3E 50%, #1A0A3E 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(212,168,67,0.15) 0%, transparent 70%)',
            }}
          />

          {/* Top row */}
          <div className="relative z-10 flex items-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-live-pulse" />
              <span className="font-label text-xs text-[#EF4444]">
                LIVE NOW
              </span>
            </div>
            <span
              className="ml-auto text-sm text-[#B0B0B0]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              438 listening
            </span>
          </div>

          {/* Content row */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 mt-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shrink-0"
              style={{
                background: 'radial-gradient(circle, rgba(212,168,67,0.3), rgba(0,0,0,0))',
                border: '1px solid rgba(212,168,67,0.3)',
              }}
            >
              🎙️
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-white font-semibold"
                style={{
                  fontSize: 'clamp(20px, 2.5vw, 32px)',
                  fontFamily: "'Noto Sans Malayalam', 'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                }}
              >
                "പാട്ടും വർത്തമാനവും" with RJ Anju
              </h3>
              <p
                className="text-[#B0B0B0] mt-2"
                style={{
                  fontSize: '18px',
                  lineHeight: '1.7',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Music, stories, and midnight conversations
              </p>
              <button
                className="text-sm text-[#D4A843] mt-2 hover:underline transition-all duration-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                tap to join &rarr;
              </button>
            </div>
          </div>

          {/* Audio visualizer */}
          <div className="relative z-10 mt-6">
            <AudioWaveform
              barCount={40}
              color="rgba(212,168,67,0.3)"
              minHeight={4}
              maxHeight={32}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
