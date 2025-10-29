# Quick Deployment Guide - Vercel

## 🚀 Deploy in 5 Minutes

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# Navigate to project directory
cd groq-ai-chat

# Deploy to preview
vercel

# Or deploy directly to production
vercel --prod
```

### Step 4: Set Environment Variables

After deployment, add these environment variables in Vercel Dashboard:

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Settings" → "Environment Variables"
3. Add the following:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `GROQ_API_KEY` | Your Groq API Key | Production, Preview, Development |
| `JWT_SECRET` | A secure random string | Production, Preview, Development |

**Generate JWT_SECRET:**
```bash
# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On Linux/Mac
openssl rand -base64 32
```

### Step 5: Redeploy
After adding environment variables, redeploy:
```bash
vercel --prod
```

## 🎯 Using the Deployment Script (Windows)

Simply double-click `deploy.bat` or run:
```bash
deploy.bat
```

Then choose from the menu:
1. Deploy to Preview
2. Deploy to Production
3. Login to Vercel
4. Check Status
5. View Logs

## ✅ Verify Deployment

Visit your deployment URL (provided after deployment):
- Frontend: `https://your-app.vercel.app/`
- Health Check: `https://your-app.vercel.app/api/health`

## ⚠️ Important Notes

### Database
- **SQLite won't persist on Vercel** (serverless environment)
- For production, migrate to:
  - Vercel Postgres
  - Supabase
  - PlanetScale
  - MongoDB Atlas

### File Uploads
- The `uploads/` folder won't persist
- Use cloud storage:
  - Vercel Blob
  - Cloudinary
  - AWS S3

## 🔧 Troubleshooting

**Deployment fails?**
- Check `vercel logs` for errors
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

**API not working?**
- Check environment variables in Vercel Dashboard
- Verify GROQ_API_KEY is valid
- Check function logs in Vercel Dashboard

**Database errors?**
- SQLite doesn't work on Vercel
- Migrate to a cloud database solution

## 📚 More Information

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed documentation.

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or [Groq API Docs](https://console.groq.com/docs)
