# 🎯 Agent Day Switching Guide

This guide explains how to run different day agents (Day 1, Day 2, etc.) in your voice agent project.

## Overview

The project now supports multiple agent implementations:
- **Day 1**: Starter agent - Simple conversational assistant
- **Day 2**: Barista agent - Coffee shop order-taking agent (Zepto Cafe)

## How to Switch Between Agents

### Method 1: Using Start Scripts (Recommended)

#### Linux/Mac (Bash)
```bash
# Run Day 1 agent
./start_app.sh 1

# Run Day 2 agent (default)
./start_app.sh 2
# or simply
./start_app.sh
```

#### Windows (Batch)
```batch
REM Run Day 1 agent
start_app.bat 1

REM Run Day 2 agent (default)
start_app.bat 2
REM or simply
start_app.bat
```

### Method 2: Using Environment Variable

You can set the `AGENT_DAY` environment variable before running the agent:

#### Linux/Mac
```bash
# Run Day 1 agent
cd backend
AGENT_DAY=1 uv run python src/agent.py dev

# Run Day 2 agent
cd backend
AGENT_DAY=2 uv run python src/agent.py dev
```

#### Windows (Command Prompt)
```batch
REM Run Day 1 agent
cd backend
set AGENT_DAY=1
uv run python src/agent.py dev

REM Run Day 2 agent
cd backend
set AGENT_DAY=2
uv run python src/agent.py dev
```

#### Windows (PowerShell)
```powershell
# Run Day 1 agent
cd backend
$env:AGENT_DAY="1"
uv run python src/agent.py dev

# Run Day 2 agent
cd backend
$env:AGENT_DAY="2"
uv run python src/agent.py dev
```

### Method 3: Setting in .env.local

You can also set the agent day in your `.env.local` file:

```env
AGENT_DAY=1
```

or

```env
AGENT_DAY=2
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

## File Structure

```
backend/src/
├── agent.py          # Main entry point (switches between days)
├── agent_day1.py     # Day 1 starter agent implementation
├── agent_day2.py     # Day 2 barista agent implementation
└── order_state.py    # Order state management (used by Day 2)
```

## Adding New Day Agents

To add a new day agent (e.g., Day 3):

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
- Make sure you've set `AGENT_DAY` correctly (must be "1" or "2")
- Check that the agent file exists (`agent_day1.py` or `agent_day2.py`)
- Restart the backend after changing `AGENT_DAY`

### Import Errors
- Ensure all required dependencies are installed: `cd backend && uv sync`
- Check that the agent file has the correct `entrypoint` and `prewarm` functions

### Default Behavior
- If `AGENT_DAY` is not set, it defaults to Day 2 (barista agent)
- This maintains backward compatibility with existing setups

## Quick Reference

| Command | Agent |
|---------|-------|
| `./start_app.sh 1` | Day 1 Starter |
| `./start_app.sh 2` | Day 2 Barista (default) |
| `AGENT_DAY=1 uv run python src/agent.py dev` | Day 1 (manual) |
| `AGENT_DAY=2 uv run python src/agent.py dev` | Day 2 (manual) |

---

Happy coding! 🚀

