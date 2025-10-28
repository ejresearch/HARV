# 4-Layer Memory System

The simplified Harv now includes an intelligent 4-layer memory system that makes the AI tutor much more personalized and context-aware.

## What Changed

### Database Models (backend/models.py)
Added 3 new tables:
- **OnboardingSurvey** - Stores student learning profiles (style, pace, background)
- **MemorySummary** - Stores learning insights from past conversations
- **UserProgress** - Tracks module completion, grades, time spent

Updated **Module** model with:
- `system_prompt` - System-level teaching configuration
- `module_prompt` - Module-specific prompts
- `system_corpus` - System-wide knowledge corpus
- `module_corpus` - Module-specific corpus
- `dynamic_corpus` - Dynamic/real-time corpus

Changed **Conversation** model:
- `messages` → `messages_json` (for compatibility with memory system)

### Memory Assembly (backend/memory_context_enhanced.py)
New `DynamicMemoryAssembler` class that dynamically builds context from 4 layers:

#### Layer 1: System Data (Cross-course learning profile)
- Student's learning style (visual, auditory, kinesthetic, adaptive)
- Preferred pace (slow, moderate, fast)
- Background knowledge level (beginner, intermediate, advanced)
- Cross-module mastery (history from other modules)

#### Layer 2: Module Data (Subject-specific context)
- Module information (title, description, objectives)
- Teaching configuration (system prompt, module prompt)
- Knowledge corpus (system, module, dynamic)
- Socratic teaching strategy

#### Layer 3: Conversation Data (Real-time dialogue context)
- Current conversation state (new vs. active)
- Last 10 messages from this conversation
- Dialogue context summary
- Engagement patterns analysis

#### Layer 4: Prior Knowledge (1 per module conversation memory)
- Most recent conversation from each other module
- Key insights from previous learning
- Mastered concepts list
- Cross-module connections

### Chat Endpoint (backend/main.py)
The `/chat` endpoint now:
1. Calls `DynamicMemoryAssembler` to build rich context
2. Uses assembled prompt instead of simple template
3. Falls back to simple memory if assembly fails
4. Stores messages in `messages_json` format

## How It Works

When a student sends a message:

```python
# Old simple system (last 10 messages only)
system_prompt = f"You are a tutor for {module.title}..."
messages = last_10_messages

# New 4-layer system (intelligent context)
memory_assembler = DynamicMemoryAssembler(db)
context = memory_assembler.assemble_dynamic_context(
    user_id=student.id,
    module_id=module.id,
    current_message=message,
    conversation_id=conversation.id
)
system_prompt = context['assembled_prompt']
```

The assembled prompt includes:
```
=== HARV DYNAMIC MEMORY CONTEXT ===
STUDENT PROFILE: adaptive learner, moderate pace, beginner background
PRIOR EXPERIENCE: 2 previous module interactions

MODULE CONTEXT: Communication Theory - Study of human communication
TEACHING APPROACH: Use Socratic questioning to guide discovery
MODULE STRATEGY: Build from concrete examples to theory

CONVERSATION STATE: active_conversation
DIALOGUE CONTEXT: Student: How do I... | Harv: What makes...

PRIOR LEARNING: Ethics Module - Previous experience with critical thinking
PRIOR LEARNING: Rhetoric Module - Previous experience with persuasion

SOCRATIC APPROACH: Use strategic questions to guide discovery

STUDENT MESSAGE: [current message]
RESPONSE STRATEGY: Use Socratic questioning to deepen exploration
```

## Benefits

1. **Personalized Learning**: Adapts to student's learning style and pace
2. **Context Awareness**: Remembers past conversations and modules
3. **Progressive Difficulty**: Adjusts based on demonstrated mastery
4. **Cross-Module Insights**: Connects knowledge across different topics
5. **Engagement Tracking**: Detects when students need more support

## Database Tables

Run this to see all tables:
```bash
cd backend
sqlite3 harv_simple.db ".tables"
```

Output:
```
conversations       modules             user_progress
memory_summaries    onboarding_surveys  users
```

## Testing the Memory System

1. Start the app: `./start.sh`
2. Open http://localhost:3000
3. Select a module and start chatting
4. The AI tutor will use the 4-layer memory to:
   - Remember your conversation history
   - Adapt to your responses
   - Track your progress
   - Make connections to other modules (if you've used them)

## Memory System Metrics

Check `/chat` endpoint response to see memory metrics:
- Total context characters
- Layer weights (System: 25%, Module: 35%, Conversation: 25%, Prior: 15%)
- Database status (which layers have data)

## Future Enhancements

The memory system is ready for:
- Onboarding survey UI (to capture learning styles)
- Progress tracking dashboard
- Memory summary generation after conversations
- Cross-module knowledge graph
- Adaptive difficulty based on performance
