# Deployment Guide - PPL Auction

Complete step-by-step guide for deploying both Frontend and Backend.

## 📋 Prerequisites

- GitHub repository with your code pushed
- MongoDB Atlas account (or MongoDB database)
- Google Drive API credentials (for player images)
- Railway account (for backend) - Sign up at [railway.app](https://railway.app)
- Vercel account (for frontend - recommended) or Netlify

---

## 🔧 Backend Deployment (Railway)

### Step 1: Prepare Backend

1. **Ensure your code is pushed to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app)
2. Sign up/Login (you can use GitHub to sign in)
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository
6. Railway will auto-detect it's a Node.js project

### Step 3: Configure Service Settings

1. Click on your service
2. Go to **Settings** tab
3. Configure:

   **Service Settings:**
   - **Root Directory**: `Backend`
   - **Build Command**: Leave empty (Railway auto-detects `npm install`)
   - **Start Command**: `npm start`
   - **Watch Paths**: `Backend/**` (optional)

### Step 4: Environment Variables (Backend)

Add these in Railway Dashboard → Your Service → Variables tab:

```env
MONGODB_URI=mongodb+srv://hari27nr_db_user:sg80QxOvVF7qOdMs@auctionppl.xbxexjg.mongodb.net/?appName=AuctionPPL
ADMIN_PASSWORD=your_secure_admin_password_here
JWT_SECRET=your_jwt_secret_key_here
DRIVE_FOLDER_ID=1OOrnD9Vhsu6aRUvYZ4bfSUOz9WooBSgm
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.netlify.app
```

**Important Notes:**
- Replace `ADMIN_PASSWORD` with a strong password
- Replace `JWT_SECRET` with a random secure string (e.g., generate with `openssl rand -base64 32`)
- Replace `ALLOWED_ORIGINS` with your actual frontend URL(s) after deployment
- `PORT` is optional - Railway sets this automatically via `PORT` environment variable
- Railway automatically provides a `PORT` variable - your code should use `process.env.PORT || 5000`

### Step 5: Generate Public URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** to get a public URL
3. Your backend URL will be: `https://your-service-name.up.railway.app` (or custom domain)

### Step 6: Google Drive Service Account

If you need Google Drive access:

1. Upload `service_account.json` content as environment variables, OR
2. Add individual Google credentials as environment variables
3. Make sure the service account has access to the Drive folder

### Step 7: Deploy

1. Railway automatically deploys when you:
   - Push to the connected branch (usually `main`)
   - Or manually trigger from the dashboard
2. Railway will:
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)
3. Wait for deployment to complete (usually 1-3 minutes)
4. Check the **Deployments** tab for build logs

### Step 8: Test Backend

Visit: `https://your-service-name.up.railway.app/`

You should see: `PPL Auction API is running`

---

## 🎨 Frontend Deployment (Vercel - Recommended)

### Step 1: Prepare Frontend

1. **Ensure your code is pushed to GitHub**

### Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

   **Project Settings:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 3: Environment Variables (Frontend)

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-service-name.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-service-name.up.railway.app
```

**Important:**
- Replace `your-service-name.up.railway.app` with your actual Railway backend URL
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Add these for **Production**, **Preview**, and **Development** environments

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build your Next.js app
   - Deploy to production
3. Your frontend URL will be: `https://your-project-name.vercel.app`

### Step 5: Update Backend CORS

After getting your frontend URL, update the backend environment variable:

1. Go back to Railway Dashboard → Your Service → Variables
2. Edit `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-project-name.vercel.app,http://localhost:3000
   ```
3. Railway will automatically redeploy when you save

---

## 🔄 Alternative: Frontend on Netlify

### Step 1: Create Netlify Site

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository

### Step 2: Configure Build Settings

```
Base directory: Frontend
Build command: npm run build
Publish directory: Frontend/.next
```

**Note:** For Next.js on Netlify, you may need to use `@netlify/plugin-nextjs` or configure differently.

### Step 3: Environment Variables

Add the same environment variables as Vercel:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] Backend URL is accessible
- [ ] MongoDB connection is working (check Railway logs)
- [ ] API endpoints respond correctly
- [ ] Socket.io is working
- [ ] CORS is configured with frontend URL

### Frontend
- [ ] Frontend is accessible
- [ ] Can connect to backend API
- [ ] Socket.io connection works
- [ ] All pages load correctly
- [ ] Admin login works

### Testing
- [ ] Visit frontend URL
- [ ] Check browser console for errors
- [ ] Test live auction page
- [ ] Test admin login
- [ ] Verify real-time updates work

---

## 🔍 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas allows connections from Railway IPs (0.0.0.0/0)

**Port Issues:**
- Railway sets PORT automatically - don't hardcode it
- Use `process.env.PORT || 5000`
- Railway provides PORT as an environment variable

**CORS Errors:**
- Update `ALLOWED_ORIGINS` with exact frontend URL
- Include protocol (`https://`)
- No trailing slashes

### Frontend Issues

**API Connection Failed:**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running
- Check CORS settings

**Socket.io Connection Failed:**
- Check `NEXT_PUBLIC_SOCKET_URL` is correct
- Verify Socket.io server is running
- Check browser console for errors

**Build Errors:**
- Check Node.js version (Vercel auto-detects)
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

---

## 🔐 Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong passwords** for `ADMIN_PASSWORD`
3. **Generate secure JWT_SECRET** - Use a random string
4. **Restrict MongoDB access** - Use IP whitelist if possible
5. **Keep environment variables secret** - Don't share them

---

## 📝 Quick Reference

### Backend URLs
- **API Base**: `https://your-service-name.up.railway.app/api`
- **Socket.io**: `https://your-service-name.up.railway.app`
- **Health Check**: `https://your-service-name.up.railway.app/`

### Frontend URLs
- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app`

### Environment Variables Summary

**Backend (Railway):**
- `MONGODB_URI`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `DRIVE_FOLDER_ID`
- `ALLOWED_ORIGINS`
- `NODE_ENV=production`
- `PORT` (automatically set by Railway)

**Frontend (Vercel/Netlify):**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

---

## 🚀 Continuous Deployment

Both Railway and Vercel support automatic deployments:

- **Railway**: Auto-deploys on push to connected branch (usually `main`)
- **Vercel**: Auto-deploys on every push (production for `main`, preview for other branches)

No additional configuration needed - just push to GitHub!

---

## 📞 Support

If you encounter issues:
1. Check deployment logs in Railway/Vercel dashboard
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB and Google Drive access is configured
5. Check Railway service logs in the dashboard for backend errors
