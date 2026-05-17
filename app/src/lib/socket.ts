import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/chatStore';

let socket: Socket | null = null;

export const initSocket = (userId: number) => {
  if (socket) return socket;

  socket = io('https://vibingmalayali.onrender.com');

  socket.on('connect', () => {
    socket?.emit('authenticate', userId);
  });

  socket.on('initial_users', (users) => {
    useChatStore.getState().setUsers(users);
  });

  socket.on('user_status_change', ({ userId, status }) => {
    useChatStore.getState().updateUser(userId, { status });
  });

  socket.on('user_note_change', ({ userId, note }) => {
    useChatStore.getState().updateUser(userId, { note });
  });

  socket.on('user_birthdate_change', ({ userId, birthdate }) => {
    useChatStore.getState().updateUser(userId, { birthdate });
  });

  socket.on('room_history', ({ room, messages }) => {
    if (useChatStore.getState().activeRoom === room) {
      useChatStore.getState().setMessages(messages);
    }
  });

  socket.on('new_message', (msg) => {
    if (useChatStore.getState().activeRoom === msg.roomId) {
      useChatStore.getState().addMessage(msg);
    }
  });

  socket.on('dm_history', ({ withUserId, dms }) => {
    if (useChatStore.getState().activeDmUserId === withUserId) {
      useChatStore.getState().setDms(dms);
    }
  });

  socket.on('new_dm', (dm) => {
    useChatStore.getState().addDm(dm);
  });

  socket.on('relation_updated', () => {
    // Basic reload of relations
    fetch(`https://vibingmalayali.onrender.com/api/users/${userId}/relations`)
      .then((res) => res.json())
      .then((data) => useChatStore.getState().setRelations(data));
  });

  return socket;
};

export const getSocket = () => socket;
