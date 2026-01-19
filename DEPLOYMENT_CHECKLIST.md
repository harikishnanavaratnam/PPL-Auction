# 🚀 Quick Deployment Checklist

## Backend (Railway)

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] MongoDB connection string ready
- [ ] Admin password decided
- [ ] JWT secret generated
- [ ] Google Drive folder ID ready

### Railway Setup
- [ ] Created new project on Railway
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `Backend`
- [ ] Start Command: `npm start` (auto-detected)
- [ ] Generated public domain

### Environment Variables (Backend)
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `ADMIN_PASSWORD` - Admin login password
- [ ] `JWT_SECRET` - Random secure string
- [ ] `DRIVE_FOLDER_ID` - Google Drive folder ID
- [ ] `NODE_ENV=production`
- [ ] `ALLOWED_ORIGINS` - (Update after frontend deployment)

### After Deployment
- [ ] Backend URL accessible
- [ ] API responds at `/api/auction`
- [ ] Socket.io working
- [ ] Note backend URL for frontend config

---

## Frontend (Vercel)

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] Backend URL from Railway

### Vercel Setup
- [ ] Created project
- [ ] Set Root Directory: `Frontend`
- [ ] Build settings auto-detected (Next.js)

### Environment Variables (Frontend)
- [ ] `NEXT_PUBLIC_API_URL` - `https://your-service-name.up.railway.app/api`
- [ ] `NEXT_PUBLIC_SOCKET_URL` - `https://your-service-name.up.railway.app`

### After Deployment
- [ ] Frontend URL accessible
- [ ] Update backend `ALLOWED_ORIGINS` with frontend URL
- [ ] Test all pages
- [ ] Test admin login
- [ ] Test live auction
- [ ] Verify real-time updates

---

## Final Steps

1. [ ] Update backend `ALLOWED_ORIGINS` with frontend URL
2. [ ] Test complete flow: Home → Teams → Players → Live → Admin
3. [ ] Verify Socket.io real-time updates
4. [ ] Test admin functions
5. [ ] Share URLs with team!

---

## Quick Commands

```bash
# Generate JWT Secret
openssl rand -base64 32

# Test Backend
curl https://your-service-name.up.railway.app/

# Check Backend Logs (Railway Dashboard → Service → Deployments)
# Check Frontend Logs (Vercel Dashboard)
```
