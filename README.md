# MeetNow

MeetNow is a full-stack video meeting application built with React, Node.js, Express, MongoDB, Socket.IO, and WebRTC. It lets users register, log in, join meetings with a code, chat in real time, share their screen, and review their meeting history.

## Features

- User registration and login
- Protected home page for authenticated users
- Join meetings using a meeting code
- Guest-friendly room access through direct room URLs
- Real-time audio/video communication with WebRTC
- In-meeting chat powered by Socket.IO
- Screen sharing support
- Meeting history stored in MongoDB

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Material UI
- Socket.IO Client

**Backend**

- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- bcrypt

**Infrastructure**

- Docker
- Docker Compose

## Project Structure

```text
MeetNow/
├── MeetNow-frontend/    # React + Vite client
├── MeetNow-backend/     # Express + Socket.IO API
├── docker-compose.yml
└── README.md
```

## How It Works

1. Users register or log in from the frontend.
2. The backend stores user records and generates a token on login.
3. Authenticated users can join a room from the home screen using a meeting code.
4. Guests can also enter a room directly through a room URL.
5. Socket.IO handles room signaling and chat events.
6. WebRTC handles peer-to-peer media streaming between participants.
7. Joined meeting codes are saved in MongoDB and shown in the history page.

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm
- MongoDB Atlas or a local MongoDB instance

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd MeetNow
```

### 2. Install dependencies

```bash
cd MeetNow-backend
npm install
```

```bash
cd ../MeetNow-frontend
npm install
```

### 3. Configure the backend

Create a `.env` file inside `MeetNow-backend`:

```env
PORT=8000
MONGODB_URI=<your-mongodb-uri>
```

Important note:
The current backend source still contains a hardcoded MongoDB connection in `MeetNow-backend/src/app.js`. Replace that value with your own URI before running the project outside a trusted local setup.

### 4. Configure the frontend API target

Open `MeetNow-frontend/src/environment.js` and switch the app to local mode for full local development:

```js
let IS_PROD = false;
```

That makes the frontend use:

```text
http://localhost:8000
```

### 5. Run the backend

```bash
cd MeetNow-backend
npm run dev
```

### 6. Run the frontend

```bash
cd MeetNow-frontend
npm run dev
```

### 7. Open the app

Visit:

```text
http://localhost:5173
```

## Running with Docker

Build and start all services:

```bash
docker compose up --build
```

Docker services included:

- `frontend`
- `backend`
- `mongo`

Docker note:
The backend application listens on port `8000`, but the committed `docker-compose.yml` maps `5000:5000`. If you want to access the backend from the host machine, update that mapping to `8000:8000`.

## API Endpoints

Base URL:

```text
/api/v1/users
```

Available routes:

- `POST /register` - create a new user
- `POST /login` - authenticate and receive a token
- `POST /add_to_activity` - save a meeting code to user history
- `GET /get_all_activity` - fetch meeting history using the stored token

## Key Frontend Routes

- `/` - landing page
- `/auth` - login and registration
- `/home` - authenticated meeting entry page
- `/history` - meeting history
- `/:url` - video meeting room

## Current Limitations

- Authentication uses a custom token flow instead of JWT or session-based auth.
- The frontend environment switch is hardcoded in `src/environment.js`.
- No TURN server is configured, so connectivity may be limited on stricter networks.
- Backend configuration is only partially environment-driven in the current source.

## Future Improvements

- Move all secrets and connection settings fully into environment variables
- Add JWT-based authentication and route protection on the backend
- Add meeting creation instead of relying only on manual room codes
- Add participant names, invite links, and better room management
- Add tests and CI

## License

No license is currently specified in this repository.
