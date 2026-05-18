import { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { initSocket, getSocket } from '../lib/socket';
import { X, UserCheck, User } from 'lucide-react';

export default function LoginModal() {
  const { setCurrentUser, showLoginModal, setShowLoginModal, setActiveRoom } = useChatStore();
  const [mode, setMode] = useState<'selection' | 'prime'>('selection');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Check local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mallu_chat_user');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      initSocket(user.id);
    }
  }, [setCurrentUser]);

  const handleLogin = async (loginUsername: string) => {
    if (!loginUsername.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('https://vibingmalayali.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername })
      });
      const data = await res.json();
      setCurrentUser(data);
      localStorage.setItem('mallu_chat_user', JSON.stringify(data));
      initSocket(data.id);
      
      setShowLoginModal(false);
      setActiveRoom('Friends Vibing');
      setTimeout(() => {
        getSocket()?.emit('join_room', 'Friends Vibing');
      }, 500);
      
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend. Make sure the Web Service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    const randomGuestName = `Guest_${Math.floor(Math.random() * 10000)}`;
    handleLogin(randomGuestName);
  };

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A2A4A] p-8 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl text-center relative">
        <button 
          onClick={() => {
            setShowLoginModal(false);
            setMode('selection');
          }} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="w-20 h-20 bg-gradient-to-tr from-[#D4A843] to-[#F2C94C] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(212,168,67,0.3)] transform rotate-3">
          <span className="text-3xl font-bold text-[#0A2A4A]">Vibe</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Join the Community</h2>
        <p className="text-gray-400 text-sm mb-8">How would you like to enter?</p>
        
        {mode === 'selection' ? (
          <div className="space-y-4">
            <button
              onClick={() => setMode('prime')}
              className="w-full bg-gradient-to-r from-[#D4A843] to-[#FF8C69] hover:opacity-90 text-[#1A1A1A] font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              <UserCheck size={20} /> Prime Viber (Registered)
            </button>
            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
            <button
              onClick={handleGuest}
              disabled={loading}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <User size={20} /> {loading ? 'Entering...' : 'Enter as Guest'}
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(username); }} className="space-y-4 animate-fade-in">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Username"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-center focus:outline-none focus:border-[#D4A843] transition-colors text-lg"
              required
              maxLength={20}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4A843] hover:bg-[#F2C94C] text-[#1A1A1A] font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-lg shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Join Chat'}
            </button>
            <button
              type="button"
              onClick={() => setMode('selection')}
              className="text-gray-400 text-sm hover:text-white mt-4"
            >
              &larr; Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
