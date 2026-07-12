# MeetNow

MeetNow is a full-stack real-time room chat application built with React, Vite, Express, and Socket.IO. Users join a room by URL, enter a display name, and chat instantly with everyone connected to that room.

## What This Project Currently Does

- Join a chat room based on the current route, such as `/team-room`
- Enter a username before connecting
- Send and receive live messages with Socket.IO
- Show typing indicators for other participants
- Keep in-memory room message history while the server is running
- Support multiple rooms at the same time

## Tech Stack

### Frontend

- React 19
- Vite
- Material UI
- Socket.IO Client
- Tailwind CSS

### Backend

- Node.js
- Express
- Socket.IO

## Project Structure

```text
MeetNow (Copy)/
├── MeetNow-frontend/   # React client
├── MeetNow-backend/    # Express + Socket.IO server
├── docker-compose.yml
└── README.md
```

## How It Works

1. The frontend reads the current browser path and treats it as the room ID.
2. A user enters a name and joins that room through Socket.IO.
3. The backend stores active socket connections by room in memory.
4. Messages are broadcast to everyone in the same room.
5. Typing and disconnect events are also shared with the room.

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm

### 1. Install dependencies

```bash
cd MeetNow-backend
npm install
```

```bash
cd ../MeetNow-frontend
npm install
```

### 2. Start the backend

```bash
cd MeetNow-backend
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

### 3. Start the frontend

```bash
cd MeetNow-frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

### 4. Open a room

Visit any route in the browser, for example:

```text
http://localhost:5173/general
```

Open the same URL in another tab or browser window to test real-time chat.

## Environment Behavior

The frontend server URL is defined in [MeetNow-frontend/src/environment.js](/home/altaf/Downloads/Mern_projects/MeetNow%20%28Copy%29/MeetNow-frontend/src/environment.js).

- In development, it connects to `http://localhost:8000`
- In production builds, it connects to `https://apnacollegebackend.onrender.com`

## Docker

You can also run the project with Docker:

```bash
docker compose up --build
```

### Current Docker Notes

- The frontend container is configured for Vite on port `5173`
- The backend application listens on port `8000`
- The committed `docker-compose.yml` maps backend port `5000:5000`, which does not match the server's actual port

If you want Docker access to the backend from your host machine, update the backend port mapping in [docker-compose.yml](/home/altaf/Downloads/Mern_projects/MeetNow%20%28Copy%29/docker-compose.yml) to:

```yaml
ports:
  - "8000:8000"
```

## Socket Events

The backend currently handles these Socket.IO events:

- `join-call`
- `chat-message`
- `typing`
- `stop-typing`
- `signal`
- `disconnect`

## Current Limitations

- This repo currently implements chat, not full video calling in the active frontend
- Room data and messages are stored only in server memory
- Messages are lost when the backend restarts
- There is no authentication or database persistence in the current app flow
- The backend includes a `signal` event, but the current frontend does not implement WebRTC media calling

## Possible Improvements

- Add persistent message storage with MongoDB
- Add room creation and invite sharing
- Add authentication and user sessions
- Connect the existing signaling flow to a real audio/video meeting UI
- Fix Docker backend port mapping
- Add tests for frontend and backend behavior

## License

No license is currently specified in this repository.
