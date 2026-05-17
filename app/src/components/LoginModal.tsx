import { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { initSocket } from '../lib/socket';

export default function LoginModal() {
  const { currentUser, setCurrentUser } = useChatStore();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('https://vibingmalayali.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      setCurrentUser(data);
      localStorage.setItem('mallu_chat_user', JSON.stringify(data));
      initSocket(data.id);
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend. Make sure the Node server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A2A4A] p-8 rounded-2xl max-w-sm w-full border border-white/10 shadow-2xl text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-[#D4A843] to-[#F2C94C] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-3">
          <span className="text-2xl font-bold text-[#0A2A4A]">Vibe</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Vibe Chat</h2>
        <p className="text-gray-400 text-sm mb-6">Enter a username to join the community.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Username"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-[#D4A843] transition-colors"
            required
            maxLength={20}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D8A5E] hover:bg-[#3ab078] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Entering...' : 'Enter Chat'}
          </button>
        </form>
      </div>
    </div>
  );
}
