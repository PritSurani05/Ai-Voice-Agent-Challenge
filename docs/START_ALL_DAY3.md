# 🚀 Start All Services for Day 3

## Quick Start (3 Separate Terminals)

Since the automated script may have issues, please start services manually in **3 separate terminal windows**:

### Terminal 1: LiveKit Server
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
livekit-server --dev
```
**Keep this terminal open.** You should see LiveKit server logs.

### Terminal 2: Backend Agent (Day 3)
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
unset AGENT_DAY
uv run python src/agent.py dev
```
**Look for these logs:**
```
INFO   agent            AGENT_DAY environment variable: 3
INFO   agent            Loading Day 3 Agent...
INFO   agent            Starting Day 3 Agent...
INFO   livekit.agents   registered worker {"url": "ws://localhost:7880", ...}
```

### Terminal 3: Frontend
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/frontend"
pnpm dev
```
**Look for:**
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

## Verify Everything is Running

1. **LiveKit Server**: Check Terminal 1 - should show server running
2. **Backend**: Check Terminal 2 - should show "Day 3 Apollo Pharmacy Wellness Agent"
3. **Frontend**: Check Terminal 3 - should show "Ready" and localhost:3000
4. **Browser**: Open http://localhost:3000 - should show "Apollo Pharmacy"

## If Something Fails

### LiveKit Server Won't Start
- Check if port 7880 is already in use: `netstat -ano | grep :7880`
- Kill the process: `taskkill //F //PID <PID>`

### Backend Shows Day 2 Instead of Day 3
- Verify `backend/.env.local` has `AGENT_DAY=3`
- Make sure you ran `unset AGENT_DAY` before starting
- Restart the backend

### Frontend Shows "Zepto Cafe" Instead of "Apollo Pharmacy"
- Verify `frontend/.env.local` has `NEXT_PUBLIC_AGENT_DAY=3`
- Restart the frontend
- Hard refresh browser: `Ctrl + Shift + R`

## Stop All Services

Press `Ctrl+C` in each terminal window, or run:
```bash
./stop_all.sh
```

