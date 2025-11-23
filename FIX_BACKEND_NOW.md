# ⚡ FIX: Start Backend Agent Worker NOW

## 🎯 The Problem
Your backend agent worker is **NOT RUNNING**, so the agent never joins the room.

## ✅ The Solution

**Open a NEW Git Bash terminal** and run this command:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./start_backend_now.sh 2
```

**OR** run these commands manually:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
source $HOME/.local/bin/env
export AGENT_DAY=2
uv run python src/agent.py dev
```

## 🔍 What You Should See

When it starts successfully, you'll see:

```
INFO   livekit.agents   starting worker
INFO   livekit.agents   registered worker {"url": "ws://localhost:7880", ...}
```

**This means it's working!** ✅

## 📋 After Starting

1. **Keep the terminal open** (don't close it!)
2. **Go to your browser** at http://localhost:3000
3. **Refresh the page**
4. **Click "Start call"**
5. **Check browser console** - you should see:
   - `isAgentAvailable: true` ✅
   - `participantsCount: 1` ✅

## ⚠️ If It Doesn't Work

### Error: "uv: command not found"
```bash
source $HOME/.local/bin/env
```

### Error: "failed to connect"
- Make sure LiveKit server is running
- Check `backend/.env.local` has:
  ```env
  LIVEKIT_URL=ws://localhost:7880
  LIVEKIT_API_KEY=devkey
  LIVEKIT_API_SECRET=secret
  ```

---

**The backend MUST be running for the agent to join rooms!**

