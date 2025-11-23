# 🔧 Fixing Murf TTS Connection Issues

## The Problem

Your backend logs show:
1. **`APIConnectionError('Connection error.')`** - Murf TTS can't connect
2. **`AttributeError: 'BufferedWordStream' object has no attribute 'closed'`** - Bug in Murf plugin

This causes the agent to fail when trying to generate speech, leading to slow/no responses.

## Solutions

### Solution 1: Verify Murf API Key

**Check your `backend/.env.local` file:**

```env
MURF_API_KEY=your_actual_murf_api_key_here
```

**Common issues:**
- API key is missing or incorrect
- API key has expired
- API key doesn't have proper permissions
- Extra spaces or quotes around the key

**To get a new Murf API key:**
1. Go to https://murf.ai
2. Sign in to your account
3. Navigate to API section
4. Generate a new API key
5. Copy it to `backend/.env.local`

### Solution 2: Check Network/Firewall

The `APIConnectionError` suggests the backend can't reach Murf's API servers. Check:
- Internet connection is working
- Firewall isn't blocking outbound connections
- No proxy/VPN issues

### Solution 3: Update Murf Plugin

The `AttributeError` suggests a bug in the `livekit-murf` plugin. Try updating:

```bash
cd backend
uv sync --upgrade-package livekit-murf
```

### Solution 4: Check Backend Logs

Look at your backend terminal for detailed error messages:

```bash
# In your backend terminal, look for:
- "APIConnectionError"
- "failed to synthesize speech"
- "Session error"
```

## Quick Test

1. **Verify API key is set:**
   ```bash
   cd backend
   grep MURF_API_KEY .env.local
   ```

2. **Restart backend after fixing:**
   ```bash
   # Stop backend (Ctrl+C)
   # Then restart:
   cd backend
   export AGENT_DAY=2
   uv run python src/agent.py dev
   ```

3. **Test again:**
   - Go to http://localhost:3000
   - Click "Start call"
   - Speak to the agent
   - Check backend logs for TTS errors

## Expected Behavior

When working correctly, you should see in backend logs:
```
✅✅✅ User speech detected: ...
🤖 LLM response received
✅✅✅ Agent speech: ...
```

**NOT:**
```
❌ Session error: APIConnectionError
❌ failed to synthesize speech
```

## If Still Not Working

If Murf continues to fail, you can temporarily switch to a different TTS provider to test:

1. Check if other APIs (Deepgram, Google) are working
2. Consider using a different TTS provider temporarily
3. Contact Murf support if API key is correct but connection fails

---

**The main issue is the Murf TTS connection. Fix the API key or network issue, and responses should work!**

