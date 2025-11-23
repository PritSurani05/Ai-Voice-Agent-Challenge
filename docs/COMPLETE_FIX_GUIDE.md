# 🔧 Complete Fix Guide - Agent Not Responding

## Current Issues

1. **Agent not joining room** - `isAgentAvailable: false`
2. **Murf TTS connection errors** - `APIConnectionError`
3. **Murf plugin bug** - `AttributeError: 'BufferedWordStream' object has no attribute 'closed'`

## Step-by-Step Fix

### Step 1: Verify Backend is Running

**Check if backend process is running:**
```bash
# In Git Bash, check for Python processes
ps aux | grep "python.*agent" | grep -v grep
```

**If not running, start it:**
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./start_backend_now.sh 2
```

**Look for this message:**
```
INFO   livekit.agents   registered worker {"url": "ws://localhost:7880", ...}
```

### Step 2: Update Murf Plugin

The `AttributeError` is a bug in the plugin. Update it:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
uv sync --upgrade-package livekit-murf
```

### Step 3: Verify API Keys

**Check `backend/.env.local` has all keys:**
```env
MURF_API_KEY=ap2_04640bae-87ae-4119-a3d4-d2ca83a9ccda
GOOGLE_API_KEY=your_google_key
DEEPGRAM_API_KEY=your_deepgram_key
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
AGENT_DAY=2
```

### Step 4: Restart Backend

**After updating plugin/keys:**
```bash
# Stop backend (Ctrl+C in backend terminal)
# Then restart:
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
export AGENT_DAY=2
uv run python src/agent.py dev
```

### Step 5: Test Connection

1. **Wait for backend to register:**
   - Look for: `registered worker` message
   - Should happen within 10-15 seconds

2. **Open browser:**
   - Go to http://localhost:3000
   - **Refresh the page** (important!)
   - Click "Start call"

3. **Check browser console:**
   - Should see: `isAgentAvailable: true`
   - Should see: `participantsCount: 1`

4. **Check backend terminal:**
   - Should see: `received job request`
   - Should see: `Day 2 Barista Agent connected to room`
   - Should NOT see: `APIConnectionError` or `AttributeError`

## What Success Looks Like

**Backend logs:**
```
INFO   livekit.agents   registered worker
INFO   livekit.agents   received job request
INFO   agent            Loading Day 2 Agent...
INFO   Day 2 Barista Agent connected to room
✅✅✅ User speech detected: ...
🤖 LLM response received
✅✅✅ Agent speech: ...
```

**Browser console:**
```
Room connected!
Agent detection: {isAgentAvailable: true, participantsCount: 1, ...}
```

## If Still Not Working

### Check Backend Logs for Errors

Look for:
- ❌ `APIConnectionError` - Murf API issue
- ❌ `AttributeError` - Plugin bug
- ❌ `failed to connect` - LiveKit server issue
- ❌ `401 Unauthorized` - API key invalid

### Common Issues

1. **Backend not running** - Start it first!
2. **Backend crashed** - Check for errors, restart
3. **API keys invalid** - Verify all keys are correct
4. **Network issues** - Check internet connection
5. **Murf plugin bug** - May need to wait for plugin update

## Quick Diagnostic

Run this to check everything:
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./check_agent_connection.sh
```

---

**Priority: Make sure backend is running and registered before testing!**

