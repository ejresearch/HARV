# ASHER Testing API
# Multi-provider A/B/C/D testing endpoint

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import os

# Import multi-provider AI service
try:
    from app.ai_providers import AIProviderManager
    MULTI_PROVIDER_AVAILABLE = True
    print("✅ ASHER: Multi-provider AI service loaded")
except ImportError:
    MULTI_PROVIDER_AVAILABLE = False
    print("⚠️ ASHER: Multi-provider AI service not available")

router = APIRouter()


class AsherTestRequest(BaseModel):
    provider: str
    message: str
    system_prompt: str = ""
    conversation_history: Optional[List[Dict]] = []


class AsherTestResponse(BaseModel):
    provider: str
    reply: str
    success: bool
    error: Optional[str] = None


@router.post("/asher/test", response_model=AsherTestResponse)
async def test_provider(request: AsherTestRequest):
    """
    Test a single AI provider with custom system prompt and reference documents

    This endpoint is designed for ASHER testing lab to send the same message
    to multiple providers simultaneously for A/B/C/D comparison.
    """

    if not MULTI_PROVIDER_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Multi-provider AI service not available. Please check ai_providers.py"
        )

    try:
        # Build messages list from conversation history
        messages = []

        # Add conversation history if exists
        if request.conversation_history:
            messages.extend(request.conversation_history)

        # Add current message (avoid duplicating if already in history)
        if not messages or messages[-1].get('content') != request.message:
            messages.append({
                "role": "user",
                "content": request.message
            })

        # Call the AI provider
        reply = AIProviderManager.chat(
            provider_id=request.provider,
            messages=messages,
            system_prompt=request.system_prompt
        )

        return AsherTestResponse(
            provider=request.provider,
            reply=reply,
            success=True,
            error=None
        )

    except ValueError as e:
        # Invalid provider ID
        raise HTTPException(
            status_code=400,
            detail=f"Invalid provider: {str(e)}"
        )

    except Exception as e:
        # Provider error (e.g., API key not configured, rate limit, etc.)
        error_message = str(e)

        # Check for common errors and provide helpful messages
        if "not available" in error_message.lower():
            if "OPENAI_API_KEY" in error_message:
                error_message = "OpenAI API key not configured. Set OPENAI_API_KEY environment variable."
            elif "ANTHROPIC_API_KEY" in error_message:
                error_message = "Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable."
            elif "GOOGLE_API_KEY" in error_message:
                error_message = "Google API key not configured. Set GOOGLE_API_KEY environment variable."
            elif "XAI_API_KEY" in error_message:
                error_message = "xAI API key not configured. Set XAI_API_KEY environment variable."

        return AsherTestResponse(
            provider=request.provider,
            reply="",
            success=False,
            error=error_message
        )


@router.get("/asher/status")
async def asher_status():
    """
    Get status of ASHER testing environment
    """

    if not MULTI_PROVIDER_AVAILABLE:
        return {
            "available": False,
            "error": "Multi-provider AI service not available",
            "providers": []
        }

    # Get all provider statuses
    providers = AIProviderManager.list_providers()

    # Filter to main 4 providers for ASHER
    main_providers = ['openai-gpt4', 'claude-sonnet', 'gemini-flash', 'grok']
    asher_providers = [p for p in providers if p['id'] in main_providers]

    return {
        "available": True,
        "providers": asher_providers,
        "total_providers": len(asher_providers),
        "available_providers": sum(1 for p in asher_providers if p['available'])
    }


@router.post("/asher/batch")
async def batch_test(
    message: str,
    system_prompt: str = "",
    providers: Optional[List[str]] = None
):
    """
    Send the same message to multiple providers simultaneously
    Returns all responses at once
    """

    if not MULTI_PROVIDER_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Multi-provider AI service not available"
        )

    # Default to all 4 main providers
    if not providers:
        providers = ['openai-gpt4', 'claude-sonnet', 'gemini-flash', 'grok']

    results = {}

    for provider_id in providers:
        try:
            reply = AIProviderManager.chat(
                provider_id=provider_id,
                messages=[{"role": "user", "content": message}],
                system_prompt=system_prompt
            )
            results[provider_id] = {
                "success": True,
                "reply": reply,
                "error": None
            }
        except Exception as e:
            results[provider_id] = {
                "success": False,
                "reply": "",
                "error": str(e)
            }

    return {
        "message": message,
        "system_prompt": system_prompt,
        "results": results
    }
