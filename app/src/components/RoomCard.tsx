import AudioWaveform from './AudioWaveform'

interface RoomCardProps {
  name: string
  icon: string
  liveCount: number
  bgColor: string
}

export default function RoomCard({ name, icon, liveCount, bgColor }: RoomCardProps) {
  return (
    <div
      className="relative flex-shrink-0 rounded-[20px] overflow-hidden cursor-pointer group"
      style={{
        width: '340px',
        aspectRatio: '1.2 / 1',
        backgroundColor: bgColor,
      }}
    >
      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">
          {icon}
        </span>
      </div>

      {/* Bottom overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
      >
        <h3
          className="text-white font-semibold text-xl mb-1"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse-dot" />
          <span className="text-[#4ADE80] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {liveCount.toLocaleString()} live
          </span>
        </div>
        <AudioWaveform
          barCount={8}
          color="rgba(255,255,255,0.4)"
          minHeight={4}
          maxHeight={20}
          className="mt-3"
        />
      </div>
    </div>
  )
}
