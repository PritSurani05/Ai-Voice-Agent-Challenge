# 🏥 Switch to Day 3 - Apollo Pharmacy Wellness Agent

## Quick Switch Guide

### Option 1: Use Day 3 Startup Script (Easiest)

**Git Bash:**
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025"
chmod +x start_day3.sh
./start_day3.sh
```

**Windows CMD:**
```cmd
cd "C:\voice AI Challenge\ten-days-of-voice-agents-2025"
start_day3.bat
```

### Option 2: Manual Start (3 Terminals)

**Terminal 1 - LiveKit Server:**
```bash
livekit-server --dev
```

**Terminal 2 - Backend (Day 3):**
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/backend"
export AGENT_DAY=3
uv run python src/agent.py dev
```

**Terminal 3 - Frontend (Day 3):**
```bash
cd "/c/voice AI Challenge/ten-days-of-voice-agents-2025/frontend"
export NEXT_PUBLIC_AGENT_DAY=3
pnpm dev
```

### Option 3: Update .env.local Files

**Backend (`backend/.env.local`):**
```env
AGENT_DAY=3
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_AGENT_DAY=3
```

Then restart both services.

## What's Different in Day 3?

**Day 3 - Apollo Pharmacy Wellness Agent:**
- **Purpose:** Daily health & wellness check-ins
- **Features:**
  - Asks about mood and energy levels
  - Captures daily objectives/intentions
  - Provides supportive, realistic advice
  - Saves check-ins to `wellness_log.json`
  - References previous check-ins for continuity
- **Branding:** Apollo Pharmacy theme
- **Tools:** 
  - `capture_mood` - Records user's mood
  - `capture_energy_level` - Records energy level
  - `add_objective` - Adds daily objectives
  - `generate_summary` - Creates check-in summary
  - `save_check_in` - Saves to JSON file

## Verify It's Working

1. **Backend logs should show:**
   ```
   INFO   agent            Loading Day 3 Agent...
   INFO   Day 3 Apollo Pharmacy Wellness Agent connected to room
   ```

2. **Frontend should show:**
   - Apollo Pharmacy branding
   - Wellness-themed welcome screen
   - Different gradient colors

3. **Agent greeting:**
   - Should say: "Hello! Welcome to Apollo Pharmacy's wellness check-in..."

## Files Created

- `start_day3.sh` - Bash script for Day 3
- `start_day3.bat` - Windows script for Day 3
- `SWITCH_TO_DAY3.md` - This guide

## After Switching

1. **Stop Day 2 backend** (if running)
2. **Start Day 3 backend** using one of the methods above
3. **Refresh browser** at http://localhost:3000
4. **Test the wellness check-in** conversation

---

**Day 3 agent is ready! Use the startup scripts or manual commands above to switch.**

