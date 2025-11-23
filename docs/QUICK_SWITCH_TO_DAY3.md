# 🏥 Quick Switch to Day 3 Agent

## ✅ Day 3 Agent is Ready!

The **Apollo Pharmacy Wellness Agent** is already implemented and ready to use.

## 🚀 Quick Start (Git Bash)

**Stop your current Day 2 backend** (Ctrl+C), then:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
./start_day3.sh
```

**OR** restart just the backend:

```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
export AGENT_DAY=3
uv run python src/agent.py dev
```

And update frontend:
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/frontend"
export NEXT_PUBLIC_AGENT_DAY=3
pnpm dev
```

## 📋 What Day 3 Agent Does

**Apollo Pharmacy Wellness Agent:**
- Conducts daily wellness check-ins
- Asks about mood and energy levels
- Captures daily objectives/intentions
- Provides supportive, realistic advice
- Saves check-ins to `backend/wellness_log.json`
- References previous check-ins for continuity

## 🔍 Verify It's Working

**Backend logs should show:**
```
INFO   agent            Loading Day 3 Agent...
INFO   Day 3 Apollo Pharmacy Wellness Agent connected to room
```

**Frontend should show:**
- Apollo Pharmacy branding
- Wellness-themed welcome screen
- Different gradient (apollo-gradient)

**Agent greeting:**
- "Hello! Welcome to Apollo Pharmacy's wellness check-in. I'm here to help you with your daily wellness reflection. How are you feeling today?"

## 📝 Files Created

- `start_day3.sh` - Start all services for Day 3
- `start_day3.bat` - Windows version
- `SWITCH_TO_DAY3.md` - Detailed guide

---

**Ready to switch? Stop Day 2 backend and start Day 3!**

