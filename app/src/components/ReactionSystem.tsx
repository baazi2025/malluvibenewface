import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../lib/socket';
import { useChatStore } from '../store/chatStore';

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
}

export default function ReactionSystem() {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const { currentUser } = useChatStore();

  const triggerBurst = useCallback((emoji: string) => {
    // Determine configuration based on emoji type
    const scalar = emoji === '🔥' || emoji === '💥' ? 2 : 1.5;
    const particleCount = emoji === '🎉' ? 100 : 40;
    
    // Confetti explosion
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['circle' as const, 'square' as const],
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
    };

    if (emoji === '🎉') {
      confetti({ ...defaults, particleCount, spread: 100, origin: { y: 0.8 } });
    } else {
      // Emoji specific burst
      const emojiShape = confetti.shapeFromText({ text: emoji, scalar });
      confetti({
        ...defaults,
        particleCount,
        shapes: [emojiShape],
        origin: { y: 0.7, x: 0.3 + Math.random() * 0.4 } // Randomize horizontal position
      });
    }

    // Add floating emoji
    const id = Math.random().toString(36).substr(2, 9);
    setFloatingEmojis(prev => [...prev, { id, emoji, x: Math.random() * 80 + 10 }]);

    // Remove after animation
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentUser) return;

    const handleReaction = ({ emoji }: { emoji: string }) => {
      triggerBurst(emoji);
    };

    socket.on('receive_reaction', handleReaction);
    return () => { socket.off('receive_reaction', handleReaction); };
  }, [triggerBurst, currentUser]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <AnimatePresence>
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: '100vh', x: `${item.x}vw`, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: '-20vh',
              x: [`${item.x}vw`, `${item.x - 5}vw`, `${item.x + 5}vw`, `${item.x}vw`],
              scale: [0.5, 1.5, 1, 1.2]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute text-4xl drop-shadow-2xl"
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
