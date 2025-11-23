# Day 3: Health & Wellness Voice Companion - LinkedIn Content Summary

## 🎯 Challenge Overview
Built a **Health & Wellness Voice Companion** as part of Day 3 of the **Murf AI Voice Agent Challenge** (#10DaysofAIVoiceAgents). The agent acts as a supportive, grounded companion that conducts daily wellness check-ins with users.

---

## 🚀 What We Built Today

### **Core Features Implemented:**

1. **Daily Wellness Check-In System**
   - Voice-based conversations about mood and energy levels
   - Captures 1-3 daily objectives/goals from users
   - Provides simple, realistic wellness advice
   - Generates personalized summaries and recaps

2. **JSON-Based Data Persistence**
   - All check-ins saved to `wellness_log.json`
   - Tracks: date/time, mood, energy level, objectives, and summaries
   - Enables continuity across sessions

3. **Context-Aware Conversations**
   - Agent references previous check-ins in new sessions
   - Example: "Last time we talked, you mentioned being low on energy. How does today compare?"
   - Creates a sense of continuity and personalized care

4. **Apollo Pharmacy Branding Integration**
   - Custom wellness-themed UI with animated health icons
   - Branded welcome screen with Apollo Pharmacy identity
   - Supportive, professional wellness advisor persona

---

## 💻 Technical Implementation

### **Backend (Python)**
- **Wellness State Management** (`wellness_state.py`)
  - `WellnessCheckIn` dataclass for structured data
  - `WellnessLog` class for JSON persistence
  - Methods for loading, saving, and querying check-in history

- **Day 3 Wellness Agent** (`agent_day3.py`)
  - 7 function tools for structured conversation:
    1. `capture_mood()` - Stores user's mood
    2. `capture_energy_level()` - Tracks energy levels
    3. `add_objective()` - Adds daily goals (1-3)
    4. `check_check_in_status()` - Validates completeness
    5. `get_previous_check_ins()` - Loads history
    6. `generate_summary()` - Creates check-in summary
    7. `save_check_in()` - Persists to JSON

- **Agent Router System**
  - Refactored main agent to support Day 1, 2, and 3
  - Environment variable-based routing (`AGENT_DAY=3`)

### **Frontend (Next.js/React)**
- **Custom Wellness Welcome Screen**
  - Animated health/wellness icon (medical cross with heart)
  - Apollo Pharmacy branding with gradient effects
  - Feature cards highlighting: Daily Check-ins, Wellness Goals, Health Insights
  - Smooth animations using Framer Motion

- **UI Enhancements**
  - Blue/teal wellness theme
  - Glass-morphism design elements
  - Responsive design for all devices

### **Tech Stack**
- **Voice AI**: LiveKit Agents
- **STT**: Deepgram Nova-3
- **LLM**: Google Gemini 2.5 Flash
- **TTS**: Murf AI (Falcon) - **Fastest TTS API** ⚡
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: Custom wellness state system with JSON persistence

---

## 🎨 Key Highlights

### **Conversation Flow**
1. **Greeting** - References previous check-ins if available
2. **Mood Check** - "How are you feeling today?"
3. **Energy Level** - "How would you describe your energy?"
4. **Daily Objectives** - "What are 1-3 things you'd like to focus on today?"
5. **Wellness Advice** - Simple, actionable suggestions
6. **Summary Generation** - Creates personalized recap
7. **Save & Confirm** - Persists to JSON and confirms with user

### **Data Structure**
```json
{
  "date_time": "2025-01-15T10:30:00",
  "mood": "feeling good, a bit anxious about work",
  "energy_level": "medium",
  "objectives": [
    "Finish the project report",
    "Go for a 30-minute walk",
    "Call my mom"
  ],
  "summary": "User is feeling good with medium energy. Focused on..."
}
```

---

## ✨ What Makes This Special

1. **Non-Medical, Supportive Approach**
   - Grounded wellness companion (not a clinician)
   - Avoids medical advice or diagnoses
   - Focuses on daily reflection and goal-setting

2. **Continuity & Memory**
   - Remembers previous conversations
   - Builds relationship over time
   - Personalized check-ins based on history

3. **Apollo Pharmacy Integration**
   - Branded experience aligned with pharmacy wellness services
   - Professional yet caring tone
   - Subtle references to wellness support

4. **Fast & Responsive**
   - Powered by **Murf AI's Falcon TTS** for ultra-fast voice synthesis
   - Real-time conversation with minimal latency
   - Smooth user experience

---

## 📊 Project Stats

- **62 files changed** (6,762 insertions, 437 deletions)
- **7 function tools** for structured wellness data capture
- **Complete JSON persistence** system
- **Custom wellness UI** with Apollo Pharmacy branding
- **Multi-day agent routing** system

---

## 🎯 Challenge Requirements Met

✅ Clear, grounded system prompt  
✅ Daily voice check-ins  
✅ JSON-based persistence  
✅ References to past check-ins  
✅ Mood and energy tracking  
✅ Daily objectives capture  
✅ Simple, realistic advice  
✅ Recap and confirmation  

---

## 🔗 Technologies & Tools

- **LiveKit Agents** - Voice AI framework
- **Murf AI Falcon TTS** - Fastest TTS API ⚡
- **Deepgram STT** - Speech recognition
- **Google Gemini** - LLM for conversation
- **Next.js** - Frontend framework
- **Python** - Backend agent logic
- **JSON** - Data persistence

---

## 📝 For Your LinkedIn Post

**Suggested Post Content:**

---

🎉 **Day 3 Complete!** Just built a **Health & Wellness Voice Companion** as part of the #MurfAIVoiceAgentsChallenge!

**What I Built:**
✨ Daily wellness check-ins via voice conversation
📊 JSON-based persistence for tracking mood, energy, and goals
🧠 Context-aware agent that remembers previous check-ins
💊 Apollo Pharmacy branded wellness experience
🎯 Structured conversation flow with 7 function tools

**Tech Stack:**
- LiveKit Agents for voice AI
- **Murf AI Falcon TTS** (fastest TTS API! ⚡)
- Deepgram STT + Google Gemini LLM
- Next.js frontend with custom wellness UI
- Python backend with JSON persistence

**Key Features:**
- Asks about mood, energy, and daily objectives
- Provides simple, realistic wellness advice
- Saves all check-ins to JSON for continuity
- References past conversations naturally
- Beautiful Apollo Pharmacy branded interface

The agent conducts supportive daily check-ins, tracks wellness data, and builds a personalized relationship over time - all powered by the fastest TTS API from Murf AI!

#MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents #VoiceAI #AI #WellnessTech #HealthTech #LiveKit #MurfAI

---

**Video Demo Points to Highlight:**
1. Show the Apollo Pharmacy welcome screen
2. Start a wellness check-in conversation
3. Demonstrate mood/energy/objectives capture
4. Show the JSON file being created/updated
5. Start a second session showing continuity (references previous check-in)

---

## 🎬 Demo Checklist

- [ ] Record video showing welcome screen
- [ ] Demonstrate full check-in conversation
- [ ] Show JSON file with saved data
- [ ] Show second session with continuity
- [ ] Highlight Apollo Pharmacy branding
- [ ] Mention Murf AI Falcon TTS speed
- [ ] Tag @MurfAI and use hashtags

---

**Ready to post! 🚀**

