#SEbutkinda

A self-hosted, open-source Twitch stream overlay toolkit — alerts, chatbot commands, loyalty points, and OBS overlays without any third-party dependency.

---

## What's Inside

| Package | Purpose |
|---------|---------|
| `backend/` | Node.js/Express API + Socket.io server |
| `frontend/` | React dashboard (alerts, chatbot, overlays, loyalty) |
| `overlay/` | Transparent React app — runs in OBS as a Browser Source |

---

## Features

- **Twitch OAuth** — one-click login, tokens stored securely and auto-refreshed
- **Alerts** — per-event GIF, sound, animated message for follows, subs, raids, cheers, gift subs
- **Chatbot** — `!command` system with cooldowns, permission levels, and use-count tracking
- **Loyalty Points** — passive points per minute watched, viewer leaderboard
- **Overlay Builder** — drag-and-drop widget canvas (chat, event list, goal bar, now-playing)
- **OBS Browser Source** — transparent 1920×1080 overlay served to your streaming software
- **Real-time** — WebSocket delivery so alerts fire instantly without polling

---

## Tech Stack

**Backend**
- [Express 5](https://expressjs.com/) — HTTP server
- [Prisma 7](https://www.prisma.io/) — ORM + PostgreSQL
- [Socket.io 4](https://socket.io/) — WebSocket for real-time alerts
- [@twurple](https://twurple.js.org/) — Twitch API + EventSub (follows, subs, raids, cheers)
- `jsonwebtoken` + `bcrypt` for session auth
- `express-rate-limit` + `helmet` for baseline hardening

**Frontend & Overlay**
- [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) — alert animations
- [Howler.js](https://howlerjs.com/) — audio playback
- [Socket.io-client](https://socket.io/)

---

## Prerequisites

- Node.js ≥ 20
- PostgreSQL database (local or hosted — [Neon](https://neon.tech/) free tier works great)
- A [Twitch Developer Application](https://dev.twitch.tv/console/apps)

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USER/streamelementsbutkinda.git
cd streamelementsbutkinda

cd backend  && npm install
cd ../frontend && npm install
cd ../overlay  && npm install
```

### 2. Create Twitch app

1. Go to [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) → **Register Your Application**
2. Set **OAuth Redirect URL** to `http://localhost:3001/auth/callback`
3. Copy your **Client ID** and **Client Secret**

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sebutkinda"

# Twitch OAuth
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_REDIRECT_URI=http://localhost:3001/auth/callback

# Security — use a long random string
JWT_SECRET=replace_me_with_something_long_and_random
TWITCH_WEBHOOK_SECRET=another_long_random_string

# URLs
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 4. Set up the database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run everything

Open three terminals:

```bash
# Terminal 1 — backend
cd backend
node index.js
# or with auto-reload:
npx nodemon index.js

# Terminal 2 — dashboard
cd frontend
npm run dev

# Terminal 3 — overlay (OBS browser source)
cd overlay
npm run dev
```

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:5173 |
| OBS Browser Source | http://localhost:5174/overlay?token=YOUR_TOKEN |
| API | http://localhost:3001 |

---

## Setting Up OBS

1. Log into the dashboard at http://localhost:5173
2. Copy the **Overlay URL** from the dashboard home page
3. In OBS: **+** → **Browser Source**
   - **URL**: paste your overlay URL
   - **Width**: `1920`
   - **Height**: `1080`
   - ✅ **Shutdown source when not visible**
   - ✅ **Refresh browser when scene becomes active**
   - Under **Custom CSS**: add `body { background: transparent !important; }`

Your alerts will now fire live inside your stream scene.

---

## Project Structure

```
streamelementsbutkinda/
├── backend/
│   ├── index.js                 # Express + Socket.io bootstrap
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js          # Twitch OAuth + /me
│   │   │   ├── alerts.js        # CRUD alert configs
│   │   │   ├── commands.js      # CRUD chatbot commands
│   │   │   ├── overlays.js      # Overlay config + token regen
│   │   │   ├── loyalty.js       # Points config + leaderboard
│   │   │   └── webhooks.js      # Twitch EventSub webhooks
│   │   ├── services/
│   │   │   ├── AlertService.js  # Dispatch alerts via Socket.io
│   │   │   ├── BotService.js    # tmi.js chat client
│   │   │   ├── CommandHandler.js# !command parsing + cooldowns
│   │   │   ├── PointsService.js # Loyalty points tick
│   │   │   └── TwitchService.js # EventSub subscriptions
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT cookie auth
│   │   │   ├── errorHandler.js  # Centralised error middleware
│   │   │   ├── rateLimit.js     # Per-route rate limiters
│   │   │   └── validate.js      # express-validator rules
│   │   ├── utils/
│   │   │   ├── crypto.js        # HMAC verification + UUID
│   │   │   └── sanitize.js      # HTML-encode user content
│   │   └── ws/
│   │       ├── SocketManager.js # Socket.io room management
│   │       └── EventBus.js      # Internal event emitter
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Route layout
│   │   ├── main.jsx
│   │   ├── index.css            # Global styles + .input class
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Overview + overlay URL copy
│   │   │   ├── Alerts.jsx       # Per-event alert config
│   │   │   ├── Chatbot.jsx      # Command management
│   │   │   ├── Overlays.jsx     # Widget canvas
│   │   │   ├── Loyalty.jsx      # Points config + leaderboard
│   │   │   ├── Login.jsx        # Twitch OAuth entry
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── NavSidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AlertCard.jsx
│   │   │   ├── CommandRow.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── WidgetCanvas.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── toast.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js       # Auth context + logout
│   │   │   ├── useApi.js        # Axios wrapper with error handling
│   │   │   └── useSocket.js     # Socket.io hook
│   │   └── utils/
│   │       ├── api.js           # Axios instance + 401 redirect
│   │       ├── constants.js     # Event types, animations, etc.
│   │       └── validators.js    # Client-side form validation
│   ├── tailwind.config.js
│   └── package.json
│
└── overlay/
    ├── src/
    │   ├── App.jsx              # Alert queue + Socket.io consumer
    │   ├── main.jsx
    │   └── index.css            # Transparent canvas + animations
    └── package.json
```

---

## Environment Variables Reference

### Backend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `TWITCH_CLIENT_ID` | ✅ | From your Twitch Developer App |
| `TWITCH_CLIENT_SECRET` | ✅ | From your Twitch Developer App |
| `TWITCH_REDIRECT_URI` | ✅ | Must match Twitch dashboard exactly |
| `JWT_SECRET` | ✅ | Random string ≥ 32 chars |
| `TWITCH_WEBHOOK_SECRET` | ✅ | For EventSub HMAC verification |
| `FRONTEND_URL` | ✅ | Origin for CORS + redirects |
| `PORT` | — | Default: `3001` |

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3001
```

### Overlay (`.env`)

```env
VITE_API_URL=http://localhost:3001
```

---

## Alert Configuration

In the dashboard under **Alerts**, you can configure each Twitch event:

| Field | Description |
|-------|-------------|
| **GIF URL** | Direct URL to a `.gif` that plays during the alert |
| **Sound URL** | Direct URL to an `.mp3` / `.ogg` |
| **Message** | Supports `{user_name}`, `{viewers}`, `{bits}`, `{tier}`, `{amount}` |
| **Animation In/Out** | `fadeIn`, `slideIn`, `bounceIn`, `zoomIn` (and Out variants) |
| **Duration** | How long the alert stays on screen (ms, 1000–30000) |
| **Volume** | Sound volume 0.0–1.0 |

---

## Chatbot Commands

Commands use the format `!trigger`. Available placeholders in responses:

- `{user}` — the chatter's display name
- `{args}` — everything after the trigger word

Permission levels: `everyone` → `subscriber` → `moderator` → `broadcaster`

---

## Loyalty Points

- Points are awarded once per minute to any viewer tracked via Twitch EventSub
- Adjust the currency name and points-per-minute rate on the Loyalty page
- The leaderboard shows the top 50 viewers by current balance

---

## API Routes

All authenticated routes require an `httpOnly` cookie set during OAuth.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/auth/twitch` | — | Redirect to Twitch OAuth |
| GET | `/auth/callback` | — | OAuth callback |
| POST | `/auth/logout` | — | Clear session cookie |
| GET | `/auth/me` | ✅ | Current user profile |
| GET | `/api/alerts` | ✅ | List alert configs |
| POST | `/api/alerts` | ✅ | Create/update alert |
| PUT | `/api/alerts/:id` | ✅ | Update alert |
| DELETE | `/api/alerts/:id` | ✅ | Delete alert |
| GET | `/api/commands` | ✅ | List commands |
| POST | `/api/commands` | ✅ | Create command |
| PUT | `/api/commands/:id` | ✅ | Update command |
| DELETE | `/api/commands/:id` | ✅ | Delete command |
| GET | `/api/overlays/config` | ✅ | Get overlay widget layout |
| PUT | `/api/overlays/config` | ✅ | Save widget layout |
| GET | `/api/overlays/config/:token` | — | Public — used by overlay app |
| POST | `/api/overlays/regenerate-token` | ✅ | Rotate overlay token |
| GET | `/api/loyalty/config` | ✅ | Get loyalty settings |
| PUT | `/api/loyalty/config` | ✅ | Update loyalty settings |
| GET | `/api/loyalty/leaderboard` | ✅ | Top 50 viewers |
| POST | `/webhooks/twitch` | — | Twitch EventSub webhook |

---

## Security Notes

- All user-generated text is HTML-escaped before storage and emission
- Twitch webhook payloads are verified via HMAC-SHA256
- Replay attacks blocked by 10-minute timestamp window on webhooks
- Rate limiting: 10 req/min on auth, 100 req/min on API, 300 req/min on webhooks
- JWT stored in `httpOnly; SameSite=Lax` cookie — not accessible to JavaScript
- Alert deduplication prevents double-firing within 2-second windows
- Command cooldowns tracked server-side

---

## Deployment

### Database

Any managed PostgreSQL works. Recommended:
- [Neon](https://neon.tech/) — serverless, generous free tier
- [Supabase](https://supabase.com/) — free tier, built-in UI
- [Railway](https://railway.app/) — simple one-click PostgreSQL

### Backend

The backend is a standard Node.js HTTP server. Deploy to any VPS or PaaS:

```bash
# Production start
NODE_ENV=production node index.js
```

Recommended: [Railway](https://railway.app/), [Render](https://render.com/), or a VPS with PM2.

### Frontend / Overlay

Both are static Vite builds:

```bash
cd frontend && npm run build   # → frontend/dist/
cd overlay  && npm run build   # → overlay/dist/
```

Serve with any static host ([Vercel](https://vercel.com/), [Netlify](https://netlify.com/), Nginx, etc.).

> **Note**: Update `TWITCH_REDIRECT_URI` in your Twitch app and `.env` when moving to production URLs.

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes
4. Push and open a PR

---
