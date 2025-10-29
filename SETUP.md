# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your_secure_jwt_secret_here
PORT=3000
```

**Important:** 
- Get your Groq API key from: https://console.groq.com/
- Generate a secure JWT secret (use a random string generator)
- The PORT is optional (defaults to 3000)

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## First Time Use

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Chat**: Start chatting with the AI assistant
4. **Statistics**: View your chat statistics and visualizations

## Features Overview

### Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt

### Chat Interface
- Real-time streaming responses from Groq LLM
- Multiple model selection (Llama 3.3, Mixtral, Gemma)
- Thinking animation while AI processes
- Chat history persistence
- Friendly AI personality

### Data Visualization
- Total messages and tokens tracking
- Messages over time (line chart)
- Message distribution (doughnut chart)
- Model usage statistics (bar chart)

### Technical Stack
- **Backend**: Node.js, Express.js
- **Database**: SQLite with better-sqlite3
- **AI Provider**: Groq SDK
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js
- **Security**: CORS, JWT, bcrypt

## Troubleshooting

### Server won't start
- Make sure you have Node.js installed (v18 or higher)
- Check if port 3000 is available
- Verify your `.env` file exists and has the correct format

### Can't connect to Groq API
- Verify your GROQ_API_KEY is correct
- Check your internet connection
- Ensure you have API credits available

### Database errors
- Delete `chat.db` file and restart the server to reset the database
- Check file permissions in the project directory

### CORS errors
- Make sure you're accessing the app via `http://localhost:3000`
- Check that the server is running
- Verify CORS configuration in `server.js`

## Development Notes

### Project Structure
```
groq-ai-chat/
├── server.js              # Express server & API routes
├── database.js            # SQLite database setup
├── public/                # Frontend files
│   ├── index.html         # Login/Register page
│   ├── chat.html          # Main chat interface
│   ├── css/
│   │   ├── auth.css       # Auth page styles
│   │   └── chat.css       # Chat interface styles
│   └── js/
│       ├── auth.js        # Authentication logic
│       └── chat.js        # Chat functionality
├── package.json
├── .env                   # Environment variables (create this)
└── README.md
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Chat (requires authentication)
- `POST /api/chat` - Send message to AI (streaming response)
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/stats` - Get chat statistics

### Database Schema

**users**
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT - hashed)
- created_at (DATETIME)

**messages**
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- role (TEXT - 'user' or 'assistant')
- content (TEXT)
- model (TEXT)
- tokens_used (INTEGER)
- created_at (DATETIME)

## Security Considerations

1. **Never commit `.env` file** - It's in `.gitignore` for a reason
2. **Use strong JWT secret** - Generate a random, long string
3. **HTTPS in production** - Use SSL certificates for production deployment
4. **Rate limiting** - Consider adding rate limiting for API endpoints
5. **Input validation** - Server validates all user inputs

## License

MIT
