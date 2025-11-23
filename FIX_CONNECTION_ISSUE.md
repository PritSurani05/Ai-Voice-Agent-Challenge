# 🔧 Fix Connection Issue

## Problem
- `ERR_CONNECTION_REFUSED` - WebSocket connection to `ws://localhost:7880` failed
- Content Security Policy blocking `http://localhost:7880` connections
- LiveKit server is NOT running

## Solution

### Step 1: Fixed Content Security Policy ✅
I've updated `frontend/next.config.ts` to allow `http://localhost:*` connections for local development.

### Step 2: Start LiveKit Server

**You need to start the LiveKit server in a separate terminal:**

```bash
livekit-server --dev
```

This will start the LiveKit server on port 7880.

### Step 3: Verify Backend is Running with Day 3

Make sure your backend is running with Day 3:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
# Stop current backend (Ctrl+C if running)
unset AGENT_DAY  # Ensure .env.local is used
uv run python src/agent.py dev
```

Look for these logs:
```
INFO   agent            AGENT_DAY environment variable: 3
INFO   agent            Loading Day 3 Agent...
```

### Step 4: Restart Frontend (to pick up CSP changes)

After fixing the CSP, restart the frontend:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/frontend"
# Stop current frontend (Ctrl+C if running)
pnpm dev
```

### Step 5: Hard Refresh Browser

After restarting the frontend, do a **hard refresh** in your browser:
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

This will clear the cached CSP headers.

## Quick Start All Services (Day 3)

If you want to start everything at once:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./start_day3.sh
```

Or manually in 3 separate terminals:

**Terminal 1 - LiveKit Server:**
```bash
livekit-server --dev
```

**Terminal 2 - Backend (Day 3):**
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
unset AGENT_DAY
uv run python src/agent.py dev
```

**Terminal 3 - Frontend:**
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/frontend"
pnpm dev
```

## Verify Everything is Working

1. ✅ LiveKit server running on port 7880
2. ✅ Backend shows "Day 3 Apollo Pharmacy Wellness Agent"
3. ✅ Frontend shows "Apollo Pharmacy" (not "Zepto Cafe")
4. ✅ No connection errors in browser console
5. ✅ Agent joins the room when you click "START CALL"

