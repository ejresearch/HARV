"""
Multi-Provider AI Service
Supports: OpenAI, Anthropic Claude, Google Gemini, xAI Grok
"""

import os
from typing import List, Dict, Optional
from openai import OpenAI
import anthropic
import google.generativeai as genai


class AIProvider:
    """Base class for AI providers"""

    def __init__(self):
        self.available = False
        self.error = None

    def chat(self, messages: List[Dict], system_prompt: str = "") -> str:
        raise NotImplementedError


class OpenAIProvider(AIProvider):
    """OpenAI GPT-4 / GPT-3.5 Provider"""

    def __init__(self, model: str = "gpt-4"):
        super().__init__()
        self.model = model
        api_key = os.getenv("OPENAI_API_KEY")

        if api_key and not api_key.startswith("your-"):
            try:
                self.client = OpenAI(api_key=api_key)
                self.available = True
            except Exception as e:
                self.error = str(e)
        else:
            self.error = "OPENAI_API_KEY not configured"

    def chat(self, messages: List[Dict], system_prompt: str = "") -> str:
        if not self.available:
            raise Exception(f"OpenAI not available: {self.error}")

        # Format messages for OpenAI
        openai_messages = []
        if system_prompt:
            openai_messages.append({"role": "system", "content": system_prompt})

        openai_messages.extend(messages)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=openai_messages
        )

        return response.choices[0].message.content


class ClaudeProvider(AIProvider):
    """Anthropic Claude Provider"""

    def __init__(self, model: str = "claude-3-5-sonnet-20241022"):
        super().__init__()
        self.model = model
        api_key = os.getenv("ANTHROPIC_API_KEY")

        if api_key and not api_key.startswith("your-"):
            try:
                self.client = anthropic.Anthropic(api_key=api_key)
                self.available = True
            except Exception as e:
                self.error = str(e)
        else:
            self.error = "ANTHROPIC_API_KEY not configured"

    def chat(self, messages: List[Dict], system_prompt: str = "") -> str:
        if not self.available:
            raise Exception(f"Claude not available: {self.error}")

        # Claude format: separate system prompt from messages
        response = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=system_prompt if system_prompt else "You are a helpful AI assistant.",
            messages=messages
        )

        return response.content[0].text


class GeminiProvider(AIProvider):
    """Google Gemini Provider"""

    def __init__(self, model: str = "gemini-1.5-flash"):
        super().__init__()
        self.model = model
        api_key = os.getenv("GOOGLE_API_KEY")

        if api_key and not api_key.startswith("your-"):
            try:
                genai.configure(api_key=api_key)
                self.client = genai.GenerativeModel(model)
                self.available = True
            except Exception as e:
                self.error = str(e)
        else:
            self.error = "GOOGLE_API_KEY not configured"

    def chat(self, messages: List[Dict], system_prompt: str = "") -> str:
        if not self.available:
            raise Exception(f"Gemini not available: {self.error}")

        # Format for Gemini
        chat_history = []
        current_message = ""

        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            if msg["role"] == "system":
                # Gemini doesn't have system role, prepend to first user message
                continue
            chat_history.append({
                "role": role,
                "parts": [msg["content"]]
            })

        # Get last user message
        if messages:
            current_message = messages[-1]["content"]
            chat_history = chat_history[:-1]  # Remove last message from history

        # Start chat with history
        chat = self.client.start_chat(history=chat_history)

        # Add system prompt to first message if exists
        if system_prompt and current_message:
            current_message = f"{system_prompt}\n\n{current_message}"

        response = chat.send_message(current_message)
        return response.text


class GrokProvider(AIProvider):
    """xAI Grok Provider (OpenAI-compatible API)"""

    def __init__(self, model: str = "grok-3"):
        super().__init__()
        self.model = model
        api_key = os.getenv("XAI_API_KEY")

        if api_key and not api_key.startswith("your-"):
            try:
                # Grok uses OpenAI-compatible API
                self.client = OpenAI(
                    api_key=api_key,
                    base_url="https://api.x.ai/v1"
                )
                self.available = True
            except Exception as e:
                self.error = str(e)
        else:
            self.error = "XAI_API_KEY not configured"

    def chat(self, messages: List[Dict], system_prompt: str = "") -> str:
        if not self.available:
            raise Exception(f"Grok not available: {self.error}")

        # Format messages for Grok (OpenAI-compatible)
        grok_messages = []
        if system_prompt:
            grok_messages.append({"role": "system", "content": system_prompt})

        grok_messages.extend(messages)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=grok_messages
        )

        return response.choices[0].message.content


class AIProviderManager:
    """Manages multiple AI providers"""

    PROVIDERS = {
        "openai-gpt4": {"class": OpenAIProvider, "model": "gpt-4", "name": "OpenAI GPT-4"},
        "openai-gpt4-turbo": {"class": OpenAIProvider, "model": "gpt-4-turbo", "name": "OpenAI GPT-4 Turbo"},
        "openai-gpt35": {"class": OpenAIProvider, "model": "gpt-3.5-turbo", "name": "OpenAI GPT-3.5"},
        "claude-sonnet": {"class": ClaudeProvider, "model": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet"},
        "claude-opus": {"class": ClaudeProvider, "model": "claude-3-opus-20240229", "name": "Claude 3 Opus"},
        "claude-haiku": {"class": ClaudeProvider, "model": "claude-3-haiku-20240307", "name": "Claude 3 Haiku"},
        "gemini-flash": {"class": GeminiProvider, "model": "gemini-1.5-flash", "name": "Gemini 1.5 Flash"},
        "gemini-pro": {"class": GeminiProvider, "model": "gemini-1.5-pro-latest", "name": "Gemini 1.5 Pro"},
        "grok": {"class": GrokProvider, "model": "grok-3", "name": "xAI Grok 3"},
    }

    @classmethod
    def get_provider(cls, provider_id: str) -> AIProvider:
        """Get an AI provider instance"""
        if provider_id not in cls.PROVIDERS:
            raise ValueError(f"Unknown provider: {provider_id}")

        config = cls.PROVIDERS[provider_id]
        return config["class"](model=config["model"])

    @classmethod
    def list_providers(cls) -> List[Dict]:
        """List all available providers and their status"""
        providers = []
        for provider_id, config in cls.PROVIDERS.items():
            provider = cls.get_provider(provider_id)
            providers.append({
                "id": provider_id,
                "name": config["name"],
                "model": config["model"],
                "available": provider.available,
                "error": provider.error
            })
        return providers

    @classmethod
    def chat(cls, provider_id: str, messages: List[Dict], system_prompt: str = "") -> str:
        """Send chat request to specified provider"""
        provider = cls.get_provider(provider_id)
        return provider.chat(messages, system_prompt)
