import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RoomCard from '../components/RoomCard'
import { useChatStore } from '../store/chatStore'
import { getSocket } from '../lib/socket'

gsap.registerPlugin(ScrollTrigger)

const rooms = [
  { name: 'Friends Vibing', icon: '🎉', liveCount: 154, bgColor: '#2D8A5E' },
  { name: 'Romance Vibe', icon: '💖', liveCount: 89, bgColor: '#6B2D5B' },
]

export default function TrendingRoomsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  
  const { setActiveRoom, currentUser } = useChatStore()

  const handleRoomClick = (roomName: string) => {
    if (!currentUser) return;
    setActiveRoom(roomName);
    getSocket()?.emit('join_room', roomName);
  }

  useGSAP(() => {
    if (!sectionRef.current || !headingRef.current || !cardsRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      headingRef.current,
      { skewX: -30, x: '100vw', opacity: 0 },
      { skewX: 0, x: 0, opacity: 1, duration: 1.2, ease: 'cubic.inOut' }
    )
    tl.fromTo(
      cardsRef.current,
      { skewX: 30, x: '-100vw', opacity: 0 },
      { skewX: 0, x: 0, opacity: 1, duration: 1.2, ease: 'cubic.inOut' },
      '-=1.0'
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden"
      style={{
        padding: '120px 5vw',
        background: '#001F3F',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div ref={headingRef} className="will-change-transform">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="font-label text-xs text-[#2D8A5E] block mb-4">
                🔥 TRENDING NOW
              </span>
              <h2
                className="font-h1 text-white"
                style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}
              >
                Find Your Tribe
              </h2>
              <p
                className="text-[#B0B0B0] mt-2"
                style={{
                  fontSize: '18px',
                  lineHeight: '1.7',
                  maxWidth: '480px',
                }}
              >
                Jump into live conversations happening right now across the globe
              </p>
            </div>
            <button
              className="text-sm text-[#D4A843] hover:underline transition-all duration-300 mt-4 md:mt-0 shrink-0"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              See all rooms &rarr;
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="flex gap-6 overflow-x-auto pb-4 will-change-transform"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {rooms.map((room) => (
            <div key={room.name} onClick={() => handleRoomClick(room.name)} className="cursor-pointer">
              <RoomCard {...room} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
