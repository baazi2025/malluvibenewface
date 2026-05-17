import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navLinks = ['Chat', 'Secrets', 'Gifts', 'Wallet']

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current,
      { skewX: -30, x: '100vw', opacity: 0 },
      {
        skewX: 0,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'cubic.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, { scope: sectionRef })

  return (
    <footer
      ref={sectionRef}
      className="will-change-transform"
      style={{
        padding: '64px 5vw 32px',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        background: '#001F3F',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div
              className="text-white font-semibold text-2xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              VibeMalayali
            </div>
            <div
              className="font-malayalam text-sm text-[#B0B0B0] mt-1"
            >
              സ്വന്തം vibe
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-[#B0B0B0] hover:text-white transition-colors duration-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p
            className="text-xs"
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            © 2025 VibeMalayali. Made with 💛 for Malayalis worldwide.
          </p>
          <p
            className="text-xs"
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Terms • Privacy • Community Guidelines
          </p>
        </div>
      </div>
    </footer>
  )
}
