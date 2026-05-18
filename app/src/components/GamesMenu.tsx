import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '../lib/socket';
import { useChatStore } from '../store/chatStore';
import { Gamepad2, X, MessageCircleQuestion, HelpCircle, Film, Swords } from 'lucide-react';

const GAMES = [
  { id: 'truth_or_dare', title: 'Truth or Dare', icon: HelpCircle, color: 'text-purple-400' },
  { id: 'would_you_rather', title: 'Would You Rather', icon: Swords, color: 'text-red-400' },
  { id: 'movie_guess', title: 'Movie Guess', icon: Film, color: 'text-yellow-400' },
  { id: 'word_chain', title: 'Word Chain', icon: MessageCircleQuestion, color: 'text-green-400' }
];

export default function GamesMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeRoom, currentUser } = useChatStore();

  const handleStartGame = (gameType: string) => {
    if (!currentUser || !activeRoom) return;
    getSocket()?.emit('start_game', { room: activeRoom, gameType });
    setIsOpen(false);
  };

  if (!activeRoom) return null;

  return (
    <div className="absolute bottom-24 right-4 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-[#0A2A4A] border border-white/20 p-3 rounded-2xl shadow-2xl mb-4 w-64 origin-bottom-right"
          >
            <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
              <Gamepad2 size={16} className="text-[#D4A843]" />
              Party Games
            </h3>
            <div className="space-y-2">
              {GAMES.map(game => (
                <button
                  key={game.id}
                  onClick={() => handleStartGame(game.id)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center gap-3 group"
                >
                  <game.icon size={18} className={`${game.color} group-hover:scale-110 transition`} />
                  <span className="text-white text-sm font-medium">{game.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-[#D4A843] to-[#F2C94C] hover:from-[#F2C94C] hover:to-[#FFF] rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={24} className="text-[#0A2A4A]" /> : <Gamepad2 size={24} className="text-[#0A2A4A]" />}
      </button>
    </div>
  );
}
