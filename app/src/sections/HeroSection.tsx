import NameHelix from '../components/NameHelix'
import BottomNav from '../components/BottomNav'

const stats = [
  { value: '12,438', label: 'Online' },
  { value: '247', label: 'Live Rooms' },
  { value: '9.2k', label: 'Vibes/min' },
]

const avatarColors = ['#D4A843', '#2D8A5E', '#FF8C69', '#6B2D5B', '#2D5A6B']

export default function HeroSection() {
  const handleJoin = () => {
    // Scroll to the rooms section
    document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: '#001F3F',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.15) 0%, rgba(0,31,63,0) 70%)',
          zIndex: 0,
        }}
      />

      {/* 3D Name Helix */}
      <NameHelix />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-5"
        style={{ maxWidth: '900px' }}
      >
        {/* Top tag */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(212,168,67,0.12)',
            border: '1px solid rgba(212,168,67,0.3)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse-dot" />
          <span className="font-label text-xs text-[#D4A843]">
            MALAYALI COMMUNITY • 12,438 ONLINE NOW
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display text-white"
          style={{ fontSize: 'clamp(48px, 7vw, 80px)' }}
        >
          Your Vibe.
          <br />
          <span className="gradient-text-gold">Your People.</span>
        </h1>

        {/* Subheadline - Malayalam */}
        <p
          className="font-malayalam text-[#B0B0B0] mt-4"
          style={{ fontSize: '18px', lineHeight: '1.6' }}
        >
          സംസാരിക്കൂ · കളിക്കൂ · ഫ്രണ്ട്സ് ഉണ്ടാക്കൂ · Rewards നേടൂ
        </p>

        {/* CTA Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-float">
          <button
            onClick={handleJoin}
            className="px-12 py-[20px] rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-[0_0_40px_rgba(212,168,67,0.3)]"
            style={{
              background: 'linear-gradient(135deg, #D4A843, #FF8C69)',
              color: '#1A1A1A',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            🚀 Welcome to the Vibe
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-12 mt-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-[#D4A843] font-semibold"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(24px, 3vw, 40px)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-[#B0B0B0] text-sm mt-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Avatar cluster */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex -space-x-2.5">
            {avatarColors.map((color, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                style={{
                  background: color,
                  border: '2px solid #001F3F',
                }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span
            className="text-[#B0B0B0] text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            +10k Malayali youth already vibing
          </span>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </section>
  )
}
