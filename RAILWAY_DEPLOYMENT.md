# 🚂 Railway Backend Deployment - Quick Guide

Step-by-step guide for deploying backend to Railway.

## Prerequisites

- GitHub account with your code pushed
- Railway account ([railway.app](https://railway.app)) - Sign up with GitHub

---

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your repository: `PPL-Auction`
6. Railway will create a new project

### 2. Configure Service

1. Railway auto-detects your service
2. Click on the service to open settings
3. Go to **Settings** tab:

   **Configure:**
   - **Root Directory**: `Backend`
   - **Build Command**: Leave empty (auto-detects)
   - **Start Command**: `npm start`

### 3. Add Environment Variables

Go to **Variables** tab and add:

```env
MONGODB_URI=mongodb+srv://hari27nr_db_user:sg80QxOvVF7qOdMs@auctionppl.xbxexjg.mongodb.net/?appName=AuctionPPL
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=generate_with_openssl_rand_base64_32
DRIVE_FOLDER_ID=1OOrnD9Vhsu6aRUvYZ4bfSUOz9WooBSgm
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

**Important:**
- Generate JWT_SECRET: `openssl rand -base64 32`
- Update `ALLOWED_ORIGINS` after frontend deployment
- `PORT` is automatically set by Railway - don't add it manually

### 4. Generate Public URL

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Railway will create a URL like: `https://your-service-name.up.railway.app`
4. Copy this URL - you'll need it for frontend configuration

### 5. Deploy

Railway automatically:
- Detects Node.js
- Runs `npm install` in the `Backend` directory
- Runs `npm start`
- Deploys your service

**Monitor deployment:**
- Go to **Deployments** tab
- Watch build logs in real-time
- Wait for "Deploy successful" message

### 6. Test Backend

Visit: `https://your-service-name.up.railway.app/`

Expected response: `PPL Auction API is running`

---

## Railway Features

### Automatic Deployments
- Railway auto-deploys on every push to your connected branch
- No manual deployment needed
- View deployment history in **Deployments** tab

### Logs
- View real-time logs: **Service** → **Deployments** → Click deployment → **View Logs**
- Useful for debugging

### Custom Domain (Optional)
1. Go to **Settings** → **Networking**
2. Click **"Custom Domain"**
3. Add your domain
4. Configure DNS as instructed

### Environment Variables
- Add/Edit in **Variables** tab
- Changes trigger automatic redeployment
- Use **Reference** to share variables between services

---

## Troubleshooting

### Build Fails
- Check **Deployments** → **Logs** for errors
- Verify `Root Directory` is set to `Backend`
- Ensure `package.json` exists in `Backend/` directory

### Service Won't Start
- Check logs for error messages
- Verify `Start Command` is `npm start`
- Ensure `server.js` exists in `Backend/` directory
- Check environment variables are set correctly

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check Railway logs for connection errors

### Port Issues
- Railway automatically sets `PORT` environment variable
- Your code should use: `process.env.PORT || 5000`
- Don't hardcode port numbers

### CORS Errors
- Update `ALLOWED_ORIGINS` with exact frontend URL
- Include `https://` protocol
- No trailing slashes
- Railway will redeploy automatically after saving

---

## Cost

**Railway Pricing:**
- **Free Tier**: $5 credit/month (good for testing)
- **Hobby Plan**: $5/month + usage (recommended for production)
- **Pro Plan**: $20/month + usage (for higher traffic)

**Note:** Railway charges based on usage (CPU, memory, bandwidth). For a Node.js backend, the free credit usually covers light usage.

---

## Quick Reference

### Railway Dashboard Locations

- **Projects**: List of all projects
- **Service Settings**: Root directory, build/start commands
- **Variables**: Environment variables
- **Networking**: Public URL, custom domains
- **Deployments**: Build history and logs
- **Metrics**: CPU, memory usage

### Important URLs

- **Dashboard**: https://railway.app/dashboard
- **Your Service**: https://railway.app/project/[project-id]/service/[service-id]
- **Public URL**: `https://your-service-name.up.railway.app`

### Environment Variables Checklist

- [ ] `MONGODB_URI`
- [ ] `ADMIN_PASSWORD`
- [ ] `JWT_SECRET`
- [ ] `DRIVE_FOLDER_ID`
- [ ] `NODE_ENV=production`
- [ ] `ALLOWED_ORIGINS` (update after frontend deployment)

---

## Next Steps

After backend is deployed:

1. ✅ Note your Railway backend URL
2. ✅ Deploy frontend to Vercel (see `DEPLOYMENT_GUIDE.md`)
3. ✅ Update `ALLOWED_ORIGINS` in Railway with frontend URL
4. ✅ Update frontend environment variables with Railway URL
5. ✅ Test complete application

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check logs in Railway dashboard for errors
