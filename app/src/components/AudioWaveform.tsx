import { useMemo } from 'react'

interface AudioWaveformProps {
  barCount?: number
  color?: string
  minHeight?: number
  maxHeight?: number
  className?: string
}

export default function AudioWaveform({
  barCount = 5,
  color = 'rgba(255,255,255,0.4)',
  minHeight = 4,
  maxHeight = 20,
  className = '',
}: AudioWaveformProps) {
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => ({
      id: i,
      animDelay: `${(Math.random() * 0.4).toFixed(2)}s`,
      waveMin: `${minHeight + Math.random() * 4}px`,
      waveMax: `${maxHeight - Math.random() * 8}px`,
    }))
  }, [barCount, minHeight, maxHeight])

  return (
    <div className={`flex items-end gap-[3px] ${className}`}>
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="animate-wave rounded-sm"
          style={{
            width: '2px',
            backgroundColor: color,
            borderRadius: '1px',
            animationDelay: bar.animDelay,
            '--wave-min': bar.waveMin,
            '--wave-max': bar.waveMax,
            minHeight: bar.waveMin,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
