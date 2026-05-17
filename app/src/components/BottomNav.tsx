import { useState } from 'react'
import { Home, MessageCircle, Lock, Gift, Wallet } from 'lucide-react'

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'secrets', label: 'Secrets', icon: Lock },
  { id: 'gifts', label: 'Gifts', icon: Gift },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
]

export default function BottomNav() {
  const [active, setActive] = useState('home')

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      style={{ maxWidth: '400px', width: '90vw' }}
    >
      <div
        className="flex items-center justify-around py-3 px-6 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-1 transition-colors duration-300 group"
            >
              <Icon
                size={20}
                className={`transition-colors duration-300 ${
                  isActive ? 'text-[#D4A843]' : 'text-[#B0B0B0] group-hover:text-white'
                }`}
              />
              <span
                className={`text-[10px] transition-colors duration-300 ${
                  isActive ? 'text-[#D4A843]' : 'text-[#B0B0B0] group-hover:text-white'
                }`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 w-8 h-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #D4A843, #FF8C69)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
