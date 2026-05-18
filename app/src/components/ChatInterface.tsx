import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { getSocket } from '../lib/socket';
import { Send, X, Reply, Smile, Music, Trophy, Ghost, BarChart2, Paperclip, Mic, Plus } from 'lucide-react';
import { format } from 'date-fns';
import GamesMenu from './GamesMenu';

export default function ChatInterface() {
  const { activeRoom, setActiveRoom, messages, users, currentUser, relations } = useChatStore();
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const EMOJIS = ['🔥', '😂', '❤️', '🎉', '💥', '👑', '🚀', '😍', '💯', '✨', '💀', '👀', '🥺', '😎', '💃', '🕺', '🥳', '🙌', '🍿', '🎲'];

  // Group users by status
  const onlineUsers = users.filter(u => u.status === 'online');
  const idleUsers = users.filter(u => u.status === 'idle');
  const offlineUsers = users.filter(u => u.status === 'offline');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !replyTo) return;
    
    const trimmedInput = input.trim();
    
    // Check if it's purely a reaction emoji
    if (EMOJIS.includes(trimmedInput)) {
      getSocket()?.emit('send_reaction', { room: activeRoom, emoji: trimmedInput });
    }

    // Check if it's a poll command
    let pollData = null;
    let actualContent = input;
    if (input.startsWith('/poll ')) {
      const parts = input.replace('/poll ', '').split('|').map(s => s.trim());
      if (parts.length > 1) {
        actualContent = '📊 ' + parts[0];
        pollData = {
          question: parts[0],
          options: parts.slice(1).map(opt => ({ text: opt, votes: 0 })),
          votedUsers: []
        };
      }
    }

    getSocket()?.emit('send_message', { 
      room: activeRoom, 
      content: actualContent, 
      replyToId: replyTo?.id,
      isAnonymous,
      pollData
    });
    
    setInput('');
    setReplyTo(null);
    setIsAnonymous(false);
  };

  const handleReply = (msg: any) => {
    setReplyTo(msg);
  };

  const scrollToMessage = (id: number) => {
    const el = document.getElementById(`msg-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('bg-white/20');
      setTimeout(() => el.classList.remove('bg-white/20'), 1500);
    }
  };

  const handleGameAction = (points: number) => {
    getSocket()?.emit('award_points', { points });
  };

  if (!activeRoom) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#001F3F]/95 backdrop-blur-md flex items-center justify-center p-2">
      <div className="bg-[#0A2A4A] w-full max-w-[98vw] h-[98vh] rounded-2xl border border-white/10 flex overflow-hidden shadow-2xl flex-col md:flex-row">
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full border-r border-white/10">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {activeRoom === 'Friends Vibing' ? '🎉' : '💖'} {activeRoom}
              </h2>
              <p className="text-sm text-gray-400">{users.length} members</p>
            </div>
            <button onClick={() => setActiveRoom(null)} className="p-2 hover:bg-white/10 rounded-full transition">
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Games Menu Widget */}
          <GamesMenu />

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg) => {
              // Check if sender is blocked
              const isBlocked = relations.some(r => r.targetId === msg.senderId && r.type === 'BLOCK');
              const isMuted = relations.some(r => r.targetId === msg.senderId && r.type === 'MUTE');
              
              if (isBlocked || isMuted) return null;

              const isMe = msg.senderId === currentUser?.id;
              
              // Birthday check
              const today = format(new Date(), 'MM-dd');
              const isBirthday = msg.sender.birthdate && msg.sender.birthdate.endsWith(today);

              return (
                <div key={msg.id} id={`msg-${msg.id}`} className={`flex flex-col ${isMe && !msg.isAnonymous ? 'items-end' : 'items-start'} relative group/msg`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isMe && <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">{msg.sender.username[0].toUpperCase()}</div>}
                    <span className={`text-xs font-bold ${isBirthday ? 'text-[#D4A843]' : 'text-gray-300'} flex items-center gap-1`}>
                      {msg.isAnonymous && <Ghost size={10} className="text-gray-400" />}
                      {msg.isAnonymous ? 'Anonymous' : msg.sender.username} {isBirthday && '🎉'}
                    </span>
                    <span className="text-[10px] text-gray-500">{format(new Date(msg.createdAt), 'HH:mm')}</span>
                  </div>
                  
                  <div className={`max-w-[75%] group relative ${msg.isGame ? 'bg-gradient-to-tr from-purple-600 to-blue-600 border border-purple-400/50' : isMe ? 'bg-blue-600' : 'bg-white/10'} rounded-2xl px-3 py-2 shadow-md`}>
                    {msg.replyTo && (
                      <div 
                        onClick={() => scrollToMessage(msg.replyTo!.id)}
                        className="bg-black/20 p-2 rounded-lg mb-2 text-sm text-gray-300 border-l-2 border-white/30 cursor-pointer hover:bg-black/30 transition"
                      >
                        <span className="font-semibold text-xs block">{msg.replyTo.sender.username}</span>
                        {msg.replyTo.content.substring(0, 50)}...
                      </div>
                    )}
                    <p className="text-white whitespace-pre-wrap leading-normal text-sm">{msg.content}</p>
                    
                    {/* Poll Rendering */}
                    {msg.pollData && (
                      <div className="mt-3 space-y-2">
                        {JSON.parse(msg.pollData as string).options.map((opt: any, idx: number) => {
                          const totalVotes = JSON.parse(msg.pollData as string).options.reduce((acc: number, o: any) => acc + o.votes, 0);
                          const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                          return (
                            <button 
                              key={idx}
                              onClick={() => getSocket()?.emit('vote_poll', { messageId: msg.id, optionIndex: idx })}
                              className="w-full relative overflow-hidden bg-black/20 hover:bg-black/40 border border-white/10 rounded-lg p-2 text-left transition"
                            >
                              <div className="absolute left-0 top-0 bottom-0 bg-[#D4A843]/30 transition-all duration-500" style={{ width: `${percent}%` }} />
                              <div className="relative flex justify-between text-sm text-white">
                                <span>{opt.text}</span>
                                <span className="text-gray-300">{opt.votes} ({percent}%)</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    
                    {msg.isGame && !isMe && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => handleGameAction(10)} className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition flex items-center gap-1">
                          <Trophy size={12} className="text-yellow-400" /> +10 Points
                        </button>
                        <button onClick={() => handleGameAction(5)} className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-full transition">
                          👍 Nice Play
                        </button>
                      </div>
                    )}
                    
                    {/* Reply Button (Hover) */}
                    <button 
                      onClick={() => handleReply(msg)}
                      className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-10' : '-right-10'} opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-full transition`}
                    >
                      <Reply size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-black/20 relative">
            
            {/* Action Menus (Emojis & Tools) */}
            {showEmojis && (
              <div className="absolute bottom-20 right-16 bg-[#0A2A4A] border border-white/10 p-3 rounded-2xl shadow-2xl z-50 w-64 origin-bottom-right">
                <div className="flex flex-wrap gap-2 justify-center">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => { setInput(prev => prev + emoji); setShowEmojis(false); }}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-xl transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showActions && (
              <div className="absolute bottom-20 left-4 bg-[#0A2A4A] border border-white/10 p-2 rounded-2xl shadow-2xl z-50 flex flex-col gap-2 origin-bottom-left">
                <button
                  onClick={() => { setIsAnonymous(!isAnonymous); setShowActions(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${isAnonymous ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-white/10 text-gray-300'}`}
                >
                  <Ghost size={16} /> {isAnonymous ? 'Ghost Mode ON' : 'Confession Mode'}
                </button>
                <button
                  onClick={() => { setInput('/poll Question? | Option 1 | Option 2'); setShowActions(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition"
                >
                  <BarChart2 size={16} /> Create Poll
                </button>
                <button 
                  onClick={() => { alert('Coming soon!'); setShowActions(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition"
                >
                  <Paperclip size={16} /> Attach File
                </button>
              </div>
            )}

            {replyTo && (
              <div className="mb-2 bg-white/5 p-2 rounded-lg flex justify-between items-center border-l-2 border-[#D4A843]">
                <div className="text-sm">
                  <span className="text-[#D4A843] font-semibold text-xs block">Replying to {replyTo.sender.username}</span>
                  <span className="text-gray-300">{replyTo.content.substring(0, 60)}</span>
                </div>
                <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-1 py-1 flex-1 relative">
                <button 
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition"
                  title="More Actions"
                >
                  <Plus size={18} />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent px-2 py-2 text-white focus:outline-none text-sm"
                />
                
                <button 
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/10 rounded-full transition"
                  title="Emojis"
                >
                  <Smile size={18} />
                </button>
                <button 
                  onClick={() => alert('Voice notes coming soon!')}
                  className="p-2 text-gray-400 hover:text-[#D4A843] hover:bg-white/10 rounded-full transition"
                  title="Record Voice Note"
                >
                  <Mic size={18} />
                </button>
              </div>
              <button 
                onClick={handleSend}
                className="bg-[#2D8A5E] hover:bg-[#3ab078] text-white p-3 rounded-full transition shadow-lg shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Chatters List Tab */}
        <div className="w-full md:w-96 bg-black/20 flex flex-col h-full border-l border-white/10">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="text-white font-semibold">Chatters</h3>
            <button 
              onClick={() => {
                localStorage.removeItem('mallu_chat_user');
                window.location.reload();
              }}
              className="text-xs text-red-400 hover:text-red-300 bg-red-400/10 px-2 py-1 rounded"
            >
              Logout
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Online */}
            <div>
              <h4 className="text-xs font-bold text-green-400 mb-3 uppercase tracking-wider">Online — {onlineUsers.length}</h4>
              <div className="space-y-3">
                {onlineUsers.map(u => <UserItem key={u.id} user={u} currentUser={currentUser} />)}
              </div>
            </div>

            {/* Idle */}
            {idleUsers.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-yellow-400 mb-3 uppercase tracking-wider">Idle — {idleUsers.length}</h4>
                <div className="space-y-3">
                  {idleUsers.map(u => <UserItem key={u.id} user={u} currentUser={currentUser} />)}
                </div>
              </div>
            )}

            {/* Offline */}
            {offlineUsers.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Offline — {offlineUsers.length}</h4>
                <div className="space-y-3">
                  {offlineUsers.map(u => <UserItem key={u.id} user={u} currentUser={currentUser} />)}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

function UserItem({ user, currentUser }: { user: any, currentUser: any }) {
  const { setActiveDmUserId } = useChatStore();
  const today = format(new Date(), 'MM-dd');
  const isBirthday = user.birthdate && user.birthdate.endsWith(today);

  return (
    <div 
      onClick={() => {
        if (user.id !== currentUser?.id) setActiveDmUserId(user.id);
      }}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
          {user.username[0].toUpperCase()}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0A2A4A] ${
          user.status === 'online' ? 'bg-green-500' : 
          user.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className={`text-sm truncate ${isBirthday ? 'text-[#D4A843] font-bold' : 'text-white'}`}>
            {user.username}
          </p>
          {isBirthday && <span title="Birthday Boy/Girl">🎉</span>}
          {user.points > 0 && (
            <span className="ml-1 bg-[#D4A843]/20 text-[#D4A843] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
              <Trophy size={10} /> {user.points}
            </span>
          )}
        </div>
        {user.note && (
          <p className="text-xs text-gray-400 truncate flex items-center gap-1">
            {user.note.includes('Listening') ? <Music size={10} /> : <Smile size={10} />}
            {user.note}
          </p>
        )}
      </div>
    </div>
  );
}
