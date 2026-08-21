"""
SQLAlchemy ORM Models for Citizen Session Persistence.
"""

from datetime import datetime, timezone
import json
from sqlalchemy import Column, String, Integer, Text, DateTime
from app.db.database import Base


class UserSessionModel(Base):
    """Stores citizen session configuration and active journey preferences."""
    __tablename__ = "user_sessions"

    session_id = Column(String(64), primary_key=True, index=True)
    active_journey_id = Column(String(128), nullable=True, default="certified-tourist-guide")
    profile_parameters_json = Column(Text, nullable=False, default="{}")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    @property
    def profile_parameters(self) -> dict:
        try:
            # pyrefly: ignore [bad-argument-type]
            return json.loads(self.profile_parameters_json or "{}")
        except Exception:
            return {}

    @profile_parameters.setter
    def profile_parameters(self, val: dict):
        # pyrefly: ignore [bad-assignment]
        self.profile_parameters_json = json.dumps(val or {})


class JourneyProgressModel(Base):
    """Tracks completed milestone steps for a citizen session."""
    __tablename__ = "journey_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(64), index=True, nullable=False)
    journey_id = Column(String(128), index=True, nullable=False)
    completed_steps_json = Column(Text, nullable=False, default="[]")
    current_step_id = Column(String(128), nullable=True)
    progress_percentage = Column(Integer, default=0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    @property
    def completed_steps(self) -> list:
        try:
            # pyrefly: ignore [bad-argument-type]
            return json.loads(self.completed_steps_json or "[]")
        except Exception:
            return []

    @completed_steps.setter
    def completed_steps(self, val: list):
        # pyrefly: ignore [bad-assignment]
        self.completed_steps_json = json.dumps(val or [])
