# Agent Connection Troubleshooting Guide

## Problem: Agent Not Joining Room

**Symptoms:**
- Frontend connects successfully to LiveKit
- Room state shows `connected: true`
- But `isAgentAvailable: false` and `participantsCount: 0`
- Agent never joins the room

**Root Cause:**
The backend agent worker is not connected to the LiveKit server, so it cannot join rooms when they are created.

## Solution Steps

### Step 1: Verify LiveKit Server is Running

Check that LiveKit server is running on port 7880:
```bash
# Check if port 7880 is in use
netstat -an | findstr :7880
# Or on Linux/Mac:
lsof -i :7880
```

If not running, start it:
```bash
livekit-server --dev
```

### Step 2: Verify Backend Agent Worker is Running

Check that the backend agent process is running:
```bash
# Windows: Check for Python processes running agent.py
tasklist | findstr python
# Or check the backend terminal window
```

If not running, start it:
```bash
cd backend
set AGENT_DAY=2  # or 1, 3 depending on which agent you want
uv run python src/agent.py dev
```

### Step 3: Check Backend Configuration

The backend `.env.local` file must have these variables for local development:

```env
# For local LiveKit server (dev mode)
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret

# API keys for the agent
MURF_API_KEY=your_murf_key
GOOGLE_API_KEY=your_google_key
DEEPGRAM_API_KEY=your_deepgram_key

# Which agent to use (1, 2, or 3)
AGENT_DAY=2
```

**Important:** For local development with `livekit-server --dev`, use:
- `LIVEKIT_URL=ws://localhost:7880` (or `http://localhost:7880`)
- `LIVEKIT_API_KEY=devkey`
- `LIVEKIT_API_SECRET=secret`

### Step 4: Check Backend Logs

Look for these messages in the backend logs:

✅ **Good signs:**
```
INFO   livekit.agents   starting worker
INFO   livekit.agents   registered worker {"url": "ws://localhost:7880", ...}
INFO   livekit.agents   job accepted
```

❌ **Bad signs:**
```
WARNI livekit.agents   failed to connect to livekit, retrying
ConnectionRefusedError
```

### Step 5: Restart Services in Order

If the agent worker can't connect, restart services in this order:

1. **Stop all services** (Ctrl+C in each terminal)
2. **Start LiveKit server first:**
   ```bash
   livekit-server --dev
   ```
   Wait 2-3 seconds for it to fully start

3. **Start backend agent:**
   ```bash
   cd backend
   set AGENT_DAY=2
   uv run python src/agent.py dev
   ```
   Wait for "registered worker" message

4. **Start frontend:**
   ```bash
   cd frontend
   pnpm dev
   ```

### Step 6: Verify Agent Registration

Once the backend starts, you should see in the logs:
```
INFO   livekit.agents   registered worker {"agent_name": "", "url": "ws://localhost:7880", ...}
```

If you see this, the agent worker is connected and ready to join rooms.

### Step 7: Test Room Connection

1. Open http://localhost:3000
2. Click "Start call"
3. Check browser console - should see:
   - `Room connected!`
   - `Agent detection: {roomState: 'connected', isAgentAvailable: true, ...}`
4. Check backend logs - should see:
   - `job accepted`
   - `Day X Agent connected to room`
   - `Remote participants in room: 1`

## Common Issues

### Issue: "ConnectionRefusedError"
**Cause:** LiveKit server not running or wrong URL
**Fix:** 
- Verify server is running: `livekit-server --dev`
- Check `LIVEKIT_URL` in backend `.env.local` is `ws://localhost:7880`

### Issue: "401 Unauthorized"
**Cause:** Wrong API key/secret
**Fix:** For local dev, use `devkey`/`secret` in backend `.env.local`

### Issue: Agent registers but doesn't join rooms
**Cause:** Agent name mismatch or room config issue
**Fix:** 
- For local dev, use empty agent name: `agent_name: ""` in frontend
- Check backend `AGENT_DAY` matches what you expect

### Issue: Agent joins but doesn't respond
**Cause:** Missing API keys (Deepgram, Google, Murf)
**Fix:** Add valid API keys to backend `.env.local`

## Quick Diagnostic Commands

```bash
# Check if LiveKit server is running
netstat -an | findstr :7880

# Check backend process
tasklist | findstr python

# View recent backend logs
tail -n 50 backend.log

# Test LiveKit server connection
curl http://localhost:7880
```

## Still Not Working?

1. **Check all three services are running:**
   - LiveKit server (port 7880)
   - Backend agent worker
   - Frontend (port 3000)

2. **Verify environment variables:**
   - Backend `.env.local` has correct LiveKit URL/keys
   - Frontend `.env.local` has correct LiveKit URL/keys

3. **Check firewall:** Ports 7880 and 3000 should be open

4. **Restart everything:** Stop all services and restart in order

5. **Check logs:** Look for errors in:
   - Backend terminal/logs
   - Frontend browser console
   - LiveKit server output

