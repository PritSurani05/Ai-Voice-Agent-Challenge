# 🚀 How to Start the Backend Agent Worker

## The Problem

Your frontend is connecting to the room, but the agent never joins because **the backend agent worker is not running**.

## Quick Fix (Git Bash)

Open a **new terminal window** (Git Bash) and run:

```bash
# Navigate to project
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"

# Set which agent to use (1, 2, or 3)
export AGENT_DAY=2

# Start the backend agent worker
uv run python src/agent.py dev
```

## What to Look For

When the backend starts successfully, you should see:

```
INFO   livekit.agents   starting worker
INFO   livekit.agents   registered worker {"url": "ws://localhost:7880", ...}
```

This means the agent worker is **connected and ready** to join rooms.

## After Starting Backend

1. **Refresh your browser** at http://localhost:3000
2. **Click "Start call"** again
3. **Check browser console** - you should now see:
   - `isAgentAvailable: true`
   - `participantsCount: 1` (the agent joined!)

## Verify It's Working

Run the diagnostic script:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./check_agent_connection.sh
```

It will show you if all services are running correctly.

## Troubleshooting

### Error: "uv: command not found"
```bash
# Add uv to PATH
source $HOME/.local/bin/env
# Then try again
```

### Error: "failed to connect to livekit"
- Make sure LiveKit server is running: `livekit-server --dev`
- Check `backend/.env.local` has:
  ```env
  LIVEKIT_URL=ws://localhost:7880
  LIVEKIT_API_KEY=devkey
  LIVEKIT_API_SECRET=secret
  ```

### Backend starts but agent doesn't join
- Check backend logs for errors
- Make sure API keys are set in `backend/.env.local`:
  - `MURF_API_KEY`
  - `GOOGLE_API_KEY`
  - `DEEPGRAM_API_KEY`

## All Services Should Be Running

You need **3 terminals** running:

1. **Terminal 1** - LiveKit Server:
   ```bash
   livekit-server --dev
   ```

2. **Terminal 2** - Backend Agent:
   ```bash
   cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
   export AGENT_DAY=2
   uv run python src/agent.py dev
   ```

3. **Terminal 3** - Frontend:
   ```bash
   cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/frontend"
   pnpm dev
   ```

Or use the convenience script to start all at once:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./start_app.sh 2
```

