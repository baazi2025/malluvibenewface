const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Simple Game Prompts Data
const GAMES_DATA = {
  'truth_or_dare': ['Truth: What is your biggest secret?', 'Dare: Send a voice note singing a Malayalam song', 'Truth: Who was your first crush?', 'Dare: Change your status to something embarrassing for 10 mins'],
  'would_you_rather': ['Would you rather eat only Biryani for a month or never eat Biryani again?', 'Would you rather have a flying car or a teleportation device?'],
  'movie_guess': ['Guess the movie: 👦🏻⛵🐅🌊 (Life of Pi)', 'Guess the movie: 👨🏻‍🦱🕶️🦯🎸 (Andhadhun)', 'Guess the movie: 🧔🏻‍♂️🔫🐕💀 (John Wick)'],
};

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const ROOMS = ['Friends Vibing', 'Romance Vibe'];

// API ENDPOINTS
app.post('/api/login', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  let user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    user = await prisma.user.create({ data: { username } });
  }
  res.json(user);
});

app.get('/api/users/:userId/relations', async (req, res) => {
  const { userId } = req.params;
  const relations = await prisma.userRelation.findMany({
    where: { userId: Number(userId) },
    include: { target: true }
  });
  res.json(relations);
});

// SOCKET EVENTS
io.on('connection', (socket) => {
  let currentUser = null;

  socket.on('authenticate', async (userId) => {
    try {
      currentUser = await prisma.user.update({
        where: { id: userId },
        data: { status: 'online', socketId: socket.id }
      });
      socket.broadcast.emit('user_status_change', { userId, status: 'online' });
      // Send initial data to client
      const allUsers = await prisma.user.findMany();
      socket.emit('initial_users', allUsers);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('join_room', async (room) => {
    if (!ROOMS.includes(room)) return;
    socket.join(room);
    
    // Fetch recent messages
    const messages = await prisma.message.findMany({
      where: { roomId: room },
      include: { sender: true, replyTo: { include: { sender: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    socket.emit('room_history', { room, messages: messages.reverse() });
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
  });

  socket.on('send_message', async (data) => {
    if (!currentUser) return;
    const { room, content, replyToId, isGame, isAnonymous, pollData } = data;
    try {
      let msg = await prisma.message.create({
        data: {
          content,
          roomId: room,
          senderId: currentUser.id,
          replyToId: replyToId || null,
          isAnonymous: isAnonymous || false,
          pollData: pollData ? JSON.stringify(pollData) : null
        },
        include: { sender: true, replyTo: { include: { sender: true } } }
      });
      
      // Mask sender if anonymous
      if (msg.isAnonymous) {
        msg.sender = { ...msg.sender, username: 'Anonymous Ghost 👻', avatar: '' };
      }

      // Attach game flag dynamically (not saved in DB for simplicity, just passed to clients)
      io.to(room).emit('new_message', { ...msg, isGame: !!isGame });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('vote_poll', async (data) => {
    if (!currentUser) return;
    const { messageId, optionIndex } = data;
    try {
      const msg = await prisma.message.findUnique({ where: { id: messageId }});
      if (msg && msg.pollData) {
        let poll = JSON.parse(msg.pollData);
        if (!poll.votedUsers) poll.votedUsers = [];
        
        // Prevent double voting
        if (poll.votedUsers.includes(currentUser.id)) return;
        
        poll.options[optionIndex].votes += 1;
        poll.votedUsers.push(currentUser.id);

        const updatedMsg = await prisma.message.update({
          where: { id: messageId },
          data: { pollData: JSON.stringify(poll) },
          include: { sender: true, replyTo: { include: { sender: true } } }
        });

        if (updatedMsg.isAnonymous) {
          updatedMsg.sender = { ...updatedMsg.sender, username: 'Anonymous Ghost 👻', avatar: '' };
        }

        io.to(msg.roomId).emit('message_updated', updatedMsg);
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('start_game', async (data) => {
    if (!currentUser) return;
    const { room, gameType } = data;
    
    let content = `🎮 Started a game of ${gameType.replace(/_/g, ' ').toUpperCase()}!`;
    if (GAMES_DATA[gameType]) {
      const prompts = GAMES_DATA[gameType];
      content += `\n\nPrompt: ${prompts[Math.floor(Math.random() * prompts.length)]}`;
    }

    try {
      const msg = await prisma.message.create({
        data: {
          content,
          roomId: room,
          senderId: currentUser.id,
        },
        include: { sender: true }
      });
      io.to(room).emit('new_message', { ...msg, isGame: true, gameType });
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('award_points', async (data) => {
    if (!currentUser) return;
    const { points } = data;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: { points: { increment: points } }
      });
      io.emit('user_update', { userId: currentUser.id, points: updatedUser.points });
    } catch(e) {}
  });

  socket.on('send_reaction', (data) => {
    // data: { room: 'Friends Vibing', emoji: '🔥' }
    if (!currentUser) return;
    io.to(data.room).emit('receive_reaction', { userId: currentUser.id, emoji: data.emoji });
  });

  socket.on('update_note', async (note) => {
    if (!currentUser) return;
    try {
      await prisma.user.update({ where: { id: currentUser.id }, data: { note } });
      io.emit('user_note_change', { userId: currentUser.id, note });
    } catch (e) { }
  });

  socket.on('update_status', async (status) => {
    if (!currentUser) return;
    try {
      await prisma.user.update({ where: { id: currentUser.id }, data: { status } });
      io.emit('user_status_change', { userId: currentUser.id, status });
    } catch (e) { }
  });

  // DMs
  socket.on('send_dm', async (data) => {
    if (!currentUser) return;
    const { receiverId, content } = data;
    try {
      // Check block status
      const blocked = await prisma.userRelation.findFirst({
        where: { userId: receiverId, targetId: currentUser.id, type: 'BLOCK' }
      });
      if (blocked) {
        return socket.emit('dm_error', { error: 'You are blocked by this user.' });
      }

      const dm = await prisma.directMessage.create({
        data: { content, senderId: currentUser.id, receiverId },
        include: { sender: true, receiver: true }
      });

      // Send to receiver if online
      const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
      if (receiver && receiver.socketId) {
        io.to(receiver.socketId).emit('new_dm', dm);
      }
      // Send back to sender
      socket.emit('new_dm', dm);
    } catch (e) { console.error(e); }
  });

  socket.on('typing_dm', async (data) => {
    if (!currentUser) return;
    const { receiverId, isTyping } = data;
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit('dm_typing_status', { senderId: currentUser.id, isTyping });
    }
  });

  socket.on('fetch_dms', async (withUserId) => {
    if (!currentUser) return;
    const dms = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: withUserId },
          { senderId: withUserId, receiverId: currentUser.id }
        ]
      },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: 'asc' }
    });
    socket.emit('dm_history', { withUserId, dms });
  });

  socket.on('update_relation', async (data) => {
    if (!currentUser) return;
    const { targetId, type, action } = data; // type: MUTE/BLOCK, action: add/remove
    try {
      if (action === 'add') {
        await prisma.userRelation.upsert({
          where: { userId_targetId_type: { userId: currentUser.id, targetId, type } },
          update: {},
          create: { userId: currentUser.id, targetId, type }
        });
      } else {
        await prisma.userRelation.deleteMany({
          where: { userId: currentUser.id, targetId, type }
        });
      }
      socket.emit('relation_updated', { targetId, type, action });
    } catch (e) { }
  });

  socket.on('update_birthdate', async (birthdate) => {
    if (!currentUser) return;
    try {
      await prisma.user.update({ where: { id: currentUser.id }, data: { birthdate } });
      io.emit('user_birthdate_change', { userId: currentUser.id, birthdate });
    } catch (e) { }
  });

  socket.on('disconnect', async () => {
    if (currentUser) {
      try {
        await prisma.user.update({
          where: { id: currentUser.id },
          data: { status: 'offline', socketId: null }
        });
        io.emit('user_status_change', { userId: currentUser.id, status: 'offline' });
      } catch (e) { }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
