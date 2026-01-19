# PPL (Pongal Premiere League) Auction Web Application

A web-based platform to manage and conduct live-style cricket auctions for the Pongal Premiere League (PPL). Supports dynamic bidding, team budget management, player selection, and provides a professional, animated, and institutional user interface with centralized data storage in MongoDB and player images from Google Drive.

## Features

- ✅ **Real-time Bidding**: Socket.io powered instant updates
- ✅ **Live Auction Dashboard**: Real-time player display and bid tracking
- ✅ **Admin Controls**: Full auction management interface
- ✅ **Team Management**: 6 teams with budget tracking
- ✅ **Player Management**: 112 players with Google Drive images
- ✅ **Round Management**: Round-based auction with summaries
- ✅ **Authentication**: Secure admin login
- ✅ **Professional UI**: Institutional maroon/burgundy theme

## Technology Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Socket.io Client
- Radix UI Components

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- Socket.io
- Google Drive API
- JWT Authentication

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database
- Google Drive folder with player images
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd PPL-Auction
```

2. **Backend Setup**
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

3. **Frontend Setup**
```bash
cd Frontend
pnpm install
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
pnpm dev
```

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
DRIVE_FOLDER_ID=your-google-drive-folder-id
ALLOWED_ORIGINS=http://localhost:3000,https://your-production-domain.com
NODE_ENV=development
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions using GitHub Actions.

### GitHub Actions Workflows

The repository includes three GitHub Actions workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on push and pull requests
   - Tests backend and frontend builds

2. **Backend Deployment** (`.github/workflows/deploy-backend.yml`)
   - Deploys backend to Render/Railway
   - Runs on changes to `Backend/**`

3. **Frontend Deployment** (`.github/workflows/deploy-frontend.yml`)
   - Deploys frontend to Vercel/Netlify
   - Runs on changes to `Frontend/**`

### CORS Configuration

The backend CORS is configured for production. Set `ALLOWED_ORIGINS` environment variable:

```env
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app
```

In development, all origins are allowed by default.

## Project Structure

```
PPL-Auction/
├── Backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Google Drive service
│   ├── lib/             # Socket.io utilities
│   └── server.js        # Express server
├── Frontend/
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks (useSocket)
│   ├── lib/             # API client
│   └── public/          # Static assets
└── .github/workflows/   # GitHub Actions
```

## API Endpoints

All endpoints under `/api/auction/`:

- `GET /state` - Get current auction state
- `POST /initialize` - Reset auction
- `POST /next-player` - Draw next random player
- `POST /select-player` - Select specific player
- `POST /bid` - Place bid
- `POST /sell` - Sell current player
- `POST /unsold` - Mark player as unsold
- `GET /unsold-players` - Get unsold players
- `POST /next-round` - Increment round
- `POST /stop-auction` - Stop auction
- `GET /round-summary` - Get round statistics

## License

Private project - All rights reserved
