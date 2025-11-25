from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import List, Dict


@dataclass
class LeadCapture:
    """Simple state container for SDR-style lead collection."""

    name: str = ""
    company: str = ""
    email: str = ""
    role: str = ""
    use_case: str = ""
    team_size: str = ""
    timeline: str = ""
    budget: str = ""
    notes: List[str] = field(default_factory=list)

    REQUIRED_FIELDS = (
        "name",
        "company",
        "email",
        "role",
        "use_case",
        "team_size",
        "timeline",
    )

    def update_field(self, field_name: str, value: str) -> None:
        normalized = field_name.lower().strip()
        normalized = normalized.replace(" ", "_")
        if normalized == "usecase":
            normalized = "use_case"
        if not hasattr(self, normalized):
            raise AttributeError(f"Unknown lead field: {field_name}")
        setattr(self, normalized, value.strip())

    def add_note(self, note: str) -> None:
        clean = note.strip()
        if clean:
            self.notes.append(clean)

    def missing_fields(self) -> List[str]:
        return [field for field in self.REQUIRED_FIELDS if not getattr(self, field)]

    def is_complete(self) -> bool:
        return len(self.missing_fields()) == 0

    def to_dict(self) -> Dict[str, object]:
        payload = asdict(self)
        payload["missing_fields"] = self.missing_fields()
        payload["is_complete"] = self.is_complete()
        return payload

    def summary_pairs(self) -> Dict[str, str]:
        return {
            "Name": self.name or "unknown",
            "Company": self.company or "unknown",
            "Email": self.email or "unknown",
            "Role": self.role or "unknown",
            "UseCase": self.use_case or "unknown",
            "TeamSize": self.team_size or "unknown",
            "Timeline": self.timeline or "unknown",
            "Budget": self.budget or "unspecified",
        }


