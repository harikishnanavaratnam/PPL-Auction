# Deployment Guide

This document provides instructions for deploying the PPL Auction application using GitHub Actions.

## GitHub Secrets Configuration

### Backend Secrets

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

1. **MONGODB_URI** - MongoDB connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```

2. **ADMIN_PASSWORD** - Admin login password

3. **JWT_SECRET** - Secret key for JWT tokens

4. **DRIVE_FOLDER_ID** - Google Drive folder ID for player images

5. **ALLOWED_ORIGINS** - Comma-separated list of allowed frontend URLs
   ```
   https://your-frontend.vercel.app,https://your-frontend.netlify.app
   ```

6. **PORT** - Backend port (default: 5000)

### Deployment Platform Secrets (Choose one)

#### For Render Deployment:
- **RENDER_SERVICE_ID** - Your Render service ID
- **RENDER_API_KEY** - Your Render API key

#### For Railway Deployment:
- **RAILWAY_TOKEN** - Railway authentication token
- **RAILWAY_PROJECT_ID** - Railway project ID

### Frontend Secrets

1. **NEXT_PUBLIC_API_URL** - Backend API URL
   ```
   https://your-backend.onrender.com/api
   ```

2. **NEXT_PUBLIC_SOCKET_URL** - Socket.io server URL
   ```
   https://your-backend.onrender.com
   ```

### Deployment Platform Secrets (Choose one)

#### For Vercel Deployment:
- **VERCEL_TOKEN** - Vercel authentication token
- **VERCEL_ORG_ID** - Vercel organization ID
- **VERCEL_PROJECT_ID** - Vercel project ID

#### For Netlify Deployment:
- **NETLIFY_AUTH_TOKEN** - Netlify authentication token
- **NETLIFY_SITE_ID** - Netlify site ID

## Deployment Platforms

### Backend Deployment Options

#### Option 1: Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd Backend && npm install`
4. Set start command: `cd Backend && npm start`
5. Add environment variables in Render dashboard
6. Copy Service ID and API Key to GitHub secrets

#### Option 2: Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Get Railway token and project ID from settings
5. Add to GitHub secrets

#### Option 3: Heroku
1. Create a Heroku app
2. Install Heroku CLI
3. Add Heroku remote: `heroku git:remote -a your-app-name`
4. Update workflow to use Heroku deployment

### Frontend Deployment Options

#### Option 1: Vercel (Recommended for Next.js)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Link project: `vercel link`
4. Get project ID from `.vercel/project.json`
5. Get org ID: `vercel teams ls`
6. Get token from Vercel dashboard → Settings → Tokens

#### Option 2: Netlify
1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set build command: `cd Frontend && pnpm build`
4. Set publish directory: `Frontend/.next`
5. Get site ID and auth token from Netlify dashboard

## CORS Configuration

The backend CORS is configured to allow specific origins. Update `ALLOWED_ORIGINS` in your deployment:

```env
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app,http://localhost:3000
```

For development, localhost is automatically allowed.

## Manual Deployment Steps

If you prefer manual deployment:

### Backend
```bash
cd Backend
npm install
# Set environment variables
export MONGODB_URI="your-connection-string"
export ALLOWED_ORIGINS="https://your-frontend.com"
npm start
```

### Frontend
```bash
cd Frontend
pnpm install
# Create .env.local
echo "NEXT_PUBLIC_API_URL=https://your-backend.com/api" > .env.local
echo "NEXT_PUBLIC_SOCKET_URL=https://your-backend.com" >> .env.local
pnpm build
pnpm start
```

## Environment Variables Reference

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
DRIVE_FOLDER_ID=your-google-drive-folder-id
ALLOWED_ORIGINS=https://your-frontend.com,https://another-frontend.com
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.com
```

## Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check that URLs don't have trailing slashes
- Verify backend is accessible from frontend domain

### Socket.io Connection Issues
- Ensure `NEXT_PUBLIC_SOCKET_URL` matches your backend URL
- Check that Socket.io is enabled on your backend deployment
- Verify CORS allows WebSocket connections

### Build Failures
- Check Node.js version (requires 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

## GitHub Actions Workflow

The workflows are configured to:
- Deploy backend on changes to `Backend/**`
- Deploy frontend on changes to `Frontend/**`
- Run CI checks on push and pull requests
- Support manual deployment via `workflow_dispatch`

## Post-Deployment Checklist

- [ ] Backend is accessible at configured URL
- [ ] Frontend can connect to backend API
- [ ] Socket.io connections work
- [ ] CORS allows frontend domain
- [ ] Admin login works
- [ ] Player images load from Google Drive
- [ ] All API endpoints respond correctly
