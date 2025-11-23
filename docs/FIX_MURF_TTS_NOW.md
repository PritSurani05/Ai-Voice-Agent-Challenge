# 🚨 URGENT: Fix Murf TTS Connection Issues

## Current Status

✅ **Murf API Key is set** in `backend/.env.local`
❌ **Murf TTS is failing** with connection errors and plugin bugs

## The Errors You're Seeing

1. **`APIConnectionError('Connection error.')`** - Can't connect to Murf API
2. **`AttributeError: 'BufferedWordStream' object has no attribute 'closed'`** - Bug in Murf plugin

## Immediate Fixes

### Fix 1: Update Murf Plugin

The `AttributeError` suggests a bug in the plugin. Try updating:

```bash
cd backend
uv sync --upgrade-package livekit-murf
```

Then restart the backend.

### Fix 2: Verify API Key is Valid

1. **Test your Murf API key:**
   - Go to https://murf.ai
   - Sign in
   - Check if your API key is still active
   - Generate a new key if needed

2. **Update `backend/.env.local`:**
   ```env
   MURF_API_KEY=your_new_key_here
   ```

3. **Restart backend:**
   ```bash
   # Stop backend (Ctrl+C)
   cd backend
   export AGENT_DAY=2
   uv run python src/agent.py dev
   ```

### Fix 3: Check Network Connection

The `APIConnectionError` might be network-related:

- Check your internet connection
- Try accessing https://api.murf.ai in a browser
- Check if firewall/proxy is blocking connections

### Fix 4: Check Backend Logs

Watch your backend terminal for detailed errors:

```bash
# Look for these patterns:
- "APIConnectionError"
- "failed to synthesize speech"
- "Connection error"
- "AttributeError"
```

## What's Happening

Based on your logs:
1. ✅ Agent receives user speech
2. ✅ LLM generates response (1.49s - normal)
3. ❌ **TTS fails** - Can't generate speech
4. ❌ Agent retries TTS (causing delays)
5. ❌ Eventually gives up or crashes

**This is why responses are slow or missing!**

## Expected Logs (When Working)

```
✅✅✅ User speech detected: Cappuccino
🤖 LLM response received (full response ready)
✅✅✅ Agent speech: Great choice! What size would you like?
```

**NOT:**
```
✅✅✅ User speech detected: Cappuccino
🤖 LLM response received
❌ Session error: APIConnectionError
WARNI failed to synthesize speech, retrying...
```

## Next Steps

1. **Update the Murf plugin** (Fix 1)
2. **Verify/regenerate API key** (Fix 2)
3. **Restart backend**
4. **Test again**
5. **Check backend logs** for TTS errors

If it still fails, the issue might be:
- Murf API service outage
- Plugin version incompatibility
- Network/firewall blocking Murf API

---

**The TTS failure is blocking all responses. Fix the Murf connection and responses will work!**

