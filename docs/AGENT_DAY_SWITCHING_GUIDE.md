# 🎯 Agent Day Switching Guide

This guide explains how to run different day agents (Day 1 through Day 5) in your voice agent project.

## Overview

The project now supports multiple agent implementations:
- **Day 1**: Starter agent - Simple conversational assistant
- **Day 2**: Barista agent - Coffee shop order-taking agent (Zepto Cafe)
- **Day 3**: Wellness coach - Apollo Pharmacy style health assistant
- **Day 4**: Teach-the-tutor coach - Physics Wallah themed study buddy
- **Day 5**: Razorpay SDR - FAQ-grounded sales rep with lead capture

## How to Switch Between Agents

### Method 1: Using Start Scripts (Recommended)

#### Linux/Mac (Bash)
```bash
# Run any agent day (default 2)
./start_app.sh 1   # Day 1
./start_app.sh 2   # Day 2 (default)
./start_app.sh 3   # Day 3 Wellness
./start_app.sh 4   # Day 4 Tutor
./start_app.sh 5   # Day 5 Razorpay
```

#### Windows (Batch)
```batch
REM Run any agent day (default 2)
start_app.bat 1   REM Day 1
start_app.bat 2   REM Day 2 (default)
start_app.bat 3   REM Day 3 Wellness
start_app.bat 4   REM Day 4 Tutor
start_app.bat 5   REM Day 5 Razorpay
```

### Method 2: Using Environment Variable

You can set the `AGENT_DAY` environment variable before running the agent:

#### Linux/Mac
```bash
cd backend
AGENT_DAY=1 uv run python src/agent.py dev   # Day 1
AGENT_DAY=2 uv run python src/agent.py dev   # Day 2
AGENT_DAY=3 uv run python src/agent.py dev   # Day 3
AGENT_DAY=4 uv run python src/agent.py dev   # Day 4
AGENT_DAY=5 uv run python src/agent.py dev   # Day 5
```

#### Windows (Command Prompt)
```batch
cd backend
set AGENT_DAY=1
uv run python src/agent.py dev
set AGENT_DAY=2
uv run python src/agent.py dev
set AGENT_DAY=3
uv run python src/agent.py dev
set AGENT_DAY=4
uv run python src/agent.py dev
set AGENT_DAY=5
uv run python src/agent.py dev
```

#### Windows (PowerShell)
```powershell
cd backend
$env:AGENT_DAY="1"; uv run python src/agent.py dev
$env:AGENT_DAY="2"; uv run python src/agent.py dev
$env:AGENT_DAY="3"; uv run python src/agent.py dev
$env:AGENT_DAY="4"; uv run python src/agent.py dev
$env:AGENT_DAY="5"; uv run python src/agent.py dev
```

### Method 3: Setting in .env.local

You can also set the agent day in your `.env.local` file:

```
AGENT_DAY=1  # or 2,3,4,5
```

## Agent Descriptions

### Day 1: Starter Agent
- **Type**: Simple conversational assistant
- **Features**:
  - Basic voice conversation
  - Friendly and helpful responses
  - No special tools or order management
- **Use Case**: Testing basic voice agent functionality

### Day 2: Barista Agent
- **Type**: Coffee shop order-taking agent
- **Features**:
  - Takes coffee orders via voice
  - Manages order state (drink type, size, milk, extras, name)
  - Saves orders to JSON files
  - HTML receipt display (frontend)
- **Use Case**: Demonstrating function tools and order management

### Day 3: Wellness Coach
- **Type**: Apollo Pharmacy inspired wellness consultant
- **Features**:
  - Health triage conversation flow
  - Symptom + medication tracking
  - Session summary cards in UI
- **Use Case**: Showcases empathetic flows and structured guidance

### Day 4: Teach-the-Tutor
- **Type**: Active recall study buddy
- **Features**:
  - Loads concept deck from `shared-data/day4_tutor_content.json`
  - Runs learn → quiz → teach-back loop
  - Tracks mastery per concept
- **Use Case**: Demonstrates curriculum-driven agents

### Day 5: Razorpay SDR
- **Type**: Sales development rep with FAQ grounding
- **Features**:
  - Razorpay knowledge base + FAQ search
  - Lead field capture + JSON snapshots
  - End-of-call summary surfaced in UI
- **Use Case**: Simulates SDR workflows + CRM handoff

## File Structure

```
backend/src/
├── agent.py          # Main entry point (switches between days)
├── agent_day1.py     # Day 1 starter agent implementation
├── agent_day2.py     # Day 2 barista agent implementation
├── agent_day3.py     # Day 3 wellness agent
├── agent_day4.py     # Day 4 tutor agent
├── agent_day5.py     # Day 5 Razorpay SDR agent
├── order_state.py    # Order state management (used by Day 2)
└── lead_state.py     # Lead capture (used by Day 5)
```

## Adding New Day Agents

To add another day agent:

1. Create `backend/src/agent_day3.py` with your agent implementation
2. Update `backend/src/agent.py` to import and use the new agent:
   ```python
   elif AGENT_DAY == "3":
       logger.info("Loading Day 3 Agent...")
       try:
           from .agent_day3 import entrypoint, prewarm
       except ImportError:
           from agent_day3 import entrypoint, prewarm
   ```
3. Update the start scripts to accept "3" as a valid day option

## Troubleshooting

### Agent Not Switching
- Make sure you've set `AGENT_DAY` correctly (must be "1" through "5")
- Check that the agent file exists (`agent_dayN.py`)
- Restart the backend after changing `AGENT_DAY`

### Import Errors
- Ensure all required dependencies are installed: `cd backend && uv sync`
- Check that the agent file has the correct `entrypoint` and `prewarm` functions

### Default Behavior
- If `AGENT_DAY` is not set, it defaults to Day 2 (barista agent)
- Frontend also defaults to Day 2 unless `NEXT_PUBLIC_AGENT_DAY` is set

## Quick Reference

| Command | Agent |
|---------|-------|
| `./start_app.sh 1` | Day 1 Starter |
| `./start_app.sh 2` | Day 2 Barista (default) |
| `./start_app.sh 3` | Day 3 Wellness |
| `./start_app.sh 4` | Day 4 Tutor |
| `./start_app.sh 5` | Day 5 Razorpay |
| `AGENT_DAY=1 uv run python src/agent.py dev` | Day 1 (manual) |
| `AGENT_DAY=2 uv run python src/agent.py dev` | Day 2 (manual) |
| `AGENT_DAY=3 uv run python src/agent.py dev` | Day 3 (manual) |
| `AGENT_DAY=4 uv run python src/agent.py dev` | Day 4 (manual) |
| `AGENT_DAY=5 uv run python src/agent.py dev` | Day 5 (manual) |

---

Happy coding! 🚀

