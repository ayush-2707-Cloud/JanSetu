"""Gemini Pro API Client & Structured Inference Pipeline.

Configures Google GenAI SDK with structured output enforcement, system prompts,
and automatic deterministic fallback for offline testing or unconfigured API keys.
"""

from __future__ import annotations
import json
import logging
from typing import Optional, Dict, Any, Type, TypeVar
from pydantic import BaseModel
from app.config import settings

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class GeminiClient:
    """Wrapper around Google GenAI SDK with structured schema generation."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None
        self._init_client()

    def _init_client(self) -> None:
        """Initialize google.genai Client if API key is provided."""
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
                logger.info(f"Gemini client initialized successfully with model {self.model_name}")
            except Exception as e:
                logger.warning(f"Could not initialize google.genai Client: {e}. Running in heuristic fallback mode.")
                self._client = None
        else:
            self._client = None

    @property
    def is_live(self) -> bool:
        """True if live Gemini API is configured and available."""
        return self._client is not None

    def generate_structured(
        self,
        prompt: str,
        system_instruction: str,
        response_model: Type[T],
        temperature: float = 0.1,
    ) -> Optional[T]:
        """Call Gemini API with structured JSON output enforced against a Pydantic schema."""
        if not self.is_live:
            return None

        try:
            from google.genai import types
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=response_model,
                    temperature=temperature,
                )
            )
            if response and response.text:
                data = json.loads(response.text)
                return response_model.model_validate(data)
        except Exception as e:
            logger.warning(f"Live Gemini API call failed: {e}. Falling back to deterministic engine.")
            return None

    def generate_text(
        self,
        prompt: str,
        system_instruction: str,
        temperature: float = 0.2,
    ) -> Optional[str]:
        """Standard text generation call."""
        if not self.is_live:
            return None

        try:
            from google.genai import types
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature,
                )
            )
            return response.text if response else None
        except Exception as e:
            logger.warning(f"Live Gemini text call failed: {e}.")
            return None


# Global Gemini client singleton
gemini_client = GeminiClient()
