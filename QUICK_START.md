# 🚀 Quick Start Guide

Get your Groq AI Chat application running in 5 minutes!

## ⚡ Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Groq API Key** ([Get Free Key](https://console.groq.com/))
- **Text Editor** (VS Code, Notepad++, etc.)
- **Web Browser** (Chrome, Firefox, Edge, Safari)

## 📋 Step-by-Step Setup

### Step 1: Install Dependencies

Open terminal/command prompt in the project folder and run:

```bash
npm install
```

**Expected Output:**
```
added 50 packages in 5s
```

### Step 2: Configure Environment

1. **Copy the example file:**
   ```bash
   copy .env.example .env
   ```
   (On Mac/Linux: `cp .env.example .env`)

2. **Edit `.env` file** with your favorite text editor:
   ```env
   GROQ_API_KEY=gsk_your_actual_groq_api_key_here
   JWT_SECRET=your_random_secret_string_here_make_it_long_and_secure
   PORT=3000
   ```

3. **Get your Groq API Key:**
   - Visit: https://console.groq.com/
   - Sign up/Login
   - Go to API Keys section
   - Create new API key
   - Copy and paste into `.env` file

4. **Generate JWT Secret:**
   - Use any random string (minimum 32 characters)
   - Example: `my_super_secret_jwt_key_2024_secure_random_string`
   - Or generate online: https://randomkeygen.com/

### Step 3: Start the Server

**Option A: Using npm**
```bash
npm start
```

**Option B: Using batch file (Windows)**
```bash
start.bat
```

**Expected Output:**
```
✅ Database initialized successfully
🚀 Server running on http://localhost:3000
📊 API endpoints available at http://localhost:3000/api
🔑 Make sure to set GROQ_API_KEY in .env file
```

### Step 4: Open in Browser

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the login/signup page

### Step 5: Create Account

1. Click **"Sign up"** link
2. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123` (minimum 6 characters)
3. Click **"Sign Up"**
4. You'll be automatically logged in and redirected to chat

### Step 6: Start Chatting!

1. Type a message in the input box
2. Press **Enter** to send (or click send button)
3. Watch the thinking animation
4. See the AI response stream in real-time
5. Try different models from the dropdown

## 🎯 Quick Test Commands

Try these prompts to test the application:

1. **Simple greeting:**
   ```
   Hello! How are you?
   ```

2. **Code generation:**
   ```
   Write a Python function to calculate fibonacci numbers
   ```

3. **Explanation:**
   ```
   Explain how neural networks work in simple terms
   ```

4. **Creative writing:**
   ```
   Write a short story about a robot learning to paint
   ```

## 📊 View Statistics

1. Click **"Statistics"** in the sidebar
2. See your chat metrics:
   - Total messages
   - Tokens used
   - Message distribution
   - Model usage charts
3. Click **"Refresh"** to update data

## 🔧 Troubleshooting

### Server won't start

**Problem:** Port 3000 already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Change port in `.env`:
```env
PORT=3001
```

---

**Problem:** Missing dependencies
```
Error: Cannot find module 'express'
```

**Solution:** Install dependencies:
```bash
npm install
```

---

### Can't connect to Groq API

**Problem:** Invalid API key
```
Error: 401 Unauthorized
```

**Solution:** 
1. Check your `.env` file
2. Verify GROQ_API_KEY is correct
3. Make sure there are no extra spaces
4. Get new key from https://console.groq.com/

---

**Problem:** Network error
```
Failed to get response from AI
```

**Solution:**
1. Check internet connection
2. Verify Groq API is accessible
3. Check firewall settings

---

### Login/Register not working

**Problem:** Network error on login
```
Network error. Please check if the server is running.
```

**Solution:**
1. Make sure server is running (`npm start`)
2. Check console for errors
3. Verify you're accessing http://localhost:3000
4. Check if database file has write permissions

---

### Database errors

**Problem:** Cannot write to database
```
Error: SQLITE_CANTOPEN
```

**Solution:**
1. Check folder permissions
2. Delete `chat.db` file and restart server
3. Run as administrator (Windows)

---

## 🎨 Customization Tips

### Change Theme Colors

Edit `public/css/chat.css` and `public/css/auth.css`:

```css
/* Find and replace gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Change Default Model

Edit `public/chat.html`:

```html
<select id="modelSelect">
    <option value="llama-3.3-70b-versatile" selected>Llama 3.3 70B</option>
    <!-- Change 'selected' to your preferred model -->
</select>
```

### Modify AI Personality

Edit `server.js` (line ~178):

```javascript
const systemPrompt = {
  role: 'system',
  content: `Your custom personality here...`
};
```

## 📱 Mobile Testing

1. Find your computer's IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. Update CORS in `server.js`:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'http://YOUR-IP:3000'],
     credentials: true
   }));
   ```

3. Access from mobile: `http://YOUR-IP:3000`

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS (SSL certificate)
- [ ] Add rate limiting
- [ ] Set up proper logging
- [ ] Use environment-specific configs
- [ ] Enable database backups
- [ ] Add input sanitization
- [ ] Set up monitoring

## 📚 Next Steps

1. **Read the documentation:**
   - `README.md` - Project overview
   - `SETUP.md` - Detailed setup
   - `ARCHITECTURE.md` - System design
   - `PROJECT_SUMMARY.md` - Feature list

2. **Test the application:**
   - Follow `TESTING_CHECKLIST.md`
   - Try different models
   - Test error scenarios
   - Check statistics accuracy

3. **Customize:**
   - Modify UI colors
   - Add new features
   - Integrate additional APIs
   - Enhance visualizations

4. **Deploy:**
   - Set up production server
   - Configure domain
   - Enable HTTPS
   - Set up monitoring

## 💡 Pro Tips

1. **Keyboard Shortcuts:**
   - `Enter` - Send message
   - `Shift + Enter` - New line
   - `Ctrl + R` - Refresh page

2. **Model Selection:**
   - **Llama 3.3 70B** - Best for general tasks
   - **Mixtral 8x7B** - Good for coding
   - **Gemma 2 9B** - Faster responses

3. **Performance:**
   - Keep messages under 2000 characters
   - Clear old chat history periodically
   - Use appropriate model for task

4. **Data Management:**
   - Export important conversations
   - Backup `chat.db` regularly
   - Monitor token usage

## 🆘 Getting Help

1. **Check logs:**
   - Server console output
   - Browser console (F12)
   - Network tab in DevTools

2. **Common issues:**
   - Review `TESTING_CHECKLIST.md`
   - Check `SETUP.md` troubleshooting
   - Verify all dependencies installed

3. **Reset everything:**
   ```bash
   # Delete database
   del chat.db
   
   # Reinstall dependencies
   rmdir /s node_modules
   npm install
   
   # Restart server
   npm start
   ```

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Server starts without errors
- ✅ Can access http://localhost:3000
- ✅ Can register new account
- ✅ Can login successfully
- ✅ Messages send and receive responses
- ✅ Thinking animation appears
- ✅ AI responses stream in real-time
- ✅ Statistics page shows data
- ✅ Charts render correctly

## 🎉 You're Ready!

Congratulations! Your Groq AI Chat application is now running.

**Enjoy chatting with your AI assistant!** 🤖✨

---

**Need more help?** Check the other documentation files in this project.

**Found a bug?** Review the code and fix it - you have full access!

**Want to contribute?** Feel free to enhance and customize the application!
