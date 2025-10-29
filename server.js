import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import { promises as fs } from 'fs';
import { userQueries, messageQueries } from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${join('', file.originalname.match(/\.[^.]+$/)[0])}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '13mb' }));
app.use(express.static(join(__dirname, 'public')));
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// JWT middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============= AUTH ROUTES =============

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = userQueries.findByEmail.get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUsername = userQueries.findByUsername.get(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = userQueries.create.run(username, email, hashedPassword);
    const userId = result.lastInsertRowid;

    // Generate JWT token
    const token = jwt.sign(
      { userId, username, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, username, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = userQueries.findByEmail.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============= CHAT ROUTES =============

// Send message to AI with streaming
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { message, model = 'llama-3.3-70b-versatile' } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Save user message to database
    messageQueries.create.run(userId, 'user', message, model, 0);

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get recent chat history for context
    const recentMessages = messageQueries.getRecentByUserId.all(userId);
    const conversationHistory = recentMessages
      .reverse()
      .slice(-10) // Last 10 messages for context
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // System prompt for friendly responses
    const systemPrompt = {
      role: 'system',
      content: `You are a friendly, helpful, and enthusiastic AI assistant. Your responses should be:
- Warm and conversational, like talking to a friend
- Clear and easy to understand
- Encouraging and positive
- Helpful and informative
- Use emojis occasionally to add personality (but don't overdo it)
- Break down complex topics into simple explanations
- Ask follow-up questions when appropriate to better help the user

Always aim to make the user feel comfortable and supported in their learning or problem-solving journey!`
    };

    // Create chat completion with streaming
    const chatCompletion = await groq.chat.completions.create({
      messages: [systemPrompt, ...conversationHistory],
      model: model,
      temperature: 0.7,
      max_tokens: 8192,
      top_p: 1,
      stream: true
    });

    let fullResponse = '';
    let tokenCount = 0;

    // Stream the response
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        tokenCount++;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save AI response to database
    messageQueries.create.run(userId, 'assistant', fullResponse, model, tokenCount);

    // Send completion signal
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to get response from AI' })}\n\n`);
    res.end();
  }
});

// Get chat history
app.get('/api/chat/history', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 50;

    const messages = messageQueries.getByUserId.all(userId, limit);
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Upload image endpoint
app.post('/api/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Vision API - Image understanding with Llama 4 Scout
app.post('/api/chat/vision', authenticateToken, async (req, res) => {
  try {
    const { message, imageUrl, imageBase64 } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({ error: 'Image URL or base64 is required' });
    }

    let finalImageUrl = imageUrl;

    // If localhost URL, convert to base64
    if (imageUrl && imageUrl.includes('localhost')) {
      try {
        // Read image file from server
        const filename = imageUrl.split('/uploads/')[1];
        const imagePath = join(__dirname, 'uploads', filename);
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        // Detect mime type from filename
        const ext = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp'
        };
        const mimeType = mimeTypes[ext] || 'image/jpeg';
        
        finalImageUrl = `data:${mimeType};base64,${base64Image}`;
      } catch (err) {
        console.error('Error reading image:', err);
        return res.status(500).json({ error: 'Failed to read image file' });
      }
    } else if (imageBase64) {
      finalImageUrl = imageBase64;
    }

    // Save user message with image reference
    messageQueries.create.run(userId, 'user', `[Image] ${message}`, 'llama-4-scout-17b', 0);

    // Call Groq vision API with Llama 4 Scout model
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message
            },
            {
              type: 'image_url',
              image_url: {
                url: finalImageUrl
              }
            }
          ]
        }
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    const response = chatCompletion.choices[0].message.content;
    const tokensUsed = chatCompletion.usage?.total_tokens || 0;

    // Save AI response
    messageQueries.create.run(userId, 'assistant', response, 'llama-4-scout-17b', tokensUsed);

    res.json({
      response,
      tokensUsed,
      imageUrl
    });

  } catch (error) {
    console.error('Vision API error:', error);
    res.status(500).json({ error: 'Failed to process image: ' + error.message });
  }
});

// Get chat statistics for visualization
app.get('/api/chat/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    // Get various statistics
    const messageCount = messageQueries.countByUserId.get(userId);
    const tokenUsage = messageQueries.getTotalTokensByUserId.get(userId);
    const messagesByDate = messageQueries.getMessagesByDate.all(userId);
    const messagesByRole = messageQueries.getMessagesByRole.all(userId);
    const modelUsage = messageQueries.getModelUsage.all(userId);

    res.json({
      totalMessages: messageCount.count,
      totalTokens: tokenUsage.total || 0,
      messagesByDate,
      messagesByRole,
      modelUsage
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔑 Make sure to set GROQ_API_KEY in .env file`);
  });
}

// Export for Vercel serverless
export default app;
