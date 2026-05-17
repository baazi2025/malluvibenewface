import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SkewSlideWrapperProps {
  children: ReactNode
  direction?: 'left' | 'right'
  className?: string
  delay?: number
}

export default function SkewSlideWrapper({
  children,
  direction = 'left',
  className = '',
  delay = 0,
}: SkewSlideWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const skewX = direction === 'left' ? 30 : -30
    const x = direction === 'left' ? '-100vw' : '100vw'

    gsap.fromTo(
      containerRef.current,
      { skewX, x, opacity: 0 },
      {
        skewX: 0,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'cubic.inOut',
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    )
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
