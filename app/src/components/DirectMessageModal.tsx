import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { getSocket } from '../lib/socket';
import { Send, X, ShieldAlert, ShieldX } from 'lucide-react';
import { format } from 'date-fns';

export default function DirectMessageModal() {
  const { activeDmUserId, setActiveDmUserId, users, currentUser, dms, relations } = useChatStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetUser = users.find(u => u.id === activeDmUserId);

  useEffect(() => {
    if (activeDmUserId) {
      getSocket()?.emit('fetch_dms', activeDmUserId);
    }
  }, [activeDmUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dms]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    const handleTyping = ({ senderId, isTyping: typing }: any) => {
      if (senderId === activeDmUserId) {
        setRemoteTyping(typing);
      }
    };
    socket.on('dm_typing_status', handleTyping);
    return () => { socket.off('dm_typing_status', handleTyping); };
  }, [activeDmUserId]);

  const handleSend = () => {
    if (!input.trim() || !currentUser || !activeDmUserId) return;
    getSocket()?.emit('send_dm', {
      receiverId: activeDmUserId,
      content: input,
    });
    setInput('');
    getSocket()?.emit('typing_dm', { receiverId: activeDmUserId, isTyping: false });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      getSocket()?.emit('typing_dm', { receiverId: activeDmUserId, isTyping: true });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      getSocket()?.emit('typing_dm', { receiverId: activeDmUserId, isTyping: false });
    }, 1000);
  };

  const handleAction = (action: 'MUTE' | 'BLOCK') => {
    const isActive = relations.some(r => r.targetId === activeDmUserId && r.type === action);
    getSocket()?.emit('update_relation', {
      targetId: activeDmUserId,
      type: action,
      action: isActive ? 'remove' : 'add'
    });
  };

  if (!activeDmUserId || !targetUser) return null;

  const isBlocked = relations.some(r => r.targetId === activeDmUserId && r.type === 'BLOCK');
  const isMuted = relations.some(r => r.targetId === activeDmUserId && r.type === 'MUTE');

  // Filter DMs for this conversation
  const currentDms = dms.filter(dm => 
    (dm.senderId === currentUser?.id && dm.receiverId === activeDmUserId) ||
    (dm.senderId === activeDmUserId && dm.receiverId === currentUser?.id)
  );

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-80 md:w-96 bg-[#001F3F] border border-white/20 rounded-t-xl rounded-bl-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
      
      {/* Header */}
      <div className="bg-[#0A2A4A] p-3 flex justify-between items-center border-b border-white/10 relative">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {targetUser.username[0].toUpperCase()}
            </div>
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0A2A4A] ${
              targetUser.status === 'online' ? 'bg-green-500' : 
              targetUser.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold leading-tight">{targetUser.username}</h3>
            {targetUser.note && <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{targetUser.note}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleAction('MUTE')} 
            className={`p-1.5 rounded-md hover:bg-white/10 transition ${isMuted ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400'}`}
            title="Mute Notifications"
          >
            <ShieldAlert size={14} />
          </button>
          <button 
            onClick={() => handleAction('BLOCK')} 
            className={`p-1.5 rounded-md hover:bg-white/10 transition ${isBlocked ? 'text-red-400 bg-red-400/10' : 'text-gray-400'}`}
            title="Block User"
          >
            <ShieldX size={14} />
          </button>
          <button onClick={() => setActiveDmUserId(null)} className="p-1.5 hover:bg-white/10 rounded-md transition ml-1 text-gray-400">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-black/20">
        {currentDms.map((dm) => {
          const isMe = dm.senderId === currentUser?.id;
          return (
            <div key={dm.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                isMe ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'
              }`}>
                {dm.content}
              </div>
              <span className="text-[10px] text-gray-500 mt-1">{format(new Date(dm.createdAt), 'HH:mm')}</span>
            </div>
          );
        })}
        {remoteTyping && (
          <div className="text-xs text-gray-400 italic">Typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {isBlocked ? (
        <div className="p-3 bg-red-500/10 border-t border-red-500/20 text-center text-red-400 text-sm">
          You have blocked this user.
        </div>
      ) : (
        <div className="p-3 bg-[#0A2A4A] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Direct message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
          />
          <button 
            onClick={handleSend}
            className="bg-[#2D8A5E] hover:bg-[#3ab078] text-white p-2 rounded-full transition"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
