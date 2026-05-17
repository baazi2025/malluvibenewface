import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LoginBonusSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current || !cardRef.current) return

    gsap.fromTo(
      cardRef.current,
      { skewX: 30, x: '-100vw', opacity: 0 },
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
        padding: '40px 5vw',
        background: '#001F3F',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          ref={cardRef}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-[20px] p-6 sm:px-10 will-change-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(45,138,94,0.1) 100%)',
            border: '1px solid rgba(212,168,67,0.3)',
          }}
        >
          <div>
            <h3
              className="text-[#D4A843] font-semibold text-xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ⚡ Daily Login Bonus
            </h3>
            <p
              className="text-[#B0B0B0] mt-1"
              style={{
                fontSize: '18px',
                lineHeight: '1.7',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              150 hrs active = cash coupon 🎁
            </p>
          </div>
          <button
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:brightness-110 shrink-0"
            style={{
              background: '#D4A843',
              color: '#1A1A1A',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Claim
          </button>
        </div>
      </div>
    </section>
  )
}
