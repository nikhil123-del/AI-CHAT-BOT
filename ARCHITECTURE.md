# System Architecture

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐              ┌──────────────┐            │
│  │  index.html  │              │  chat.html   │            │
│  │  (Auth Page) │              │ (Chat Page)  │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                              │                     │
│         ├─ auth.css                    ├─ chat.css         │
│         └─ auth.js                     └─ chat.js          │
│                                                               │
│         │                              │                     │
│         └──────────┬───────────────────┘                    │
│                    │                                         │
│              localStorage                                    │
│           (JWT Token, User)                                  │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     │ (CORS Enabled)
                     │
┌────────────────────┼─────────────────────────────────────────┐
│                    ▼         SERVER SIDE                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Express.js Server                       │   │
│  │                 (server.js)                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                    │                                         │
│         ┌──────────┼──────────┐                             │
│         │          │           │                             │
│         ▼          ▼           ▼                             │
│  ┌──────────┐ ┌────────┐ ┌─────────┐                       │
│  │   Auth   │ │  Chat  │ │  Stats  │                       │
│  │  Routes  │ │ Routes │ │ Routes  │                       │
│  └────┬─────┘ └───┬────┘ └────┬────┘                       │
│       │           │            │                             │
│       │           │            │                             │
│  ┌────▼───────────▼────────────▼────┐                      │
│  │     JWT Authentication            │                      │
│  │        Middleware                 │                      │
│  └───────────────────────────────────┘                      │
│                    │                                         │
│         ┌──────────┼──────────┐                             │
│         │          │           │                             │
│         ▼          ▼           ▼                             │
│  ┌──────────┐ ┌────────┐ ┌─────────┐                       │
│  │ Database │ │  Groq  │ │ bcrypt  │                       │
│  │  Layer   │ │  SDK   │ │   JWT   │                       │
│  └────┬─────┘ └───┬────┘ └─────────┘                       │
│       │           │                                          │
└───────┼───────────┼──────────────────────────────────────────┘
        │           │
        │           │ HTTPS API
        │           │
        ▼           ▼
┌─────────────┐ ┌──────────────┐
│   SQLite    │ │ Groq Cloud   │
│  Database   │ │  LLM API     │
│  (chat.db)  │ │              │
└─────────────┘ └──────────────┘
```

## 📊 Data Flow Diagrams

### Authentication Flow

```
User Registration:
┌──────┐     ┌────────┐     ┌──────────┐     ┌──────────┐
│Client│────▶│ POST   │────▶│ Validate │────▶│  Hash    │
│      │     │/register│     │  Input   │     │ Password │
└──────┘     └────────┘     └──────────┘     └────┬─────┘
                                                    │
┌──────┐     ┌────────┐     ┌──────────┐     ┌────▼─────┐
│Client│◀────│  JWT   │◀────│  Create  │◀────│  Save    │
│      │     │ Token  │     │   User   │     │   User   │
└──────┘     └────────┘     └──────────┘     └──────────┘

User Login:
┌──────┐     ┌────────┐     ┌──────────┐     ┌──────────┐
│Client│────▶│ POST   │────▶│   Find   │────▶│  Verify  │
│      │     │ /login │     │   User   │     │ Password │
└──────┘     └────────┘     └──────────┘     └────┬─────┘
                                                    │
┌──────┐     ┌────────┐     ┌──────────┐     ┌────▼─────┐
│Client│◀────│  JWT   │◀────│ Generate │◀────│  Valid?  │
│      │     │ Token  │     │  Token   │     │          │
└──────┘     └────────┘     └──────────┘     └──────────┘
```

### Chat Message Flow

```
1. User sends message:
┌──────┐     ┌────────┐     ┌──────────┐     ┌──────────┐
│Client│────▶│  POST  │────▶│  Verify  │────▶│   Save   │
│      │     │ /chat  │     │   JWT    │     │ Message  │
└──────┘     └────────┘     └──────────┘     └────┬─────┘
                                                    │
2. Fetch context & call Groq:                       │
┌──────┐     ┌────────┐     ┌──────────┐     ┌────▼─────┐
│ Groq │◀────│  API   │◀────│  Build   │◀────│  Fetch   │
│ API  │     │  Call  │     │ Context  │     │ History  │
└───┬──┘     └────────┘     └──────────┘     └──────────┘
    │
3. Stream response:
    │
    ▼
┌──────────┐     ┌────────┐     ┌──────────┐
│  Stream  │────▶│  SSE   │────▶│  Client  │
│  Chunks  │     │ Events │     │ Updates  │
└──────────┘     └────────┘     └──────────┘
    │
4. Save AI response:
    │
    ▼
┌──────────┐     ┌────────┐
│   Save   │────▶│Database│
│ Response │     │        │
└──────────┘     └────────┘
```

### Statistics Flow

```
┌──────┐     ┌────────┐     ┌──────────┐     ┌──────────┐
│Client│────▶│  GET   │────▶│  Verify  │────▶│  Query   │
│      │     │ /stats │     │   JWT    │     │ Database │
└──────┘     └────────┘     └──────────┘     └────┬─────┘
                                                    │
┌──────┐     ┌────────┐     ┌──────────┐     ┌────▼─────┐
│Client│◀────│  JSON  │◀────│ Aggregate│◀────│  Fetch   │
│      │     │  Data  │     │   Data   │     │   Data   │
└──┬───┘     └────────┘     └──────────┘     └──────────┘
   │
   ▼
┌──────────┐
│ Chart.js │
│ Renders  │
└──────────┘
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────┐
│              USERS                  │
├─────────────────────────────────────┤
│ id          INTEGER PRIMARY KEY     │
│ username    TEXT UNIQUE NOT NULL    │
│ email       TEXT UNIQUE NOT NULL    │
│ password    TEXT NOT NULL           │
│ created_at  DATETIME DEFAULT NOW    │
└─────────────────────────────────────┘
                  │
                  │ 1:N
                  │
┌─────────────────▼───────────────────┐
│             MESSAGES                │
├─────────────────────────────────────┤
│ id          INTEGER PRIMARY KEY     │
│ user_id     INTEGER FK → users.id   │
│ role        TEXT (user/assistant)   │
│ content     TEXT NOT NULL           │
│ model       TEXT                    │
│ tokens_used INTEGER DEFAULT 0       │
│ created_at  DATETIME DEFAULT NOW    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          CHAT_SESSIONS              │
├─────────────────────────────────────┤
│ id          INTEGER PRIMARY KEY     │
│ user_id     INTEGER FK → users.id   │
│ title       TEXT                    │
│ created_at  DATETIME DEFAULT NOW    │
│ updated_at  DATETIME DEFAULT NOW    │
└─────────────────────────────────────┘
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────┐
│           Security Layers                   │
├─────────────────────────────────────────────┤
│                                             │
│  Layer 1: CORS                              │
│  ├─ Origin validation                       │
│  └─ Credentials handling                    │
│                                             │
│  Layer 2: JWT Authentication                │
│  ├─ Token generation (7-day expiry)         │
│  ├─ Token verification                      │
│  └─ Protected route middleware              │
│                                             │
│  Layer 3: Password Security                 │
│  ├─ bcrypt hashing (10 rounds)              │
│  └─ No plain text storage                   │
│                                             │
│  Layer 4: Input Validation                  │
│  ├─ Server-side validation                  │
│  ├─ Prepared statements (SQL injection)     │
│  └─ HTML escaping (XSS prevention)          │
│                                             │
│  Layer 5: Environment Variables             │
│  ├─ .env file (gitignored)                  │
│  ├─ API key protection                      │
│  └─ JWT secret protection                   │
│                                             │
└─────────────────────────────────────────────┘
```

## 🔄 Request/Response Cycle

### Chat Request Example

```
1. Client Request:
POST /api/chat
Headers: {
  Authorization: "Bearer eyJhbGc..."
  Content-Type: "application/json"
}
Body: {
  message: "Explain quantum computing",
  model: "llama-3.3-70b-versatile"
}

2. Server Processing:
├─ Verify JWT token
├─ Extract user ID
├─ Save user message to DB
├─ Fetch last 10 messages
├─ Build conversation context
├─ Add system prompt
└─ Call Groq API

3. Streaming Response:
Headers: {
  Content-Type: "text/event-stream"
  Cache-Control: "no-cache"
  Connection: "keep-alive"
}
Body (SSE):
data: {"content":"Quantum"}
data: {"content":" computing"}
data: {"content":" is..."}
...
data: {"done":true}

4. Client Handling:
├─ Show thinking indicator
├─ Remove thinking indicator
├─ Create message bubble
├─ Stream text into bubble
├─ Format markdown
└─ Auto-scroll to bottom
```

## 📦 Module Dependencies

```
server.js
├── express (web framework)
├── cors (CORS middleware)
├── groq-sdk (AI provider)
├── bcryptjs (password hashing)
├── jsonwebtoken (JWT auth)
├── dotenv (env variables)
└── database.js
    └── better-sqlite3 (SQLite driver)

Frontend
├── index.html
│   ├── auth.css
│   └── auth.js
└── chat.html
    ├── chat.css
    ├── chat.js
    └── Chart.js (CDN)
```

## 🌐 Network Communication

```
Client ←→ Server Communication:

1. Authentication:
   POST /api/auth/register
   POST /api/auth/login
   ↓
   Response: { token, user }

2. Chat (Protected):
   POST /api/chat + Bearer Token
   ↓
   Response: SSE Stream

3. History (Protected):
   GET /api/chat/history + Bearer Token
   ↓
   Response: { messages: [...] }

4. Statistics (Protected):
   GET /api/chat/stats + Bearer Token
   ↓
   Response: {
     totalMessages,
     totalTokens,
     messagesByDate,
     messagesByRole,
     modelUsage
   }

Server ←→ Groq Communication:

POST https://api.groq.com/openai/v1/chat/completions
Headers: {
  Authorization: "Bearer GROQ_API_KEY"
  Content-Type: "application/json"
}
Body: {
  messages: [...],
  model: "llama-3.3-70b-versatile",
  stream: true
}
↓
Response: SSE Stream of chunks
```

## 🎯 Component Interaction

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   Auth   │  │   Chat   │  │  Stats   │          │
│  │   View   │  │   View   │  │   View   │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │              │                 │
│       ├─────────────┼──────────────┤                │
│       │             │              │                 │
│  ┌────▼─────────────▼──────────────▼────┐          │
│  │        JavaScript Controllers         │          │
│  │  (auth.js, chat.js)                   │          │
│  └────┬──────────────────────────────┬───┘          │
│       │                              │               │
│       │ API Calls                    │ LocalStorage │
│       │                              │               │
└───────┼──────────────────────────────┼───────────────┘
        │                              │
        ▼                              ▼
┌─────────────────┐          ┌─────────────────┐
│  Express API    │          │  Browser Store  │
│  Endpoints      │          │  (JWT, User)    │
└─────────────────┘          └─────────────────┘
```

## 🚀 Deployment Architecture

```
Development:
┌──────────────────────────────────────┐
│  localhost:3000                      │
│  ├─ Express Server                   │
│  ├─ SQLite Database (chat.db)        │
│  └─ Static Files (public/)           │
└──────────────────────────────────────┘

Production (Recommended):
┌──────────────────────────────────────┐
│  Reverse Proxy (nginx)               │
│  ├─ SSL/TLS Termination              │
│  └─ Rate Limiting                    │
└────────────┬─────────────────────────┘
             │
┌────────────▼─────────────────────────┐
│  Node.js Application                 │
│  ├─ PM2 Process Manager              │
│  ├─ Environment Variables            │
│  └─ Logging                          │
└────────────┬─────────────────────────┘
             │
┌────────────▼─────────────────────────┐
│  SQLite Database                     │
│  └─ Persistent Volume                │
└──────────────────────────────────────┘
```

---

**Architecture Version**: 1.0
**Last Updated**: 2025
**Complexity**: Medium (Full-Stack)
