import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  hover?: boolean
}

export default function GlassCard({
  children,
  className = '',
  glowColor,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-[20px] p-8
        bg-[rgba(255,255,255,0.07)]
        border border-[rgba(255,255,255,0.12)]
        backdrop-blur-lg
        transition-all duration-400
        ${hover ? 'hover:-translate-y-1 hover:border-[rgba(255,255,255,0.2)]' : ''}
        ${className}
      `}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow overlay */}
      {glowColor && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${glowColor} 0%, transparent 70%)`,
            opacity: 0.3,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
