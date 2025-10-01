# Multi-Provider AI System

Your HARV system now supports **4 major AI providers** that you can toggle between!

## Supported Providers

### 1. **OpenAI**
- `openai-gpt4` - GPT-4 (most capable)
- `openai-gpt4-turbo` - GPT-4 Turbo (faster)
- `openai-gpt35` - GPT-3.5 Turbo (cheapest)

**Get API Key:** https://platform.openai.com/api-keys

### 2. **Anthropic Claude**
- `claude-sonnet` - Claude 3.5 Sonnet (recommended)
- `claude-opus` - Claude 3 Opus (most capable)
- `claude-haiku` - Claude 3 Haiku (fastest)

**Get API Key:** https://console.anthropic.com/

### 3. **Google Gemini**
- `gemini-flash` - Gemini 2.0 Flash (fastest)
- `gemini-pro` - Gemini 1.5 Pro (most capable)

**Get API Key:** https://aistudio.google.com/app/apikey

### 4. **xAI Grok**
- `grok` - Grok Beta

**Get API Key:** https://console.x.ai/

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New packages added:
- `anthropic` - Claude API client
- `google-generativeai` - Gemini API client

### 2. Add API Keys to `.env`

Edit `backend/.env`:

```bash
# AI Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
XAI_API_KEY=xai-...
```

**Note:** Only add keys for providers you want to use. Missing keys will just show those providers as unavailable.

### 3. Restart Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

---

## API Usage

### List Available Providers

```bash
GET /providers
```

Response:
```json
{
  "providers": [
    {
      "id": "openai-gpt4",
      "name": "OpenAI GPT-4",
      "model": "gpt-4",
      "available": true,
      "error": null
    },
    {
      "id": "claude-sonnet",
      "name": "Claude 3.5 Sonnet",
      "model": "claude-3-5-sonnet-20241022",
      "available": false,
      "error": "ANTHROPIC_API_KEY not configured"
    }
  ]
}
```

### Chat with Provider Selection

```bash
POST /chat/enhanced
```

Body:
```json
{
  "user_id": 1,
  "module_id": 1,
  "message": "What is media effects theory?",
  "provider": "claude-sonnet"
}
```

**Available provider IDs:**
- `openai-gpt4`
- `openai-gpt4-turbo`
- `openai-gpt35`
- `claude-sonnet`
- `claude-opus`
- `claude-haiku`
- `gemini-flash`
- `gemini-pro`
- `grok`

---

## How It Works

1. **Provider Manager** (`backend/app/ai_providers.py`):
   - Manages all AI provider clients
   - Handles API key configuration
   - Normalizes different API formats

2. **Chat Endpoint** (`/chat/enhanced`):
   - Takes `provider` parameter
   - Uses 4-layer memory system
   - Routes request to selected AI provider

3. **Automatic Fallback**:
   - If provider unavailable → error message
   - System prompt works with all providers

---

## Cost Comparison (per 1M tokens)

| Provider | Model | Input | Output |
|----------|-------|-------|--------|
| OpenAI | GPT-4 | $30 | $60 |
| OpenAI | GPT-4 Turbo | $10 | $30 |
| OpenAI | GPT-3.5 | $0.50 | $1.50 |
| Anthropic | Claude Opus | $15 | $75 |
| Anthropic | Claude Sonnet | $3 | $15 |
| Anthropic | Claude Haiku | $0.25 | $1.25 |
| Google | Gemini Pro | $1.25 | $5 |
| xAI | Grok | TBD | TBD |

---

## Next Steps

To add provider selection to frontend2:

1. Add dropdown in chat interface
2. Fetch available providers from `/providers`
3. Send selected `provider` in chat request
4. Display which model is being used

Want me to build this UI?
