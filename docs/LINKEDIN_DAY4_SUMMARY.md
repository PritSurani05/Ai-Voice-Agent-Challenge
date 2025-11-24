# Day 4 – Teach-the-Tutor: LinkedIn Content Summary

## 🎯 Challenge Snapshot
Day 4 of the **Murf AI Voice Agent Challenge** pushed the agent into full **Teach-the-Tutor** mode. The brief: build an active recall coach that rotates through **learn**, **quiz**, and **teach_back** flows, runs on **Murf Falcon (Matthew, Alicia, Ken)** voices, and keeps learners grounded in JSON-based course content.

---

## 🚀 What Was Built Today

### 1. Multi-Mode Tutor With Voice Personas
- The agent now greets learners, confirms their preferred mode, and hot-swaps Murf Falcon voices (`Matthew`, `Alicia`, `Ken`) via dynamic TTS updates.
- Switching modes is instant—every “let’s quiz instead” request triggers `set_learning_mode`, resets the persona, and confirms the tonal shift.
- Each mode is powered by purpose-built tools:
  - `describe_current_concept` for calm walkthroughs.
  - `get_quiz_prompt` for energetic questioning.
  - `get_teach_back_prompt` plus optional scoring + coaching feedback using `record_mastery_event`.

### 2. JSON-Driven Curriculum + Mastery Tracking
- Introduced `shared-data/day4_tutor_content.json` with Variables, Loops, and Conditionals (each concept includes summary, quiz prompt, teach-back prompt).
- `TutorContentLibrary` handles loading, ordering, and cycling through concepts, ensuring every explanation is grounded in the shared file.
- Session state stores the active concept, mode, and lightweight mastery metrics (times learned/quizzed/taught back, latest score + feedback).
- Learners can ask, “Which concept am I weakest at?” and get an instant summary through `get_mastery_snapshot`.

### 3. Production-Ready Agent Runtime
- LiveKit pipeline: **Deepgram Nova-3 STT**, **Google Gemini 2.5 Flash LLM**, **Murf Falcon TTS**, multilingual turn detection, and BVC noise cancellation.
- Prewarm hook loads Silero VAD + tutor content, keeping cold-start latency low.
- Metrics collection feeds back usage stats so we can benchmark each live run.

### 4. Frontend Glow-Up for Teach-the-Tutor
- Landing + chat surfaces now carry the **Physics Wallah nebula gradient**: floating particles, glass panels, aura lighting, and a teacher/student animation built with Framer Motion.
- The live session view inherits the same theming—chat transcript, control bar, and modal surfaces all match the welcome hero for brand continuity.

---

## 🧠 Tech Stack Highlights
- **Voice Stack**: LiveKit Agents, Murf Falcon TTS, Deepgram STT, Gemini 2.5 Flash LLM.
- **Frontend**: Next.js + Tailwind + Framer Motion with day-based themed gradients.
- **Content & State**: JSON course file, dataclass-backed mastery tracking, dynamic persona switching APIs.

---

## ✍️ Suggested LinkedIn Post

> 🎉 **Day 4 Complete – Teach-the-Tutor unlocked!**  
> Today’s #MurfAIVoiceAgentsChallenge build is an **Active Recall Coach** that rotates through learn / quiz / teach-back modes — all powered by the **fastest TTS API from Murf Falcon**.  
> 
> **What’s new:**  
> • JSON-driven curriculum with Variables, Loops, Conditionals  
> • Mode-aware Murf voices (Matthew, Alicia, Ken) that swap instantly  
> • Teach-back scoring + mastery summaries (“which concept am I weakest at?”)  
> • Physics Wallah-inspired UI so the chat view feels like the main hero screen  
> 
> **Stack:** LiveKit Agents · Murf Falcon TTS · Deepgram Nova-3 · Gemini 2.5 Flash · Next.js  
> 
> Learners can jump between modes mid-call, get quizzed, teach ideas back, and see their progress build in real time.  
> 
> #10DaysofAIVoiceAgents #MurfAIVoiceAgentsChallenge #VoiceAI #EdTech #LiveKit #MurfAI

---

## 🎬 Demo Checklist
- [ ] Start with the Physics Wallah Teach-the-Tutor hero screen before joining the room.
- [ ] Show the agent greeting + asking which mode to start with.
- [ ] Run all three modes (learn → quiz → teach_back) and mention Murf Falcon voices.
- [ ] Swap concepts via `list_concepts` / `set_focus_concept` flow.
- [ ] Trigger a mode switch mid-session to highlight instant persona changes.
- [ ] Ask “How am I doing?” and show the mastery summary response.
- [ ] Close with the refreshed chat UI and invite to try the coach themselves.

---

🚀 Ready to post! Ping me if you need tailored copy for video captions or voiceover lines. 💬

