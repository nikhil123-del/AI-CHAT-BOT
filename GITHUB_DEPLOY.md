# Deploy to Vercel via GitHub

## 📋 Step-by-Step Guide

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Commit your changes**:
   ```bash
   git commit -m "Configure project for Vercel deployment"
   ```

4. **Create a new repository on GitHub**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `groq-ai-chat`)
   - **Don't** initialize with README, .gitignore, or license (we already have these)

5. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import Project to Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Repository**:
   - Click "Add New..." → "Project"
   - Click "Import" next to your `groq-ai-chat` repository
   - Vercel will automatically detect the configuration from `vercel.json`

3. **Configure Project** (if needed):
   - **Framework Preset**: Other (Vercel will auto-detect from vercel.json)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `public` (already configured in vercel.json)

### Step 3: Add Environment Variables

**IMPORTANT**: Before deploying, add these environment variables:

1. In the Vercel import screen, expand **"Environment Variables"**

2. Add the following variables:

   | Name | Value |
   |------|-------|
   | `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com) |
   | `JWT_SECRET` | A secure random string (see below) |
   | `NODE_ENV` | `production` |

3. **Generate JWT_SECRET**:
   
   **On Windows (PowerShell)**:
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   
   **On Linux/Mac**:
   ```bash
   openssl rand -base64 32
   ```
   
   **Or use an online generator**: [randomkeygen.com](https://randomkeygen.com/)

4. Make sure to select **"Production"**, **"Preview"**, and **"Development"** for all variables

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like: `https://groq-ai-chat.vercel.app`

### Step 5: Test Your Deployment

1. **Visit your deployment URL**
2. **Test the following**:
   - ✅ Frontend loads correctly
   - ✅ Can register a new account
   - ✅ Can login
   - ✅ Can send chat messages
   - ✅ AI responses work

3. **Check API Health**:
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

## 🔄 Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- **Deploy to Production**: When you push to `main` branch
- **Deploy to Preview**: When you create a pull request

To update your app:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy the changes!

## ⚙️ Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables Management

To update environment variables:
1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Environment Variables"
3. Add/Edit/Delete variables
4. **Important**: Redeploy after changing variables

## ⚠️ Important Notes

### Database Limitation
- **SQLite won't work on Vercel** (serverless environment is stateless)
- Your current database will reset on each deployment
- **For production**, you MUST migrate to a cloud database:
  
  **Recommended Options**:
  1. **Vercel Postgres** (easiest integration):
     ```bash
     vercel postgres create
     ```
  
  2. **Supabase** (free tier available):
     - Sign up at [supabase.com](https://supabase.com)
     - Create a new project
     - Get connection string
     - Update `database.js` to use PostgreSQL
  
  3. **PlanetScale** (MySQL):
     - Sign up at [planetscale.com](https://planetscale.com)
     - Create database
     - Get connection string
  
  4. **MongoDB Atlas**:
     - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
     - Create cluster
     - Get connection string

### File Uploads Limitation
- The `uploads/` folder won't persist on Vercel
- **For production**, use cloud storage:
  
  **Recommended Options**:
  1. **Vercel Blob**:
     ```bash
     npm install @vercel/blob
     ```
  
  2. **Cloudinary** (free tier):
     - Sign up at [cloudinary.com](https://cloudinary.com)
     - Get API credentials
     - Update upload logic
  
  3. **AWS S3**:
     - Create S3 bucket
     - Configure IAM credentials
     - Update upload logic

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` syntax

### API Not Working
- Check Function logs in Vercel Dashboard
- Verify environment variables are set correctly
- Check GROQ_API_KEY is valid

### Database Errors
- Remember: SQLite doesn't work on Vercel
- Migrate to cloud database for production

### CORS Errors
- Check if your frontend URL matches the deployed URL
- Update CORS settings in `server.js` if needed

## 📊 Monitoring Your Deployment

### View Logs
1. Go to Vercel Dashboard → Your Project
2. Click on a deployment
3. Click "Functions" tab
4. View real-time logs

### Analytics
1. Go to Vercel Dashboard → Your Project
2. Click "Analytics" tab
3. View traffic, performance, and errors

## 🎯 Quick Commands Reference

```bash
# Push updates to GitHub (auto-deploys to Vercel)
git add .
git commit -m "Update message"
git push

# Check git status
git status

# View git log
git log --oneline

# Create new branch for testing
git checkout -b feature-name
git push -u origin feature-name
```

## ✅ Deployment Checklist

Before going live, ensure:
- [ ] All environment variables are set in Vercel
- [ ] GROQ_API_KEY is valid and working
- [ ] JWT_SECRET is secure and unique
- [ ] Database solution chosen (if using beyond testing)
- [ ] File upload solution chosen (if using image uploads)
- [ ] Tested registration and login
- [ ] Tested chat functionality
- [ ] Tested on mobile devices
- [ ] Custom domain configured (if applicable)
- [ ] Error monitoring set up

## 🎉 You're All Set!

Your project is now configured and ready to deploy to Vercel via GitHub. The configuration includes:

✅ `vercel.json` - Vercel configuration
✅ `.vercelignore` - Files to exclude from deployment
✅ `server.js` - Updated for serverless deployment
✅ `.gitignore` - Updated with Vercel-specific entries
✅ `package.json` - Build scripts configured

Just follow the steps above to push to GitHub and deploy!

---

**Need Help?**
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Documentation](https://docs.github.com)
- [Groq API Docs](https://console.groq.com/docs)
