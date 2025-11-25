#!/bin/bash
# Start Backend Agent Worker - Run this in Git Bash

echo "=========================================="
echo "Starting Backend Agent Worker"
echo "=========================================="
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

# Source uv environment if available
if [ -f "$HOME/.local/bin/env" ]; then
    echo "Loading uv environment..."
    source "$HOME/.local/bin/env"
fi

# Check if uv is available
if ! command -v uv &> /dev/null; then
    echo "ERROR: uv is not installed or not in PATH"
    echo "Please run: source \$HOME/.local/bin/env"
    exit 1
fi

# Set agent day (default to 5 for Day 5 Razorpay SDR)
export AGENT_DAY=${1:-5}
if [ "$AGENT_DAY" != "1" ] && [ "$AGENT_DAY" != "2" ] && [ "$AGENT_DAY" != "3" ] && [ "$AGENT_DAY" != "4" ] && [ "$AGENT_DAY" != "5" ]; then
    echo "Invalid AGENT_DAY: $AGENT_DAY (use 1, 2, 3, 4, or 5)"
    exit 1
fi
echo "Using AGENT_DAY=$AGENT_DAY"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "WARNING: .env.local not found!"
    echo "Please create it from .env.example"
    exit 1
fi

echo "Starting backend agent worker..."
echo "Look for: 'registered worker' to confirm connection"
echo "Press Ctrl+C to stop"
echo ""
echo "=========================================="
echo ""

# Start the agent
uv run python src/agent.py dev

