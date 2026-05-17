import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { getSocket } from '../lib/socket';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';

export default function RadioPlayer() {
  const { radioState, setRadioState, currentUser } = useChatStore();
  const [volume] = useState(0.5);
  // We use a dummy audio source for demo purposes
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audioRef.current.loop = true;
    
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = radioState.isMuted ? 0 : volume;
    
    if (radioState.isPlaying) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [radioState.isPlaying, radioState.isMuted, volume]);

  const togglePlay = () => setRadioState({ isPlaying: !radioState.isPlaying });
  const toggleMute = () => setRadioState({ isMuted: !radioState.isMuted });

  const setAsStatus = () => {
    if (!currentUser) return;
    const note = `Listening to ${radioState.track}`;
    getSocket()?.emit('update_note', note);
  };

  return (
    <div className="fixed top-4 right-4 z-[40] bg-[#0A2A4A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-4 shadow-lg hover:bg-[#0A2A4A] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4A843] to-[#F2C94C] flex items-center justify-center shadow-inner relative overflow-hidden">
          <Radio size={20} className="text-[#0A2A4A] relative z-10" />
          {radioState.isPlaying && (
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          )}
        </div>
        <div>
          <h4 className="text-white text-xs font-bold flex items-center gap-2">
            LIVE RADIO 
            {radioState.isPlaying && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          </h4>
          <p className="text-[#B0B0B0] text-[10px] w-32 truncate">{radioState.track}</p>
        </div>
      </div>

      <div className="h-8 w-[1px] bg-white/10 mx-1" />

      <div className="flex items-center gap-2">
        <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-full text-white transition">
          {radioState.isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-full text-white transition">
          {radioState.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {currentUser && (
        <button 
          onClick={setAsStatus}
          className="ml-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-white transition uppercase tracking-wider"
        >
          Set as Status
        </button>
      )}
    </div>
  );
}
