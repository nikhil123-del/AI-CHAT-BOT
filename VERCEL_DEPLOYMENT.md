# Vercel Deployment Guide

This guide will help you deploy your Groq AI Chat application to Vercel with both frontend and backend in a single repository.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional but recommended)
3. Your Groq API Key
4. A JWT Secret key

## Project Structure

```
groq-ai-chat/
├── public/              # Frontend files (HTML, CSS, JS)
├── server.js            # Backend Express server
├── database.js          # Database configuration
├── vercel.json          # Vercel configuration
├── package.json         # Dependencies
└── .vercelignore        # Files to ignore during deployment
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd groq-ai-chat
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `groq-ai-chat` (or your preferred name)
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Set Environment Variables**:
   ```bash
   vercel env add GROQ_API_KEY
   vercel env add JWT_SECRET
   ```
   
   Or add them in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add:
     - `GROQ_API_KEY`: Your Groq API key
     - `JWT_SECRET`: A secure random string (e.g., use `openssl rand -base64 32`)

6. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import Project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables**:
   - In the project setup, add environment variables:
     - `GROQ_API_KEY`: Your Groq API key
     - `JWT_SECRET`: A secure random string
   - Click "Deploy"

## Important Notes

### Database Considerations

⚠️ **SQLite Limitation on Vercel**: Vercel's serverless functions are stateless and read-only. The current SQLite database won't persist data between deployments.

**Solutions**:

1. **Use Vercel Postgres** (Recommended for production):
   ```bash
   vercel postgres create
   ```
   Then update `database.js` to use PostgreSQL instead of SQLite.

2. **Use a cloud database**:
   - [Supabase](https://supabase.com/) (PostgreSQL)
   - [PlanetScale](https://planetscale.com/) (MySQL)
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - [Neon](https://neon.tech/) (PostgreSQL)

3. **For testing only**: Keep SQLite but be aware data will reset on each deployment.

### File Uploads

The `uploads` folder won't persist on Vercel. For production, use:
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Cloudinary](https://cloudinary.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Uploadcare](https://uploadcare.com/)

## Configuration Files Explained

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

- **builds**: Tells Vercel to build `server.js` as a Node.js serverless function
- **routes**: 
  - API routes (`/api/*`) are handled by `server.js`
  - All other routes serve static files from `public/` folder

### .vercelignore
Excludes files from deployment to reduce bundle size:
- `node_modules` (Vercel installs dependencies automatically)
- `.env` (use environment variables in Vercel dashboard)
- Local database and uploads

## Testing Your Deployment

1. **Check deployment URL**: After deployment, Vercel provides a URL (e.g., `https://groq-ai-chat.vercel.app`)

2. **Test endpoints**:
   - Frontend: `https://your-app.vercel.app/`
   - Health check: `https://your-app.vercel.app/api/health`
   - Register: `https://your-app.vercel.app/api/auth/register`

3. **Check logs**:
   ```bash
   vercel logs
   ```
   Or view in Vercel Dashboard → Your Project → Deployments → View Function Logs

## Troubleshooting

### Common Issues

1. **Module not found errors**:
   - Ensure all dependencies are in `package.json`
   - Run `npm install` locally to verify

2. **Environment variables not working**:
   - Check they're set in Vercel dashboard
   - Redeploy after adding new variables

3. **Database connection errors**:
   - SQLite won't work in production on Vercel
   - Migrate to a cloud database solution

4. **File upload errors**:
   - Implement cloud storage solution (Vercel Blob, S3, etc.)

## Local Development

For local development, continue using:
```bash
npm start
```

The server will run on `http://localhost:3000` with SQLite database.

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrated to cloud solution (if needed)
- [ ] File upload configured with cloud storage (if needed)
- [ ] CORS settings updated for production domain
- [ ] JWT_SECRET is secure and unique
- [ ] API keys are not exposed in frontend code
- [ ] Error handling and logging configured
- [ ] Rate limiting implemented (optional but recommended)

## Updating Your Deployment

### Via CLI:
```bash
vercel --prod
```

### Via Git:
Push to your main branch, and Vercel will auto-deploy if connected to GitHub.

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Groq API Documentation](https://console.groq.com/docs)

---

**Note**: This configuration deploys both frontend and backend from a single repository. The frontend is served as static files from the `public/` folder, and the backend runs as serverless functions.
