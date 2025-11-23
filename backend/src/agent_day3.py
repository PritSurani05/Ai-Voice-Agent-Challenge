"""Day 3 Wellness Agent - Health & wellness companion for daily check-ins."""

import logging
import os
from dataclasses import dataclass
from datetime import datetime

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    RunContext,
    ToolError,
    WorkerOptions,
    cli,
    function_tool,
    metrics,
    tokenize,
)
# Plugins imported in functions to avoid threading issues with plugin registration

try:
    from .wellness_state import WellnessCheckIn, WellnessLog
except ImportError:
    from wellness_state import WellnessCheckIn, WellnessLog

logger = logging.getLogger("agent")

load_dotenv(".env.local")


@dataclass
class Userdata:
    """User data containing the wellness check-in state."""
    check_in: WellnessCheckIn
    wellness_log: WellnessLog


class WellnessAgent(Agent):
    def __init__(self, *, userdata: Userdata) -> None:
        # Get context from previous check-ins
        previous_context = userdata.wellness_log.format_context_for_agent()
        
        instructions = f"""You are a supportive, grounded health and wellness companion from Apollo Pharmacy. Your role is to conduct daily check-ins that help users reflect on their mood, energy, and daily goals as part of Apollo Pharmacy's commitment to everyday wellness.

BRAND IDENTITY:
- You represent Apollo Pharmacy, a trusted health and wellness partner
- Apollo Pharmacy focuses on everyday wellness needs, preventive care, and supporting healthy lifestyles
- You embody Apollo Pharmacy's caring, professional, and supportive approach to health
- Reference that Apollo Pharmacy offers various wellness services, but keep it subtle and non-promotional

IMPORTANT GUIDELINES:
- Never provide medical advice, diagnoses, or treatment recommendations
- Keep advice small, actionable, and realistic
- Be supportive but not overly optimistic or dismissive
- Reference previous check-ins when available to show continuity
- Ask about mood and energy naturally in conversation
- Help users break large goals into smaller, manageable steps
- Encourage self-care activities (rest, exercise, hobbies, connection, proper nutrition)
- Use simple, grounded language - avoid clinical or overly therapeutic terms
- You can mention that Apollo Pharmacy offers wellness products and services, but only when naturally relevant and never pushy

CONVERSATION FLOW:
1. Start with a warm greeting from Apollo Pharmacy. {previous_context if previous_context else "Since this is your first check-in, introduce yourself as from Apollo Pharmacy and explain you're here to help with their daily wellness check-in."} IMPORTANT: If there are previous check-ins, you MUST reference them naturally in your greeting. For example, if the context says "Last time we talked, you mentioned being low on energy. How does today compare?", incorporate this into your greeting naturally.
2. Ask about mood and energy (use capture_mood and capture_energy_level tools)
3. Ask about 1-3 daily objectives or intentions (use add_objective tool - can be called multiple times)
4. Offer simple, realistic advice based on what they shared (conversational, no tool needed)
5. Generate a brief summary of the check-in (use generate_summary tool)
6. Close with a recap and confirmation (use save_check_in tool)

CONVERSATION STYLE:
- Be warm, supportive, and conversational - like a caring wellness advisor
- Ask one question at a time and wait for responses
- Keep responses natural and brief - don't give long explanations
- Don't use complex formatting, emojis, or special symbols in your speech
- If you don't understand something, politely ask for clarification
- Occasionally mention that Apollo Pharmacy is here to support their wellness journey, but keep it natural

CRITICAL INSTRUCTIONS:
1. ALWAYS respond to EVERY user message - never stay silent
2. When you first detect user speech (like "hi", "hello", or any greeting), IMMEDIATELY respond with a greeting that:
   - If there are previous check-ins: Reference them naturally. For example: "Hello! Welcome back to Apollo Pharmacy's wellness check-in. Last time we talked, you mentioned being low on energy. How does today compare? I'm here to help with your daily wellness reflection."
   - If this is the first check-in: "Hello! Welcome to Apollo Pharmacy's wellness check-in. I'm here to help you with your daily wellness reflection. How are you feeling today?"
3. Use the function tools to capture information as the user provides it
4. Check check_in_status to see what information is still needed
5. After capturing mood, energy, and at least 1 objective, offer some simple advice
6. Always generate a summary before saving the check-in
7. Always close with a recap that confirms: mood, energy, and objectives
8. You MUST generate a response for every user input - never return empty responses
9. Be proactive and supportive throughout the conversation
10. ALWAYS reference previous check-ins when available - this shows continuity and care

Remember: You are a supportive wellness companion from Apollo Pharmacy, not a clinician. Keep things grounded, realistic, and helpful. Apollo Pharmacy is about everyday wellness and supporting healthy lifestyles."""

        super().__init__(
            instructions=instructions,
        )
    
    async def on_agent_speech_committed(self, ctx: RunContext[Userdata], message: str) -> None:
        """Called when the agent's speech is committed (sent to TTS)."""
        logger.info(f"Agent said: {message}")
    
    async def on_user_speech_committed(self, ctx: RunContext[Userdata], message: str) -> None:
        """Called when the user's speech is committed (transcribed)."""
        logger.info(f"User said: {message}")

    @function_tool
    async def capture_mood(
        self,
        ctx: RunContext[Userdata],
        mood: str,
    ) -> str:
        """Capture the user's current mood.
        
        Args:
            mood: Description of how the user is feeling (e.g., "feeling good", "a bit anxious", "excited", "tired", etc.)
        """
        ctx.userdata.check_in.mood = mood
        logger.info(f"Captured mood: {mood}")
        
        # Check what's still needed
        missing = ctx.userdata.check_in.get_missing_fields()
        if "energy_level" in missing:
            return f"Thanks for sharing that you're {mood}. That's helpful to know. How would you describe your energy level today?"
        else:
            return f"Got it, you're {mood}. Let's continue with your wellness check-in."

    @function_tool
    async def capture_energy_level(
        self,
        ctx: RunContext[Userdata],
        energy: str,
    ) -> str:
        """Capture the user's energy level.
        
        Args:
            energy: Energy level description (e.g., "high", "medium", "low", "very high", "pretty low", or a number 1-10)
        """
        ctx.userdata.check_in.energy_level = energy
        logger.info(f"Captured energy level: {energy}")
        
        # Check what's still needed
        missing = ctx.userdata.check_in.get_missing_fields()
        if "objectives (at least 1)" in missing:
            return f"Thanks, {energy} energy level noted. That's good to know. What are 1 to 3 things you'd like to focus on or accomplish today for your wellness?"
        else:
            return f"Got it, {energy} energy level. Let's talk about your wellness goals for today."

    @function_tool
    async def add_objective(
        self,
        ctx: RunContext[Userdata],
        objective: str,
    ) -> str:
        """Add a daily objective or intention to the check-in (can be called multiple times for multiple objectives).
        
        Args:
            objective: A daily goal or intention (e.g., "finish the project report", "go for a walk", "call my mom", etc.)
        """
        if objective.lower() not in [obj.lower() for obj in ctx.userdata.check_in.objectives]:
            ctx.userdata.check_in.objectives.append(objective)
            logger.info(f"Added objective: {objective}")
            
            num_objectives = len(ctx.userdata.check_in.objectives)
            if num_objectives < 3:
                return f"Great! I've noted that you want to {objective}. Would you like to add another goal, or are you all set with {num_objectives}?"
            else:
                return f"Perfect! I've noted that you want to {objective}. You now have {num_objectives} objectives. That's a good set of goals for today!"
        else:
            return f"You already mentioned {objective}. Would you like to add another goal, or are you all set?"

    @function_tool
    async def check_check_in_status(
        self,
        ctx: RunContext[Userdata],
    ) -> str:
        """Check the current status of the check-in and see what information is still needed.
        Use this to understand what questions to ask next."""
        check_in = ctx.userdata.check_in
        if check_in.is_complete():
            objectives_str = ", ".join(check_in.objectives)
            return (
                f"Check-in is complete! Here's what we have: "
                f"Mood: {check_in.mood}, Energy: {check_in.energy_level}, "
                f"Objectives: {objectives_str}."
            )
        else:
            missing = check_in.get_missing_fields()
            current = []
            if check_in.mood:
                current.append(f"mood: {check_in.mood}")
            if check_in.energy_level:
                current.append(f"energy: {check_in.energy_level}")
            if check_in.objectives:
                current.append(f"objectives: {', '.join(check_in.objectives)}")
            
            status = f"Current check-in: {', '.join(current) if current else 'just started'}. "
            status += f"Still need: {', '.join(missing)}."
            return status

    @function_tool
    async def get_previous_check_ins(
        self,
        ctx: RunContext[Userdata],
        days: int = 7,
    ) -> str:
        """Get recent check-in entries from the last N days for context.
        
        Args:
            days: Number of days to look back (default: 7)
        
        Returns:
            Formatted summary of recent check-ins
        """
        recent = ctx.userdata.wellness_log.get_recent_entries(days=days)
        if not recent:
            return "No previous check-ins found."
        
        if len(recent) == 1:
            entry = recent[0]
            try:
                entry_date = datetime.fromisoformat(entry.get("date_time", ""))
                date_str = entry_date.strftime("%B %d")
                return (
                    f"Your last check-in was on {date_str}. "
                    f"Mood: {entry.get('mood', 'not recorded')}, "
                    f"Energy: {entry.get('energy_level', 'not recorded')}, "
                    f"Objectives: {', '.join(entry.get('objectives', []))}."
                )
            except (ValueError, TypeError):
                return f"Found 1 previous check-in, but couldn't parse the date."
        else:
            summary = f"Found {len(recent)} check-ins in the last {days} days. "
            # Get the most recent one for comparison
            last = recent[0]
            try:
                entry_date = datetime.fromisoformat(last.get("date_time", ""))
                date_str = entry_date.strftime("%B %d")
                summary += (
                    f"Most recently on {date_str}: "
                    f"Mood: {last.get('mood', 'not recorded')}, "
                    f"Energy: {last.get('energy_level', 'not recorded')}."
                )
            except (ValueError, TypeError):
                summary += "Most recent check-in details available."
            return summary

    @function_tool
    async def generate_summary(
        self,
        ctx: RunContext[Userdata],
    ) -> str:
        """Generate a brief summary of the current check-in based on mood, energy, and objectives.
        This summary will be saved with the check-in."""
        check_in = ctx.userdata.check_in
        
        if not check_in.is_complete():
            missing = check_in.get_missing_fields()
            raise ToolError(
                f"Cannot generate summary. Still missing: {', '.join(missing)}. "
                "Please complete the check-in first."
            )
        
        # Generate a simple summary
        objectives_str = ", ".join(check_in.objectives)
        summary = (
            f"Apollo Pharmacy wellness check-in: User is {check_in.mood} with {check_in.energy_level} energy. "
            f"Focused on: {objectives_str}."
        )
        
        check_in.summary = summary
        logger.info(f"Generated summary: {summary}")
        return f"Summary generated. Ready to save your check-in!"

    @function_tool
    async def save_check_in(
        self,
        ctx: RunContext[Userdata],
    ) -> str:
        """Save the completed check-in to the wellness log JSON file.
        Only call this when all required fields are filled and summary is generated.
        This will save the check-in and provide a recap."""
        check_in = ctx.userdata.check_in
        
        if not check_in.is_complete():
            missing = check_in.get_missing_fields()
            raise ToolError(
                f"Cannot save check-in. Still missing: {', '.join(missing)}. "
                "Please complete the check-in first."
            )
        
        if not check_in.summary:
            raise ToolError(
                "Cannot save check-in. Summary not generated. "
                "Please generate a summary first using generate_summary."
            )
        
        # Save to JSON file
        ctx.userdata.wellness_log.save_check_in(check_in)
        logger.info(f"Check-in saved to wellness log")
        
        # Create recap
        objectives_str = ", ".join(check_in.objectives)
        recap = (
            f"Perfect! I've saved your wellness check-in to your Apollo Pharmacy wellness log. Here's a quick recap: "
            f"You're feeling {check_in.mood} with {check_in.energy_level} energy. "
            f"Your goals for today are: {objectives_str}. "
            f"Does this sound right? Remember, Apollo Pharmacy is here to support your wellness journey every day."
        )
        
        return recap


def prewarm(proc: JobProcess, silero_module):
    """Prewarm models for Day 3 wellness agent."""
    # silero_module is passed from agent.py where plugins are registered on main thread
    proc.userdata["vad"] = silero_module.VAD.load()
    # Initialize wellness log
    wellness_log = WellnessLog()
    proc.userdata["wellness_log"] = wellness_log


async def entrypoint(ctx: JobContext):
    """Entry point for Day 3 wellness agent."""
    # Plugins are already imported and registered in agent.py
    # Import them here to use (they're already registered, so this is safe)
    from livekit.plugins import murf, google, deepgram, noise_cancellation
    from livekit.plugins.turn_detector.multilingual import MultilingualModel
    
    # Logging setup
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Initialize wellness log and check-in
    wellness_log = ctx.proc.userdata.get("wellness_log", WellnessLog())
    check_in = WellnessCheckIn()
    
    # Initialize userdata
    userdata = Userdata(check_in=check_in, wellness_log=wellness_log)

    # Set up a voice AI pipeline
    session = AgentSession[Userdata](
        userdata=userdata,
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice="en-US-matthew",
            style="Conversation",
            tokenizer=tokenize.basic.WordTokenizer(),
            text_pacing=False
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    # Metrics collection
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)
    
    # Event handlers for debugging
    @session.on("user_speech_committed")
    def _on_user_speech(ev):
        logger.info(f"✅✅✅ User speech detected: {ev.text}")
    
    @session.on("agent_speech_committed")
    def _on_agent_speech(ev):
        logger.info(f"✅✅✅ Agent speech: {ev.text}")
    
    @session.on("user_speech_started")
    def _on_user_speech_started(ev):
        logger.info("🔊 User started speaking")
    
    @session.on("agent_speech_started")
    def _on_agent_speech_started(ev):
        logger.info("🔊 Agent started speaking")
    
    @session.on("llm_stream")
    def _on_llm_stream(ev):
        logger.info(f"🤖 LLM stream: {ev.text[:100]}...")
    
    @session.on("llm_response")
    def _on_llm_response(ev):
        logger.info(f"🤖 LLM response received")
    
    @session.on("user_speech_partial")
    def _on_user_speech_partial(ev):
        logger.info(f"📝 User speech partial: {ev.text[:50]}...")
    
    @session.on("error")
    def _on_error(ev):
        logger.error(f"❌ Session error: {ev}")
    
    try:
        @session.on("llm_error")
        def _on_llm_error(ev):
            logger.error(f"❌ LLM error: {ev}")
    except:
        pass

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # Start the session
    agent = WellnessAgent(userdata=userdata)
    
    await session.start(
        agent=agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()
    logger.info("Day 3 Apollo Pharmacy Wellness Agent connected to room, session is active and listening")
    logger.info(f"Room name: {ctx.room.name}, Room SID: {ctx.room.sid}")
    logger.info(f"Agent participant: {ctx.room.local_participant.identity}")
    
    import asyncio
    await asyncio.sleep(1)
    
    participants = list(ctx.room.remote_participants.values())
    logger.info(f"Remote participants in room: {len(participants)}")
    for p in participants:
        logger.info(f"  - {p.identity} (name: {p.name})")
    
    logger.info("Day 3 Apollo Pharmacy Wellness Agent is ready and waiting for user speech...")
    
    async def proactive_greeting():
        await asyncio.sleep(0.5)
        participants = list(ctx.room.remote_participants.values())
        if len(participants) > 0:
            logger.info("User detected, agent should greet proactively")
    
    asyncio.create_task(proactive_greeting())


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))

