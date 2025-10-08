# AI Models - Updated to Latest (October 2025)

## ✅ All 22 Latest AI Models Now Available

---

## 🤖 OpenAI Models (9 Models)

### GPT-5 Series
1. **GPT-5** - Flagship model (`gpt-5`)
2. **GPT-5 Mini** - Faster, cost-efficient (`gpt-5-mini`)
3. **GPT-5 Nano** - Ultra-lightweight (`gpt-5-nano`)
4. **GPT-5 Chat** - Optimized for conversations (`gpt-5-chat`)

### o3/o4 Reasoning Models
5. **o3** - Advanced reasoning/thinking model (`o3`)
6. **o4 Mini** - Compact reasoning model (`o4-mini`)

### Specialized Models
7. **GPT-Image-1** - Multimodal with vision (`gpt-image-1`)
8. **GPT-OSS 120B** - Open-weight 120B parameters (`gpt-oss-120b`)
9. **GPT-OSS 20B** - Open-weight 20B parameters (`gpt-oss-20b`)

---

## 🧠 Anthropic Claude Models (6 Models)

### Opus 4 Series
10. **Claude Opus 4.1** - Latest flagship (`claude-opus-4-1`)
11. **Claude Opus 4** - Powerful reasoning (`claude-opus-4`)

### Sonnet Series
12. **Claude Sonnet 4** - Balanced performance (`claude-sonnet-4`)
13. **Claude Sonnet 3.7** - Enhanced version (`claude-sonnet-3-7`)
14. **Claude Sonnet 3.5 (v2)** - Updated variant (`claude-3-5-sonnet-v2`)

### Haiku
15. **Claude Haiku** - Fast & efficient (`claude-3-5-haiku-20241022`)

---

## 🚀 xAI Grok Models (2 Models)

16. **Grok 3** - Latest full model (`grok-3`)
17. **Grok 3 Mini** - Compact version (`grok-3-mini`)

---

## 🌐 Google Gemini Models (3 Models)

18. **Gemini 2.5 Pro** - Latest flagship (`gemini-2.5-pro`)
19. **Gemini 1.5 Flash** - Fast responses (`gemini-1.5-flash`)
20. **Gemini 1.5 Pro** - Powerful model (`gemini-1.5-pro`)

---

## 📊 Model Selection in HARV

### Default Model
- **GPT-5** is now the default for all new chats

### How to Select
1. **Admin Users:** Can choose any of the 22 models from the dropdown
2. **Students:** Use the default model (admins control which model students use)

### Where to Change
- Chat Interface → AI Model dropdown
- Each conversation can use a different model
- Switch models mid-conversation if needed

---

## 🔑 API Key Requirements

All models require their respective API keys in `.env`:

```bash
OPENAI_API_KEY=sk-...        # For GPT-5, o3, o4, etc.
ANTHROPIC_API_KEY=sk-ant-... # For Claude Opus 4.1, Sonnet 4, etc.
XAI_API_KEY=xai-...          # For Grok 3
GOOGLE_API_KEY=AIza...       # For Gemini 2.5 Pro
```

Configure keys in: **System → API Key Configuration**

---

## 💡 Model Recommendations

### For Teaching (Socratic Tutoring)
- **GPT-5** - Best overall for education
- **Claude Opus 4.1** - Excellent reasoning and explanations
- **o3** - Best for step-by-step thinking

### For Speed
- **GPT-5 Mini** - Fast OpenAI
- **Claude Haiku** - Fast Claude
- **Grok 3 Mini** - Fast xAI

### For Cost Efficiency
- **GPT-5 Nano** - Ultra-cheap OpenAI
- **Gemini 1.5 Flash** - Free tier available

### For Advanced Reasoning
- **o3** - Best reasoning model
- **Claude Opus 4.1** - Close second
- **GPT-5** - Strong all-around

### For Multimodal (Images)
- **GPT-Image-1** - OpenAI's vision model
- **Gemini 2.5 Pro** - Excellent vision capabilities

---

## 🔄 Migration Notes

### Changed Defaults
- Old: `gpt-4o` → New: `gpt-5`
- Old: `claude-3-5-sonnet-20241022` → New: `claude-opus-4-1`
- Old: `grok-beta` → New: `grok-3`
- Old: `gemini-2.0-flash-exp` → New: `gemini-2.5-pro`

### Removed Models
- ❌ GPT-4o (superseded by GPT-5)
- ❌ GPT-4o Mini (superseded by GPT-5 Mini)
- ❌ Claude 3 Opus (superseded by Opus 4)
- ❌ Gemini 2.0 Flash Experimental (replaced by 2.5)

---

## 📈 Performance Comparison

| Model | Speed | Cost | Quality | Reasoning |
|-------|-------|------|---------|-----------|
| GPT-5 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| GPT-5 Mini | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| o3 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Claude Opus 4.1 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Claude Sonnet 4 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Claude Haiku | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Grok 3 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Gemini 2.5 Pro | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## ✅ Verification

Run this to see all available models:
```bash
curl http://localhost:8000/providers | python3 -m json.tool
```

All 22 models should show `"available": true` (if API keys are configured).
