import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  avatar: string;
  note: string;
  birthdate: string | null;
  status: 'online' | 'idle' | 'offline';
  points: number;
  streak: number;
  badges: string;
}

export interface Message {
  id: number;
  content: string;
  roomId: string;
  senderId: number;
  sender: User;
  replyToId: number | null;
  replyTo: Message | null;
  createdAt: string;
  isGame?: boolean;
  gameType?: string;
  isAnonymous?: boolean;
  pollData?: string;
}

export interface DirectMessage {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  sender: User;
  receiver: User;
  read: boolean;
  createdAt: string;
}

export interface UserRelation {
  id: number;
  userId: number;
  targetId: number;
  type: 'MUTE' | 'BLOCK';
}

interface ChatState {
  currentUser: User | null;
  users: User[];
  messages: Message[];
  dms: DirectMessage[];
  activeRoom: string | null;
  activeDmUserId: number | null;
  relations: UserRelation[];
  radioState: { isPlaying: boolean; isMuted: boolean; track: string };
  showLoginModal: boolean;
  
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  updateUser: (userId: number, updates: Partial<User>) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  setDms: (dms: DirectMessage[]) => void;
  addDm: (dm: DirectMessage) => void;
  setActiveRoom: (room: string | null) => void;
  setActiveDmUserId: (userId: number | null) => void;
  setRelations: (relations: UserRelation[]) => void;
  addRelation: (relation: UserRelation) => void;
  removeRelation: (targetId: number, type: string) => void;
  setRadioState: (state: Partial<ChatState['radioState']>) => void;
  setShowLoginModal: (show: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentUser: null,
  users: [],
  messages: [],
  dms: [],
  activeRoom: null,
  activeDmUserId: null,
  relations: [],
  radioState: { isPlaying: false, isMuted: false, track: 'Vibe FM - LoFi Beats' },
  showLoginModal: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setUsers: (users) => set({ users }),
  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
    })),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (message: Message) => set((state) => ({
    messages: state.messages.map(m => m.id === message.id ? message : m)
  })),
  setDms: (dms) => set({ dms }),
  addDm: (dm) => set((state) => ({ dms: [...state.dms, dm] })),
  setActiveRoom: (room) => set({ activeRoom: room }),
  setActiveDmUserId: (userId) => set({ activeDmUserId: userId }),
  setRelations: (relations) => set({ relations }),
  addRelation: (relation) => set((state) => ({ relations: [...state.relations, relation] })),
  removeRelation: (targetId, type) =>
    set((state) => ({
      relations: state.relations.filter(
        (r) => !(r.targetId === targetId && r.type === type)
      ),
    })),
  setRadioState: (newState) =>
    set((state) => ({ radioState: { ...state.radioState, ...newState } })),
  setShowLoginModal: (show) => set({ showLoginModal: show }),
}));
