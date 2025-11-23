# 🔄 Restart Backend & Check Logs

## Current Status

✅ **API Keys:** All set (MURF, GOOGLE, DEEPGRAM)
❌ **Backend:** Not running
❌ **Recent Errors:** Connection errors in logs

## Quick Restart (Recommended)

**Use the monitoring script:**

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./restart_backend_check_logs.sh 2
```

This script will:
- Check if backend is already running
- Verify API keys
- Start backend with error filtering
- Show only relevant logs (errors, TTS issues, etc.)

## Manual Restart

**Step 1: Open a new Git Bash terminal**

**Step 2: Navigate and start:**
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
source $HOME/.local/bin/env  # If uv not in PATH
export AGENT_DAY=2
uv run python src/agent.py dev
```

## What to Watch For

### ✅ Good Signs (Backend Working)

```
INFO   livekit.agents   starting worker
INFO   livekit.agents   registered worker {"url": "ws://localhost:7880", ...}
INFO   livekit.agents   received job request
INFO   agent            Loading Day 2 Agent...
INFO   Day 2 Barista Agent connected to room
✅✅✅ User speech detected: ...
🤖 LLM response received
✅✅✅ Agent speech: ...
```

### ❌ Bad Signs (Issues to Fix)

#### 1. Murf TTS Connection Error
```
ERROR Session error: APIConnectionError('Connection error.')
WARNI failed to synthesize speech, retrying...
```
**Fix:** Check Murf API key, network connection, or try regenerating API key

#### 2. Murf Plugin Bug
```
AttributeError: 'BufferedWordStream' object has no attribute 'closed'
```
**Fix:** Plugin bug - may need to wait for update or contact support

#### 3. Network Connection Error
```
ConnectionResetError: [WinError 64] The specified network name is no longer available
```
**Fix:** Check internet connection, firewall, or LiveKit server status

#### 4. API Key Invalid
```
401 Unauthorized
Invalid API key
```
**Fix:** Verify API keys in `backend/.env.local` are correct

## After Restarting

1. **Wait 10-15 seconds** for backend to register
2. **Check for:** `registered worker` message
3. **Refresh browser** at http://localhost:3000
4. **Click "Start call"**
5. **Watch backend logs** for:
   - Job received
   - Agent connected
   - User speech detected
   - LLM response
   - Agent speech (or TTS errors)

## Testing TTS

**Speak to the agent and watch logs:**

**If working:**
```
✅✅✅ User speech detected: hello
🤖 LLM response received
✅✅✅ Agent speech: Hi! Welcome to Zepto Cafe...
```

**If TTS failing:**
```
✅✅✅ User speech detected: hello
🤖 LLM response received
❌ Session error: APIConnectionError
WARNI failed to synthesize speech
```

## Quick Diagnostic Commands

**Check if backend is running:**
```bash
ps aux | grep "python.*agent" | grep -v grep
```

**View recent errors:**
```bash
tail -n 100 backend.log | grep -i "error\|failed\|tts\|murf"
```

**Check API key format:**
```bash
grep -E "MURF_API_KEY|GOOGLE_API_KEY|DEEPGRAM_API_KEY" backend/.env.local
```

---

**Restart the backend now and watch the logs for TTS errors!**

