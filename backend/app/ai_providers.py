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
    """OpenAI GPT-5 / o3 / o4 Provider"""

    def __init__(self, model: str = "gpt-5"):
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

    def __init__(self, model: str = "claude-opus-4-1"):
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

    def __init__(self, model: str = "gemini-2.5-pro"):
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


class PerplexityProvider(AIProvider):
    """Perplexity AI Provider (OpenAI-compatible API)"""

    def __init__(self, model: str = "sonar"):
        super().__init__()
        self.model = model
        api_key = os.getenv("PERPLEXITY_API_KEY")

        if api_key and not api_key.startswith("your-"):
            try:
                # Perplexity uses OpenAI-compatible API
                self.client = OpenAI(
                    api_key=api_key,
                    base_url="https://api.perplexity.ai"
                )
                self.available = True
            except Exception as e:
                self.error = str(e)
        else:
            self.error = "PERPLEXITY_API_KEY not configured"

    def chat(self, messages: List[Dict], system_prompt: str = "") -> str:
        if not self.available:
            raise Exception(f"Perplexity not available: {self.error}")

        # Format messages for Perplexity (OpenAI-compatible)
        perplexity_messages = []
        if system_prompt:
            perplexity_messages.append({"role": "system", "content": system_prompt})

        perplexity_messages.extend(messages)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=perplexity_messages
        )

        return response.choices[0].message.content


class AIProviderManager:
    """Manages multiple AI providers"""

    PROVIDERS = {
        # OpenAI GPT-5 Series
        "openai-gpt5": {"class": OpenAIProvider, "model": "gpt-5", "name": "OpenAI GPT-5"},
        "openai-gpt5-mini": {"class": OpenAIProvider, "model": "gpt-5-mini", "name": "OpenAI GPT-5 Mini"},
        "openai-gpt5-nano": {"class": OpenAIProvider, "model": "gpt-5-nano", "name": "OpenAI GPT-5 Nano"},
        "openai-gpt5-chat": {"class": OpenAIProvider, "model": "gpt-5-chat", "name": "OpenAI GPT-5 Chat"},

        # OpenAI o3/o4 Reasoning Models
        "openai-o3": {"class": OpenAIProvider, "model": "o3", "name": "OpenAI o3 (Thinking)"},
        "openai-o4-mini": {"class": OpenAIProvider, "model": "o4-mini", "name": "OpenAI o4 Mini"},

        # OpenAI Multimodal & Open-Weight
        "openai-gpt-image-1": {"class": OpenAIProvider, "model": "gpt-image-1", "name": "OpenAI GPT-Image-1 (Multimodal)"},
        "openai-oss-120b": {"class": OpenAIProvider, "model": "gpt-oss-120b", "name": "OpenAI OSS 120B (Open-Weight)"},
        "openai-oss-20b": {"class": OpenAIProvider, "model": "gpt-oss-20b", "name": "OpenAI OSS 20B (Open-Weight)"},

        # Claude Opus 4 Series
        "claude-opus-4.1": {"class": ClaudeProvider, "model": "claude-opus-4-1", "name": "Claude Opus 4.1"},
        "claude-opus-4": {"class": ClaudeProvider, "model": "claude-opus-4", "name": "Claude Opus 4"},

        # Claude Sonnet 4 Series
        "claude-sonnet-4": {"class": ClaudeProvider, "model": "claude-sonnet-4", "name": "Claude Sonnet 4"},
        "claude-sonnet-3.7": {"class": ClaudeProvider, "model": "claude-sonnet-3-7", "name": "Claude Sonnet 3.7"},
        "claude-sonnet-3.5-v2": {"class": ClaudeProvider, "model": "claude-3-5-sonnet-v2", "name": "Claude Sonnet 3.5 (v2)"},

        # Claude Haiku
        "claude-haiku": {"class": ClaudeProvider, "model": "claude-3-5-haiku-20241022", "name": "Claude Haiku"},

        # xAI Grok 3
        "grok-3": {"class": GrokProvider, "model": "grok-3", "name": "xAI Grok 3"},
        "grok-3-mini": {"class": GrokProvider, "model": "grok-3-mini", "name": "xAI Grok 3 Mini"},

        # Google Gemini 2.5
        "gemini-2.5-pro": {"class": GeminiProvider, "model": "gemini-2.5-pro", "name": "Gemini 2.5 Pro"},
        "gemini-1.5-flash": {"class": GeminiProvider, "model": "gemini-1.5-flash", "name": "Gemini 1.5 Flash"},
        "gemini-1.5-pro": {"class": GeminiProvider, "model": "gemini-1.5-pro", "name": "Gemini 1.5 Pro"},

        # Perplexity AI
        "perplexity-sonar": {"class": PerplexityProvider, "model": "sonar", "name": "Perplexity Sonar"},
        "perplexity-sonar-pro": {"class": PerplexityProvider, "model": "sonar-pro", "name": "Perplexity Sonar Pro"},
        "perplexity-sonar-reasoning": {"class": PerplexityProvider, "model": "sonar-reasoning", "name": "Perplexity Sonar Reasoning"},
        "perplexity-sonar-chat": {"class": PerplexityProvider, "model": "sonar-chat", "name": "Perplexity Sonar Chat"},
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
