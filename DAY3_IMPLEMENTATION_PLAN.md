# Day 3 Implementation Plan - Health & Wellness Voice Companion

## Overview

Build a supportive, non-medical health & wellness voice companion that conducts daily check-ins, captures mood/energy/goals, and persists data to JSON for reference in future sessions.

---

## Requirements Summary

### Primary Goal (Required)

1. **Daily Check-ins**:
   - Ask about mood and energy
   - Ask about daily intentions/goals (1-3 things)
   - Offer simple, realistic advice
   - Close with recap and confirmation

2. **JSON Persistence**:
   - Save each check-in to `wellness_log.json`
   - Include: date/time, mood, objectives, optional summary
   - Read previous entries and reference them in new sessions

3. **Behavior**:
   - Supportive, non-medical, non-diagnostic
   - Grounded and realistic
   - References past check-ins (e.g., "Last time you mentioned low energy. How does today compare?")

### Advanced Goals (Optional - Future Enhancement)

- MCP integration (Notion, Todoist, or Zapier)
- Weekly reflection using JSON history
- Follow-up reminders via MCP tools

---

## Implementation Steps

### Step 1: Create Wellness State Management (`backend/src/wellness_state.py`)

**Purpose**: Define data structures for wellness check-ins, similar to `order_state.py` for Day 2.

**Components**:
- `WellnessCheckIn` dataclass:
  - `date_time: str` - ISO format timestamp
  - `mood: Optional[str]` - Text description of mood
  - `energy_level: Optional[str]` - Energy level (e.g., "high", "medium", "low", or numeric scale)
  - `objectives: list[str]` - List of 1-3 daily goals/intentions
  - `summary: Optional[str]` - Agent-generated summary sentence
  - `session_id: Optional[str]` - Optional session identifier

- `WellnessLog` class:
  - Manages reading/writing to `wellness_log.json`
  - Methods:
    - `load_log() -> list[dict]` - Read all entries from JSON
    - `save_check_in(check_in: WellnessCheckIn)` - Append new entry
    - `get_recent_entries(days: int = 7) -> list[dict]` - Get recent entries for context
    - `get_last_entry() -> Optional[dict]` - Get most recent entry for comparison

**File Location**: `backend/src/wellness_state.py`

---

### Step 2: Create Day 3 Agent (`backend/src/agent_day3.py`)

**Purpose**: Main agent implementation for Day 3 wellness companion.

**Structure** (similar to `agent_day2.py`):

1. **Imports**:
   - Standard LiveKit agents imports
   - Import `WellnessCheckIn` and `WellnessLog` from `wellness_state.py`

2. **Userdata Class**:
   ```python
   @dataclass
   class Userdata:
       check_in: WellnessCheckIn
       wellness_log: WellnessLog
   ```

3. **WellnessAgent Class**:
   - **Instructions**: Supportive, grounded wellness companion persona
     - Non-medical, non-diagnostic language
     - Ask about mood and energy naturally
     - Ask about 1-3 daily objectives
     - Offer simple, realistic advice
     - Always close with recap and confirmation
     - Reference previous check-ins when available

4. **Function Tools** (7 tools):
   - `capture_mood(ctx, mood: str) -> str`
     - Store mood in check-in state
     - Return acknowledgment
   
   - `capture_energy_level(ctx, energy: str) -> str`
     - Store energy level in check-in state
     - Return acknowledgment
   
   - `add_objective(ctx, objective: str) -> str`
     - Add objective to check-in (can be called multiple times)
     - Return acknowledgment, ask if more objectives
   
   - `check_check_in_status(ctx) -> str`
     - Check what information is still needed
     - Return status of current check-in
   
   - `get_previous_check_ins(ctx, days: int = 7) -> str`
     - Load recent entries from JSON
     - Return formatted summary for agent context
   
   - `generate_summary(ctx) -> str`
     - Generate a brief summary of the check-in
     - Store in check-in state
   
   - `save_check_in(ctx) -> str`
     - Save completed check-in to JSON
     - Return confirmation with recap

5. **Entry Point**:
   - Initialize `WellnessLog` and load previous entries
   - Create initial `WellnessCheckIn` with current timestamp
   - Set up agent session (same pipeline as Day 2)
   - Provide context from previous check-ins in initial greeting

6. **Prewarm Function**:
   - Load VAD model
   - Initialize wellness log

**File Location**: `backend/src/agent_day3.py`

---

### Step 3: Update Main Agent File (`backend/src/agent.py`)

**Purpose**: Add Day 3 support to the main agent switcher.

**Changes Needed**:
1. Check if `agent.py` has day switching logic (may need to add it)
2. Add Day 3 import and routing:
   ```python
   AGENT_DAY = os.getenv("AGENT_DAY", "2")  # Default to Day 2
   
   if AGENT_DAY == "3":
       logger.info("Loading Day 3 Wellness Agent...")
       try:
           from .agent_day3 import entrypoint, prewarm
       except ImportError:
           from agent_day3 import entrypoint, prewarm
   ```

**Note**: If `agent.py` is currently just Day 2 code, we may need to refactor it to support switching, or create a new entry point pattern.

---

### Step 4: Update Start Scripts

**Files to Update**:
- `start_app.bat` (Windows)
- `start_app.sh` (Linux/Mac, if exists)

**Changes**:
- Accept day parameter: `start_app.bat 3`
- Set `AGENT_DAY=3` environment variable before starting backend

---

### Step 5: Create JSON Storage Directory

**Location**: `backend/wellness_logs/` (or root `wellness_log.json`)

**Structure**: Single JSON file with array of check-in objects:
```json
[
  {
    "date_time": "2025-01-15T10:30:00",
    "mood": "feeling good, a bit anxious about work",
    "energy_level": "medium",
    "objectives": [
      "Finish the project report",
      "Go for a 30-minute walk",
      "Call my mom"
    ],
    "summary": "User is feeling good but has some work anxiety. Focused on completing project report, staying active, and connecting with family."
  },
  ...
]
```

---

## File Structure

```
backend/
  src/
    agent.py              # Main entry (needs Day 3 routing)
    agent_day1.py         # Day 1 starter agent
    agent_day2.py         # Day 2 barista agent
    agent_day3.py         # Day 3 wellness agent (NEW)
    wellness_state.py     # Wellness state management (NEW)
    order_state.py        # Day 2 order state (existing)
  wellness_logs/         # Directory for wellness logs (NEW)
    wellness_log.json     # Main wellness log file
```

---

## Key Implementation Details

### 1. Agent Instructions Template

```
You are a supportive, grounded health and wellness companion. Your role is to:
- Conduct daily check-ins about mood and energy
- Help users set 1-3 realistic daily objectives
- Offer simple, actionable advice (non-medical, non-diagnostic)
- Always close with a recap and confirmation

IMPORTANT GUIDELINES:
- Never provide medical advice or diagnoses
- Keep advice small, actionable, and realistic
- Be supportive but not overly optimistic
- Reference previous check-ins when available
- Ask about mood and energy naturally in conversation
- Help users break large goals into smaller steps
- Encourage self-care activities (rest, exercise, hobbies)

CONVERSATION FLOW:
1. Greet warmly and reference previous check-in if available
2. Ask about mood and energy (use capture_mood and capture_energy_level tools)
3. Ask about 1-3 daily objectives (use add_objective tool)
4. Offer simple, realistic advice based on what they shared
5. Generate a summary (use generate_summary tool)
6. Close with recap and confirmation (use save_check_in tool)

Always use the function tools to capture information. Check check_in_status to see what's still needed.
```

### 2. Wellness Log Context Loading

On session start:
- Load `wellness_log.json`
- Get last entry (if exists)
- Format context for agent:
  ```
  "Last check-in was on [date]. You mentioned: [mood summary]. Your objectives were: [objectives]. How does today compare?"
  ```

### 3. Check-in Completion Flow

1. Agent asks about mood → `capture_mood()`
2. Agent asks about energy → `capture_energy_level()`
3. Agent asks about objectives → `add_objective()` (1-3 times)
4. Agent offers advice (conversational, no tool needed)
5. Agent generates summary → `generate_summary()`
6. Agent recaps → `save_check_in()` (saves to JSON)

### 4. Error Handling

- Handle missing `wellness_log.json` (create new file)
- Handle corrupted JSON (backup and create new)
- Validate check-in data before saving
- Handle empty previous entries gracefully

---

## Testing Checklist

- [ ] Agent greets and asks about mood
- [ ] Agent asks about energy level
- [ ] Agent asks about daily objectives (1-3)
- [ ] Agent offers realistic advice
- [ ] Agent generates summary
- [ ] Agent recaps and confirms
- [ ] Check-in saved to `wellness_log.json`
- [ ] Next session references previous check-in
- [ ] JSON file structure is correct
- [ ] Multiple check-ins accumulate in JSON
- [ ] Agent handles missing JSON file
- [ ] Agent handles empty previous entries

---

## Next Steps

1. ✅ Create `wellness_state.py` with data structures
2. ✅ Create `agent_day3.py` with wellness agent
3. ✅ Update `agent.py` to support Day 3
4. ✅ Update start scripts
5. ✅ Test the implementation
6. ✅ Verify JSON persistence works
7. ✅ Test multi-session context referencing

---

## Advanced Goals (Future - Not Required for Day 3)

These can be implemented later if time permits:

1. **MCP Integration**: Connect to Notion/Todoist/Zapier
   - Create tasks from objectives
   - Log check-ins to external systems

2. **Weekly Reflection**: Analyze JSON history
   - Mood trends over time
   - Goal completion rates
   - Simple insights

3. **Follow-up Reminders**: Use MCP to schedule reminders
   - Calendar events for self-care activities
   - Task reminders

---

## Success Criteria

✅ Primary Goal Complete When:
- Agent conducts daily check-ins via voice
- Captures mood, energy, and objectives
- Offers simple, realistic advice
- Saves to JSON file
- References previous check-ins in new sessions
- Closes with recap and confirmation

---

Ready to implement? The plan is structured to follow the same patterns as Day 2, making it straightforward to build.

