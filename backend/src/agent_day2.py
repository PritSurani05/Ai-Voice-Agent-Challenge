"""Day 2 Barista Agent - Coffee shop order-taking agent."""

import json
import logging
import os
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

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
    from .order_state import CoffeeOrder
except ImportError:
    from order_state import CoffeeOrder

logger = logging.getLogger("agent")

load_dotenv(".env.local")


@dataclass
class Userdata:
    """User data containing the coffee order state."""
    order: CoffeeOrder


class BaristaAgent(Agent):
    def __init__(self, *, userdata: Userdata) -> None:
        instructions = """You are a friendly and enthusiastic barista at Zepto Cafe. 
        Your goal is to take the customer's coffee order by gathering the following information:
        - Drink type (e.g., latte, cappuccino, americano, espresso, mocha, etc.)
        - Size (small, medium, large, or tall, grande, venti)
        - Milk preference (whole milk, skim milk, oat milk, almond milk, soy milk, coconut milk, etc.)
        - Extras (optional additions like whipped cream, vanilla syrup, caramel, chocolate, etc.)
        - Customer's name (for the order)

        Be warm, welcoming, and conversational. Ask one question at a time and wait for the customer's response.
        IMPORTANT ORDER FLOW:
        1. First, gather all required information: drinkType, size, milk, and name.
        2. After getting the name, ALWAYS ask: "Would you like any extras like whipped cream, vanilla syrup, caramel, or chocolate?"
        3. Wait for the customer's response about extras. If they say yes, use the add_extra tool for each extra they mention.
        4. If they say no or nothing, that's fine - extras are optional.
        5. Only after asking about extras (whether they want any or not), use the complete_order tool to save the order.
        Extras are optional, but you MUST ask about them before completing the order.

        Keep your responses natural and friendly, as if you're having a real conversation with a customer at a coffee shop.
        Don't use complex formatting, emojis, or special symbols in your speech.
        
        CRITICAL INSTRUCTIONS:
        1. ALWAYS respond to EVERY user message - never stay silent. If the user says anything, you MUST respond immediately.
        2. When you first detect user speech (like "hi", "hello", or any greeting), IMMEDIATELY respond with: "Hi! Welcome to Zepto Cafe! I'm here to help you order your favorite coffee. What would you like to have today?"
        3. Use the function tools (update_drink_type, update_size, update_milk, update_name, add_extra) to update the order as the customer provides information.
        4. After each update, check what information is still missing using check_order_status, then ask for the next missing piece of information.
        5. After getting the customer's name (when all required fields are filled), you MUST ask: "Would you like any extras like whipped cream, vanilla syrup, caramel, or chocolate?" BEFORE calling complete_order.
        6. Wait for the customer's response about extras. If they mention extras, use add_extra for each one. If they say no or nothing, proceed to complete the order.
        7. Only call complete_order AFTER you have asked about extras and received a response (even if they don't want any).
        8. If you don't understand something, politely ask for clarification.
        9. Be proactive and friendly throughout the conversation.
        10. Keep responses short and conversational - don't give long explanations.
        11. IMPORTANT: You MUST generate a response for every user input. Never return empty responses."""

        # Don't pass tools explicitly - the @function_tool decorator will auto-register them
        # Passing them explicitly causes duplicate registration errors
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
    async def update_drink_type(
        self,
        ctx: RunContext[Userdata],
        drink_type: str,
    ) -> str:
        """Update the drink type in the order.
        
        Args:
            drink_type: The type of coffee drink (e.g., latte, cappuccino, americano, espresso, mocha, macchiato, etc.)
        """
        ctx.userdata.order.drinkType = drink_type.lower()
        logger.info(f"Updated drink type: {drink_type}")
        return f"Got it! {drink_type}. What size would you like?"

    @function_tool
    async def update_size(
        self,
        ctx: RunContext[Userdata],
        size: str,
    ) -> str:
        """Update the size in the order.
        
        Args:
            size: The size of the drink (e.g., small, medium, large, tall, grande, venti)
        """
        ctx.userdata.order.size = size.lower()
        logger.info(f"Updated size: {size}")
        missing = ctx.userdata.order.get_missing_fields()
        if "milk" in missing:
            return f"Perfect! {size} it is. What kind of milk would you like?"
        elif "name" in missing:
            return f"Great! {size} size. What's your name for the order?"
        else:
            return f"Got it! {size} size."

    @function_tool
    async def update_milk(
        self,
        ctx: RunContext[Userdata],
        milk: str,
    ) -> str:
        """Update the milk preference in the order.
        
        Args:
            milk: The type of milk (e.g., whole milk, skim milk, oat milk, almond milk, soy milk, coconut milk, etc.)
        """
        ctx.userdata.order.milk = milk.lower()
        logger.info(f"Updated milk: {milk}")
        missing = ctx.userdata.order.get_missing_fields()
        if "name" in missing:
            return f"Perfect! {milk}. What's your name for the order?"
        else:
            return f"Got it! {milk}."

    @function_tool
    async def add_extra(
        self,
        ctx: RunContext[Userdata],
        extra: str,
    ) -> str:
        """Add an extra to the order (can be called multiple times for multiple extras).
        
        Args:
            extra: An extra addition (e.g., whipped cream, vanilla syrup, caramel, chocolate, cinnamon, etc.)
        """
        if extra.lower() not in [e.lower() for e in ctx.userdata.order.extras]:
            ctx.userdata.order.extras.append(extra)
            logger.info(f"Added extra: {extra}")
            return f"Added {extra} to your order. Would you like any other extras, or are you all set?"
        else:
            return f"{extra} is already in your order. Would you like any other extras, or are you all set?"

    @function_tool
    async def update_name(
        self,
        ctx: RunContext[Userdata],
        name: str,
    ) -> str:
        """Update the customer's name in the order.
        
        Args:
            name: The customer's name for the order
        """
        ctx.userdata.order.name = name
        logger.info(f"Updated name: {name}")
        if ctx.userdata.order.is_complete():
            # Always ask about extras before completing
            return f"Thanks {name}! Would you like any extras like whipped cream, vanilla syrup, caramel, or chocolate?"
        else:
            missing = ctx.userdata.order.get_missing_fields()
            return f"Got it, {name}! I still need: {', '.join(missing)}."

    @function_tool
    async def check_order_status(
        self,
        ctx: RunContext[Userdata],
    ) -> str:
        """Check the current status of the order and see what information is still needed.
        Use this to understand what questions to ask next."""
        order = ctx.userdata.order
        if order.is_complete():
            extras_str = ", ".join(order.extras) if order.extras else "none"
            return (
                f"Order is complete! Here's what we have: "
                f"{order.size} {order.drinkType} with {order.milk}, "
                f"extras: {extras_str}, for {order.name}."
            )
        else:
            missing = order.get_missing_fields()
            current = []
            if order.drinkType:
                current.append(f"drink: {order.drinkType}")
            if order.size:
                current.append(f"size: {order.size}")
            if order.milk:
                current.append(f"milk: {order.milk}")
            if order.name:
                current.append(f"name: {order.name}")
            if order.extras:
                current.append(f"extras: {', '.join(order.extras)}")
            
            status = f"Current order: {', '.join(current) if current else 'empty'}. "
            status += f"Still need: {', '.join(missing)}."
            return status

    @function_tool
    async def complete_order(
        self,
        ctx: RunContext[Userdata],
    ) -> str:
        """Complete and save the order to a JSON file. Only call this when all required fields are filled.
        This will save the order and confirm it with the customer."""
        order = ctx.userdata.order
        
        if not order.is_complete():
            missing = order.get_missing_fields()
            raise ToolError(
                f"Cannot complete order. Still missing: {', '.join(missing)}. "
                "Please gather all required information first."
            )

        # Create orders directory if it doesn't exist
        orders_dir = Path("orders")
        orders_dir.mkdir(exist_ok=True)

        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = orders_dir / f"order_{timestamp}_{order.name.replace(' ', '_')}.json"

        # Save order to JSON file
        order_dict = order.to_dict()
        with open(filename, "w") as f:
            json.dump(order_dict, f, indent=2)

        logger.info(f"Order saved to {filename}")

        extras_str = ", ".join(order.extras) if order.extras else "no extras"
        confirmation = (
            f"Perfect! I've saved your order: "
            f"{order.size} {order.drinkType} with {order.milk}, "
            f"{extras_str}. "
            f"Thanks {order.name}, your order will be ready soon!"
        )

        return confirmation


def prewarm(proc: JobProcess, silero_module):
    """Prewarm models for Day 2 barista agent."""
    # silero_module is passed from agent.py where plugins are registered on main thread
    proc.userdata["vad"] = silero_module.VAD.load()
    # Initialize order state in userdata
    proc.userdata["order"] = CoffeeOrder()


async def entrypoint(ctx: JobContext):
    """Entry point for Day 2 barista agent."""
    # Plugins are already imported and registered in agent.py
    # Import them here to use (they're already registered, so this is safe)
    from livekit.plugins import murf, google, deepgram, noise_cancellation
    from livekit.plugins.turn_detector.multilingual import MultilingualModel
    
    # Logging setup
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Initialize userdata with order state
    userdata = Userdata(order=ctx.proc.userdata.get("order", CoffeeOrder()))

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
        # Reduced logging - only log first chunk to avoid spam
        pass  # LLM streaming is working, no need to log every chunk
    
    @session.on("llm_response")
    def _on_llm_response(ev):
        logger.info(f"🤖 LLM response received (full response ready)")
    
    @session.on("user_speech_partial")
    def _on_user_speech_partial(ev):
        logger.info(f"📝 User speech partial: {ev.text[:50]}...")
    
    @session.on("error")
    def _on_error(ev):
        logger.error(f"❌ Session error: {ev}")
        # Log TTS-specific errors in detail
        if hasattr(ev, 'error') and hasattr(ev.error, 'type'):
            if 'tts' in str(ev.error.type).lower() or 'murf' in str(ev.source).lower():
                logger.error(f"🔴 TTS Error Details: {ev.error}")
                logger.error(f"   Source: {ev.source}")
                logger.error(f"   Recoverable: {getattr(ev.error, 'recoverable', 'unknown')}")
    
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
    agent = BaristaAgent(userdata=userdata)
    
    await session.start(
        agent=agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()
    logger.info("Day 2 Barista Agent connected to room, session is active and listening")
    logger.info(f"Room name: {ctx.room.name}, Room SID: {ctx.room.sid}")
    logger.info(f"Agent participant: {ctx.room.local_participant.identity}")
    
    import asyncio
    await asyncio.sleep(1)
    
    participants = list(ctx.room.remote_participants.values())
    logger.info(f"Remote participants in room: {len(participants)}")
    for p in participants:
        logger.info(f"  - {p.identity} (name: {p.name})")
    
    logger.info("Day 2 Barista Agent is ready and waiting for user speech...")
    
    async def proactive_greeting():
        await asyncio.sleep(0.5)
        participants = list(ctx.room.remote_participants.values())
        if len(participants) > 0:
            logger.info("User detected, agent should greet proactively")
    
    asyncio.create_task(proactive_greeting())


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))

