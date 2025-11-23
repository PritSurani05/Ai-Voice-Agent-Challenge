"""Day 1 Starter Agent - Simple conversational voice agent."""

import logging
import os
from dataclasses import dataclass

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    RunContext,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
)
# Plugins imported in functions to avoid threading issues with plugin registration

logger = logging.getLogger("agent")

load_dotenv(".env.local")


@dataclass
class Userdata:
    """Simple userdata for Day 1 agent (no order state needed)."""
    pass


class StarterAgent(Agent):
    """Day 1 Starter Agent - Simple conversational assistant."""
    
    def __init__(self, *, userdata: Userdata) -> None:
        instructions = """You are a friendly and helpful AI assistant. 
        You can have natural conversations with users about various topics.
        Be warm, conversational, and helpful. Keep your responses concise and natural.
        Respond to user greetings and questions in a friendly manner.
        Don't use complex formatting, emojis, or special symbols in your speech."""

        super().__init__(instructions=instructions)
    
    async def on_agent_speech_committed(self, ctx: RunContext[Userdata], message: str) -> None:
        """Called when the agent's speech is committed (sent to TTS)."""
        logger.info(f"Agent said: {message}")
    
    async def on_user_speech_committed(self, ctx: RunContext[Userdata], message: str) -> None:
        """Called when the user's speech is committed (transcribed)."""
        logger.info(f"User said: {message}")


def prewarm(proc: JobProcess, silero_module):
    """Prewarm models for Day 1 agent."""
    # silero_module is passed from agent.py where plugins are registered on main thread
    proc.userdata["vad"] = silero_module.VAD.load()


async def entrypoint(ctx: JobContext):
    """Entry point for Day 1 starter agent."""
    # Plugins are already imported and registered in agent.py
    # Import them here to use (they're already registered, so this is safe)
    from livekit.plugins import murf, google, deepgram, noise_cancellation
    from livekit.plugins.turn_detector.multilingual import MultilingualModel
    
    # Logging setup
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Initialize userdata
    userdata = Userdata()

    # Set up a voice AI pipeline
    session = AgentSession[Userdata](
        userdata=userdata,
        # Speech-to-text (STT)
        stt=deepgram.STT(model="nova-3"),
        # Large Language Model (LLM)
        llm=google.LLM(model="gemini-2.5-flash"),
        # Text-to-speech (TTS)
        tts=murf.TTS(
            voice="en-US-matthew",
            style="Conversation",
            tokenizer=tokenize.basic.WordTokenizer(),
            text_pacing=False
        ),
        # VAD and turn detection
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
        logger.info(f"User speech detected: {ev.text}")
    
    @session.on("agent_speech_committed")
    def _on_agent_speech(ev):
        logger.info(f"Agent speech: {ev.text}")
    
    @session.on("error")
    def _on_error(ev):
        logger.error(f"Session error: {ev}")

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # Start the session
    agent = StarterAgent(userdata=userdata)
    
    await session.start(
        agent=agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()
    logger.info("Day 1 Starter Agent connected to room, session is active and listening")
    logger.info(f"Room name: {ctx.room.name}, Room SID: {ctx.room.sid}")
    logger.info(f"Agent participant: {ctx.room.local_participant.identity}")
    
    import asyncio
    await asyncio.sleep(1)
    
    participants = list(ctx.room.remote_participants.values())
    logger.info(f"Remote participants in room: {len(participants)}")
    for p in participants:
        logger.info(f"  - {p.identity} (name: {p.name})")
    
    logger.info("Day 1 Starter Agent is ready and waiting for user speech...")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))

