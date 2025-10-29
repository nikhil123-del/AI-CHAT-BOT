# Groq AI Chat Application

A modern, full-stack generative AI chat application powered by Groq's LLM API with user authentication, real-time streaming responses, thinking animations, and data visualization.

## Features

- 🔐 **User Authentication**: Secure sign-up/login system with JWT tokens
- 💬 **Real-time Chat**: Stream responses from Groq's LLM models
- 🧠 **Thinking Animation**: Visual feedback while AI processes requests
- 📊 **Data Visualization**: Interactive charts using Chart.js
- 🎨 **Clean UI**: Modern, responsive interface with HTML/CSS/JavaScript
- 💾 **SQLite Database**: Persistent storage for users and chat history
- 🔒 **CORS Enabled**: Configured for localhost development

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your Groq API key (get it from https://console.groq.com/)
   - Set a secure JWT secret

3. **Run the Application**
   ```bash
   npm start
   ```

4. **Access the App**
   - Open your browser to `http://localhost:3000`

## Project Structure

```
groq-ai-chat/
├── server.js              # Express server with API routes
├── database.js            # SQLite database setup and queries
├── public/                # Frontend files
│   ├── index.html         # Login/Signup page
│   ├── chat.html          # Main chat interface
│   ├── css/
│   │   ├── auth.css       # Authentication page styles
│   │   └── chat.css       # Chat interface styles
│   └── js/
│       ├── auth.js        # Authentication logic
│       └── chat.js        # Chat functionality
├── package.json
└── README.md
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite with better-sqlite3
- **AI Provider**: Groq SDK
- **Authentication**: JWT, bcryptjs
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Visualization**: Chart.js
- **Security**: CORS, bcrypt password hashing

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/chat` - Send message to AI (requires auth)
- `GET /api/chat/history` - Get chat history (requires auth)
- `GET /api/chat/stats` - Get chat statistics for visualization (requires auth)

## 🚀 Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel with both frontend and backend in a single repository.

**Quick Deploy:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Important:** After deployment, add these environment variables in Vercel Dashboard:
- `GROQ_API_KEY` - Your Groq API key
- `JWT_SECRET` - A secure random string

📖 **Detailed Guides:**
- [Quick Deploy Guide](./QUICK_DEPLOY.md) - Deploy in 5 minutes
- [Complete Deployment Guide](./VERCEL_DEPLOYMENT.md) - Full documentation

**Windows Users:** Run `deploy.bat` for an interactive deployment menu.

### Production Considerations

⚠️ **Database**: SQLite won't persist on Vercel. For production, migrate to:
- Vercel Postgres
- Supabase
- PlanetScale
- MongoDB Atlas

⚠️ **File Uploads**: Use cloud storage (Vercel Blob, Cloudinary, AWS S3) instead of local `uploads/` folder.

## License

MIT
