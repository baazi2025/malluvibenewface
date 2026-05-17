interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  seeAll?: boolean
  onSeeAll?: () => void
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  seeAll = false,
  onSeeAll,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex ${align === 'center' ? 'flex-col items-center text-center' : 'flex-row items-end justify-between'} mb-16`}
    >
      <div className={align === 'left' ? 'max-w-xl' : ''}>
        <span className="font-label text-xs text-[#D4A843] block mb-4">
          {eyebrow}
        </span>
        <h2 className="font-h1 text-white" style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}>
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-[#B0B0B0] mt-2"
            style={{ fontSize: '18px', lineHeight: '1.7', maxWidth: align === 'left' ? '480px' : '600px' }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {seeAll && (
        <button
          onClick={onSeeAll}
          className="text-sm text-[#D4A843] hover:underline transition-all duration-300 shrink-0"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          See all rooms &rarr;
        </button>
      )}
    </div>
  )
}
