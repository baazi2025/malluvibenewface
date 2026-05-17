# Vibe Malayali - Chat Platform Features

This repository now contains a fully functional, real-time chat platform built on top of the original landing page design. 

## Features Implemented

### 1. Chat Rooms Setup
- The `TrendingRoomsSection` has been updated to feature exactly two rooms: **Friends Vibing** and **Romance Vibe**.
- Clicking on a room opens the centralized Chat Interface overlay.

### 2. Chatters List Tab
- Real-time list of users currently in the platform.
- Categorized by **Online**, **Idle**, and **Offline**.
- Displays user avatars (initials), usernames, dynamic status indicators, and custom notes.

### 3. Direct Messaging (DM)
- Clicking on any user in the Chatters List opens a floating Direct Message modal.
- Supports real-time 1-on-1 messaging.
- Real-time **typing indicators** implemented.

### 4. Reply Feature
- Hover over any message in the public chat to see the **Reply** button.
- Replying adds a threaded context block above the message input.
- Sent replies display a preview of the original message. Clicking the preview scrolls smoothly back to the original message.

### 5. Live Radio Player
- A persistent floating radio widget at the top right.
- Features **Play/Pause**, **Mute/Unmute**, and an animated track indicator.
- Includes a button to automatically set your current status note to "Listening to [Track Name]".

### 6. User Notes & Status
- Notes are displayed below the user's name in the Chatters List and DM header.
- Status (Online/Idle/Offline) triggers colored rings on avatars.

### 7. Mute / Block System
- Accessible from the top right of a Direct Message modal.
- **Mute**: Hides notifications/messages in public chat for the user locally.
- **Block**: Prevents DMs, hides all their messages, and prevents them from DMing you. Saved to the database.

### 8. Birthday Celebration Mode
- If a user's `birthdate` (e.g. `1990-05-18`) matches today's date:
  - Their name is colored gold in chat and the chatters list.
  - A 🎉 emoji badge is automatically appended to their username.

## Tech Stack
- **Frontend**: React 19, Zustand (State Management), Socket.IO Client, TailwindCSS.
- **Backend**: Node.js, Express, Socket.IO, Prisma ORM, SQLite.

## How to Test

### 1. Start the Backend
Open a terminal in the `backend` folder:
```bash
cd backend
npm install
npm run dev
```

*(Note: The Prisma SQLite database is already initialized and schemas are generated).*

### 2. Start the Frontend
Open a terminal in the `app` folder:
```bash
cd app
npm install
npm run dev
```

### 3. Run the App
Open `http://localhost:5173` in your browser.
1. You will be greeted by the **Login Modal**. Enter a username.
2. Scroll down to **Trending Rooms** and click "Friends Vibing" or "Romance Vibe" to open the chat.
3. Open a **New Incognito Window** to simulate a second user and test DMs, replies, and muting.
