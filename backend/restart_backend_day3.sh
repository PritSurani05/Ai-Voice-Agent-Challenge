#!/bin/bash
# Restart Backend for Day 3 - Ensures it reads from .env.local

echo "=========================================="
echo "Restarting Backend for Day 3"
echo "=========================================="
echo ""

# Navigate to backend directory
cd "$(dirname "$0")" || exit 1

# Source uv environment if available
if [ -f "$HOME/.local/bin/env" ]; then
    echo "Loading uv environment..."
    source "$HOME/.local/bin/env"
fi

# Check if uv is available
if ! command -v uv &> /dev/null; then
    echo "ERROR: uv is not installed or not in PATH"
    exit 1
fi

# Check .env.local
if [ ! -f ".env.local" ]; then
    echo "ERROR: .env.local not found!"
    exit 1
fi

# Verify AGENT_DAY in .env.local
AGENT_DAY_FROM_FILE=$(grep "^AGENT_DAY=" .env.local | cut -d'=' -f2)
if [ -z "$AGENT_DAY_FROM_FILE" ]; then
    echo "ERROR: AGENT_DAY not found in .env.local"
    exit 1
fi

echo "Found AGENT_DAY=$AGENT_DAY_FROM_FILE in .env.local"
echo ""

# IMPORTANT: Unset any shell AGENT_DAY to ensure .env.local is used
unset AGENT_DAY

echo "Starting backend agent worker (Day $AGENT_DAY_FROM_FILE)..."
echo "Look for: 'AGENT_DAY environment variable: $AGENT_DAY_FROM_FILE' in logs"
echo "Look for: 'Loading Day $AGENT_DAY_FROM_FILE Agent...' in logs"
echo "Press Ctrl+C to stop"
echo ""
echo "=========================================="
echo ""

# Start the agent (AGENT_DAY is unset, so it will read from .env.local)
uv run python src/agent.py dev

