#!/bin/bash
# Restart backend with Day 3 agent

cd "$(dirname "$0")"

echo "🛑 Stopping any existing backend processes..."
pkill -f "python.*agent.py" || pkill -f "uv.*agent" || true
sleep 2

echo "✅ Starting backend with Day 3 agent..."
echo "   (Make sure AGENT_DAY=3 is set in backend/.env.local)"
echo ""

export AGENT_DAY=3
uv run python src/agent.py dev

