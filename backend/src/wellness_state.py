"""Wellness state management for health & wellness companion agent."""

import json
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional


@dataclass
class WellnessCheckIn:
    """Represents a wellness check-in with mood, energy, and objectives."""
    date_time: str = field(default_factory=lambda: datetime.now().isoformat())
    mood: Optional[str] = None
    energy_level: Optional[str] = None
    objectives: list[str] = field(default_factory=list)
    summary: Optional[str] = None
    session_id: Optional[str] = None

    def is_complete(self) -> bool:
        """Check if all required fields are filled."""
        return (
            self.mood is not None
            and self.energy_level is not None
            and len(self.objectives) > 0
        )

    def get_missing_fields(self) -> list[str]:
        """Get list of missing required fields."""
        missing = []
        if self.mood is None:
            missing.append("mood")
        if self.energy_level is None:
            missing.append("energy_level")
        if len(self.objectives) == 0:
            missing.append("objectives (at least 1)")
        return missing

    def to_dict(self) -> dict:
        """Convert check-in to dictionary for JSON serialization."""
        return asdict(self)


class WellnessLog:
    """Manages wellness log persistence to JSON file."""
    
    def __init__(self, log_file: str = "wellness_log.json"):
        """Initialize wellness log with file path.
        
        Args:
            log_file: Path to JSON file (relative to backend directory)
        """
        # Store log file path relative to backend directory
        backend_dir = Path(__file__).parent.parent
        self.log_path = backend_dir / log_file
        
    def load_log(self) -> list[dict]:
        """Load all entries from the wellness log JSON file.
        
        Returns:
            List of check-in dictionaries, or empty list if file doesn't exist
        """
        if not self.log_path.exists():
            return []
        
        try:
            with open(self.log_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                # Ensure it's a list
                if isinstance(data, list):
                    return data
                else:
                    # If it's a single object, wrap it in a list
                    return [data]
        except (json.JSONDecodeError, IOError) as e:
            # If file is corrupted, return empty list
            print(f"Warning: Could not load wellness log: {e}")
            return []
    
    def save_check_in(self, check_in: WellnessCheckIn) -> None:
        """Save a check-in to the wellness log JSON file.
        
        Args:
            check_in: WellnessCheckIn object to save
        """
        # Load existing entries
        entries = self.load_log()
        
        # Add new entry
        entries.append(check_in.to_dict())
        
        # Ensure directory exists
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save to file
        with open(self.log_path, "w", encoding="utf-8") as f:
            json.dump(entries, f, indent=2, ensure_ascii=False)
    
    def get_recent_entries(self, days: int = 7) -> list[dict]:
        """Get recent entries from the last N days.
        
        Args:
            days: Number of days to look back
            
        Returns:
            List of check-in dictionaries from the last N days
        """
        entries = self.load_log()
        if not entries:
            return []
        
        # Filter entries from the last N days
        cutoff_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
        recent = []
        
        for entry in entries:
            try:
                entry_date = datetime.fromisoformat(entry.get("date_time", ""))
                if entry_date.timestamp() >= cutoff_date:
                    recent.append(entry)
            except (ValueError, TypeError):
                # Skip entries with invalid dates
                continue
        
        # Sort by date (most recent first)
        recent.sort(key=lambda x: x.get("date_time", ""), reverse=True)
        return recent
    
    def get_last_entry(self) -> Optional[dict]:
        """Get the most recent check-in entry.
        
        Returns:
            Most recent check-in dictionary, or None if no entries exist
        """
        entries = self.load_log()
        if not entries:
            return None
        
        # Sort by date (most recent first) and return the first one
        try:
            sorted_entries = sorted(
                entries,
                key=lambda x: x.get("date_time", ""),
                reverse=True
            )
            return sorted_entries[0] if sorted_entries else None
        except (KeyError, TypeError):
            # If sorting fails, just return the last entry in the list
            return entries[-1] if entries else None
    
    def format_context_for_agent(self) -> str:
        """Format the last check-in as context for the agent.
        Returns a natural reference to previous check-ins that can be used in conversation.
        
        Returns:
            Formatted string describing the last check-in in a conversational way, or empty string if none
        """
        last_entry = self.get_last_entry()
        if not last_entry:
            return ""
        
        try:
            # Parse date
            entry_date = datetime.fromisoformat(last_entry.get("date_time", ""))
            now = datetime.now()
            days_ago = (now - entry_date).days
            
            # Build natural reference based on what was mentioned
            references = []
            
            # Reference energy level (as per example)
            if last_entry.get("energy_level"):
                energy = last_entry["energy_level"].lower()
                if "low" in energy or energy in ["1", "2", "3", "4"]:
                    references.append("you mentioned being low on energy")
                elif "high" in energy or energy in ["7", "8", "9", "10"]:
                    references.append("you mentioned having high energy")
                else:
                    references.append(f"your energy level was {last_entry['energy_level']}")
            
            # Reference mood if available
            if last_entry.get("mood") and not references:
                mood = last_entry["mood"].lower()
                if any(word in mood for word in ["anxious", "stressed", "worried", "down", "sad"]):
                    references.append(f"you mentioned feeling {last_entry['mood']}")
                elif any(word in mood for word in ["good", "great", "happy", "excited", "positive"]):
                    references.append(f"you mentioned feeling {last_entry['mood']}")
            
            # Build the reference string
            if references:
                if days_ago == 0:
                    time_ref = "Earlier today"
                elif days_ago == 1:
                    time_ref = "Last time we talked"
                elif days_ago < 7:
                    time_ref = f"{days_ago} days ago"
                else:
                    time_ref = "Last time we talked"
                
                reference = f"{time_ref}, {references[0]}."
                return reference + " How does today compare?"
            else:
                # Fallback if no specific reference available
                if days_ago == 1:
                    return "Last time we talked, you completed a wellness check-in. How does today compare?"
                elif days_ago > 1:
                    return f"We had a check-in {days_ago} days ago. How does today compare?"
                else:
                    return "How does today compare to earlier?"
                    
        except (ValueError, KeyError, TypeError):
            return ""

