# 🚀 Quick Start: Backend Agent Worker

## The Issue
Your backend agent worker is **not running**, which is why the agent never joins the room.

## Solution: Start the Backend

### Option 1: Use the Startup Script (Easiest)

Open a **new Git Bash terminal** and run:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./start_backend_now.sh 2
```

The `2` means Day 2 agent. Use `1` or `3` for other days.

### Option 2: Manual Start

Open a **new Git Bash terminal** and run:

```bash
# Navigate to backend
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"

# Load uv environment (if needed)
source $HOME/.local/bin/env

# Set which agent to use
export AGENT_DAY=2

# Start the backend
uv run python src/agent.py dev
```

## ✅ What Success Looks Like

When the backend starts successfully, you'll see:

```
INFO   livekit.agents   starting worker
INFO   livekit.agents   registered worker {"url": "ws://localhost:7880", ...}
```

This means the agent worker is **connected and ready**!

## 🔍 Verify It's Working

1. **Check the terminal** - you should see "registered worker" message
2. **Refresh your browser** at http://localhost:3000
3. **Click "Start call"** again
4. **Check browser console** - you should now see:
   - `isAgentAvailable: true` ✅
   - `participantsCount: 1` ✅ (agent joined!)

## ⚠️ Common Issues

### "uv: command not found"
```bash
source $HOME/.local/bin/env
```

### "failed to connect to livekit"
- Make sure LiveKit server is running: `livekit-server --dev`
- Check `backend/.env.local` has correct values:
  ```env
  LIVEKIT_URL=ws://localhost:7880
  LIVEKIT_API_KEY=devkey
  LIVEKIT_API_SECRET=secret
  ```

### Backend starts but agent doesn't join
- Check backend terminal for errors
- Verify API keys are set in `backend/.env.local`:
  - `MURF_API_KEY=...`
  - `GOOGLE_API_KEY=...`
  - `DEEPGRAM_API_KEY=...`

## 📝 Keep This Terminal Open

The backend agent worker needs to **keep running** in this terminal. Don't close it!

To stop it, press `Ctrl+C` in the terminal.

---

**Once the backend is running, your agent will automatically join rooms when the frontend creates them!** 🎉

