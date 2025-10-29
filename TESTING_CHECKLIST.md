# Testing Checklist

## Pre-Testing Setup

- [ ] Node.js v18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with valid GROQ_API_KEY
- [ ] Server starts without errors (`npm start`)
- [ ] Browser can access http://localhost:3000

## Authentication Tests

### Registration
- [ ] Can access registration form
- [ ] Form validation works (empty fields)
- [ ] Password minimum length validation (6 chars)
- [ ] Successful registration creates account
- [ ] Duplicate email shows error
- [ ] Duplicate username shows error
- [ ] Auto-redirect to chat after registration

### Login
- [ ] Can access login form
- [ ] Form validation works (empty fields)
- [ ] Valid credentials allow login
- [ ] Invalid credentials show error
- [ ] JWT token stored in localStorage
- [ ] Auto-redirect to chat after login
- [ ] Already logged-in users redirect to chat

### Logout
- [ ] Logout button works
- [ ] Token removed from localStorage
- [ ] Redirects to login page
- [ ] Cannot access chat without token

## Chat Interface Tests

### UI/UX
- [ ] Welcome message displays on first visit
- [ ] User info shows correctly in sidebar
- [ ] User initial/avatar displays
- [ ] Model selector shows all options
- [ ] Textarea auto-resizes on input
- [ ] Enter key sends message
- [ ] Shift+Enter creates new line
- [ ] Suggestion chips are clickable
- [ ] Suggestion chips populate input field

### Messaging
- [ ] Can type and send messages
- [ ] User messages appear correctly
- [ ] User messages show correct avatar
- [ ] Thinking animation appears while waiting
- [ ] Thinking animation has bouncing dots
- [ ] AI responses stream in real-time
- [ ] AI responses are friendly and helpful
- [ ] AI uses emojis appropriately
- [ ] Messages scroll automatically
- [ ] Chat history persists on refresh
- [ ] Multiple messages in conversation work
- [ ] Context maintained across messages

### Model Selection
- [ ] Can switch between models
- [ ] Llama 3.3 70B works
- [ ] Llama 3.1 70B works
- [ ] Mixtral 8x7B works
- [ ] Gemma 2 9B works
- [ ] Model selection persists during session

### Error Handling
- [ ] Network error shows appropriate message
- [ ] Invalid API key shows error
- [ ] Server down shows error
- [ ] Empty message cannot be sent
- [ ] Long messages handled correctly

## Statistics View Tests

### Navigation
- [ ] Can switch to statistics view
- [ ] Statistics view loads correctly
- [ ] Can switch back to chat view
- [ ] Active nav button highlighted

### Stat Cards
- [ ] Total messages count correct
- [ ] Total tokens count correct
- [ ] AI responses count correct
- [ ] User messages count correct
- [ ] Stats update after new messages
- [ ] Refresh button works

### Charts
- [ ] Messages over time chart displays
- [ ] Line chart shows correct data
- [ ] Message distribution chart displays
- [ ] Doughnut chart shows user/AI split
- [ ] Model usage chart displays
- [ ] Bar chart shows model counts
- [ ] Charts are responsive
- [ ] Charts update on refresh

## Database Tests

### Data Persistence
- [ ] Users saved to database
- [ ] Messages saved to database
- [ ] Chat history loads correctly
- [ ] User can see own messages only
- [ ] Timestamps recorded correctly
- [ ] Token counts recorded

### Data Integrity
- [ ] Foreign key constraints work
- [ ] Unique constraints enforced
- [ ] No SQL injection vulnerabilities
- [ ] Password hashing works
- [ ] JWT tokens validated correctly

## Security Tests

### Authentication
- [ ] Cannot access chat without token
- [ ] Expired tokens rejected
- [ ] Invalid tokens rejected
- [ ] Password not stored in plain text
- [ ] JWT secret used correctly

### CORS
- [ ] CORS configured for localhost
- [ ] Cross-origin requests work
- [ ] Credentials included correctly

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] Long inputs handled safely
- [ ] Special characters handled correctly

## Performance Tests

### Response Time
- [ ] Login/register < 1 second
- [ ] Message send immediate
- [ ] Streaming starts quickly
- [ ] Statistics load < 2 seconds
- [ ] Chart rendering smooth

### Resource Usage
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Streaming doesn't block server
- [ ] Multiple users can chat simultaneously

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (responsive)

## Responsive Design

- [ ] Desktop (1920x1080) works
- [ ] Laptop (1366x768) works
- [ ] Tablet (768x1024) works
- [ ] Mobile (375x667) works
- [ ] Sidebar collapses on mobile
- [ ] Charts responsive on all sizes

## Edge Cases

- [ ] Very long messages (>1000 chars)
- [ ] Rapid message sending
- [ ] Network interruption during streaming
- [ ] Multiple browser tabs
- [ ] Browser refresh during chat
- [ ] Empty database (first user)
- [ ] Large chat history (100+ messages)

## Known Limitations

1. **API Rate Limits**: Groq API has rate limits - excessive requests may fail
2. **Token Limits**: Models have max token limits (8192 for most)
3. **Browser Storage**: localStorage has size limits (~5-10MB)
4. **Concurrent Users**: SQLite better-sqlite3 handles concurrency but has limits
5. **Streaming**: Some older browsers may not support Server-Sent Events

## Bug Reporting Template

```
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: 
- OS: 
- Node.js version: 
- Error messages: 

**Screenshots:**
[If applicable]
```

## Testing Notes

- Test with a valid Groq API key
- Monitor browser console for errors
- Check server logs for backend errors
- Test with different user accounts
- Clear localStorage between tests if needed
- Use browser DevTools Network tab to inspect API calls
- Check database file (chat.db) for data integrity
