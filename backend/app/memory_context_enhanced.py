# ============================================================================
# HARV Enhanced Memory System (v2.0)
# ============================================================================
#
# This module implements HARV's 4-layer + document intelligence memory
# architecture. It dynamically assembles context from multiple database
# sources to create rich, personalized AI teaching experiences.
#
# ARCHITECTURE:
# -------------
# Layer 1: System Data - User learning profile and cross-module activity
# Layer 2: Module Data - Class inheritance + teaching configuration
# Layer 3: Conversation Data - Active dialogue with smart summarization
# Layer 4: Prior Knowledge - Real learning insights from other modules
# Layer 5: Document Intelligence - Course materials inform AI responses
#
# ENHANCEMENTS (v2.0):
# -------------------
# PHASE 1: Class-level context inheritance (class teaching philosophy)
# PHASE 2: ClassCorpus integration (shared knowledge across modules)
# PHASE 3: MemorySummary integration (real learning insights, not metadata)
# PHASE 4: Document intelligence (syllabi, study guides auto-injected)
# PHASE 5: Conversation summarization (maintain context in long dialogues)
#
# See docs/MEMORY_ARCHITECTURE.md for complete documentation.
# ============================================================================

from typing import Dict, List, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from app.models import User, Module, Conversation, OnboardingSurvey, Class, ClassCorpus, Document, MemorySummary
import json
from datetime import datetime

class DynamicMemoryAssembler:
    """
    Enhanced Memory System with Dynamic Data Injection (v2.0)

    This class assembles personalized AI context by dynamically querying
    multiple database tables and intelligently combining the data into
    optimized prompts (2000-5000 chars).

    Key Capabilities:
    - Class inheritance (modules inherit parent class context)
    - Shared knowledge base (ClassCorpus available to all modules)
    - Real learning insights (MemorySummary, not just metadata)
    - Document intelligence (course materials inform responses)
    - Conversation continuity (smart summarization for long dialogues)

    Usage:
        assembler = DynamicMemoryAssembler(db)
        context = assembler.assemble_dynamic_context(
            user_id=5,
            module_id=1,
            conversation_id="123"
        )
    """

    def __init__(self, db: Session):
        """
        Initialize the memory assembler with a database session.

        Args:
            db: SQLAlchemy database session for querying memory data
        """
        self.db = db
    
    def assemble_dynamic_context(
        self,
        user_id: int,
        module_id: int,
        current_message: str = "",
        conversation_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Main entry point - assembles optimized, dynamic memory context.

        This method orchestrates the entire memory assembly process:
        1. Fetches core entities (user, module)
        2. Injects data from 5 memory layers
        3. Assembles optimized prompt (2000-5000 chars)
        4. Returns structured context with metrics

        Args:
            user_id: Student user ID
            module_id: Current module ID
            current_message: Optional current student message
            conversation_id: Optional conversation ID for summarization (PHASE 5)

        Returns:
            Dict containing:
            - assembled_prompt: Ready-to-use AI prompt
            - context_metrics: Size and optimization metrics
            - memory_layers: All 5 layers of data for debugging
            - database_status: Boolean flags for data availability
        """

        print(f"Assembling dynamic memory context for user {user_id}, module {module_id}")

        # Get core entities from database
        user = self.db.query(User).filter(User.id == user_id).first()
        module = self.db.query(Module).filter(Module.id == module_id).first()

        # Fallback if user or module not found
        if not user or not module:
            return self._create_fallback_context(user_id, module_id)

        # ======================================================================
        # DYNAMIC DATA INJECTION - Query all 5 memory layers in parallel
        # ======================================================================

        # Layer 1: System Data - User learning profile and cross-module activity
        system_data = self._inject_system_data(user)

        # Layer 2: Module Data - PHASE 1 & 2: Class inheritance + ClassCorpus
        module_data = self._inject_module_data(module)

        # Layer 3: Conversation Data - PHASE 5: Smart summarization
        conversation_data = self._inject_conversation_data(user_id, module_id, conversation_id)

        # Layer 4: Prior Knowledge - PHASE 3: Real learning insights
        prior_knowledge = self._inject_prior_knowledge(user_id, module_id)

        # Layer 5: Document Intelligence - PHASE 4: Course materials
        document_data = self._inject_document_data(module)

        # ======================================================================
        # PROMPT ASSEMBLY - Combine all layers into optimized prompt
        # ======================================================================
        assembled_prompt = self._assemble_optimized_prompt(
            system_data, module_data, conversation_data, prior_knowledge, document_data, current_message
        )

        # Calculate optimization metrics
        context_metrics = self._calculate_context_metrics(assembled_prompt)

        print(f"Dynamic context assembled: {context_metrics['total_chars']} chars")

        # Return structured context with all layers and metrics
        return {
            'assembled_prompt': assembled_prompt,
            'context_metrics': context_metrics,
            'memory_layers': {
                'system_data': system_data,
                'module_data': module_data,
                'conversation_data': conversation_data,
                'prior_knowledge': prior_knowledge,
                'document_data': document_data  # PHASE 4: Include for debugging/inspection
            },
            'conversation_id': conversation_id,
            'database_status': {
                'onboarding': bool(system_data.get('learning_profile')),
                'module_config': bool(module_data.get('teaching_configuration')),
                'conversation_analysis': bool(conversation_data.get('state')),
                'cross_module': bool(prior_knowledge.get('prior_module_insights')),
                'documents': bool(document_data.get('class_documents') or document_data.get('module_documents'))  # PHASE 4
            }
        }
    
    def _inject_system_data(self, user: User) -> Dict[str, Any]:
        """
        LAYER 1: System Data Injection - Student learning profile and cross-module activity.

        Queries the OnboardingSurvey table to get the student's learning preferences
        (style, pace, background). Also tracks cross-module activity to understand
        which modules the student has completed.

        Args:
            user: User model instance

        Returns:
            Dict containing:
            - learning_profile: Learning style, pace, background knowledge level
            - cross_module_mastery: List of completed conversations (last 5)
        """

        # Get onboarding survey from database
        onboarding = self.db.query(OnboardingSurvey).filter(
            OnboardingSurvey.user_id == user.id
        ).first()

        # Get completed conversations for cross-module insights
        completed_conversations = self.db.query(Conversation).filter(
            Conversation.user_id == user.id
        ).all()

        return {
            'learning_profile': {
                'style': getattr(onboarding, 'learning_style', 'adaptive') if onboarding else 'adaptive',
                'pace': getattr(onboarding, 'preferred_pace', 'moderate') if onboarding else 'moderate',
                'background': getattr(onboarding, 'background_knowledge', 'beginner') if onboarding else 'beginner'
            },
            'cross_module_mastery': [
                {
                    'module_id': conv.module_id,
                    'last_activity': conv.updated_at.isoformat() if conv.updated_at else None,
                    'message_count': len(json.loads(conv.messages_json)) if conv.messages_json else 0
                }
                for conv in completed_conversations[-5:]  # Last 5 conversations for context
            ]
        }
    
    def _inject_module_data(self, module: Module) -> Dict[str, Any]:
        """
        LAYER 2: Module Data Injection - Class inheritance + teaching configuration.

        PHASE 1 & 2 ENHANCEMENTS:
        - Queries parent Class table to get class-level teaching philosophy
        - Queries ClassCorpus table to get shared knowledge base
        - Module inherits class context (cascading configuration)

        This enables:
        - Shared teaching philosophy across all modules in a class
        - Class-wide knowledge base (foundational concepts, common misconceptions)
        - Module-specific teaching strategies layered on top

        Args:
            module: Module model instance

        Returns:
            Dict containing:
            - class_context: Parent class data (PHASE 1)
            - class_corpus: Shared knowledge entries (PHASE 2)
            - module_info: Module title, description
            - teaching_configuration: Module-specific prompts
            - socratic_strategy: Generated teaching strategy
        """

        # ======================================================================
        # PHASE 1: CLASS INHERITANCE - Fetch parent class context
        # ======================================================================
        parent_class = None
        class_context = {}
        class_corpus_entries = []

        if module.class_id:
            # Query parent Class table
            parent_class = self.db.query(Class).filter(Class.id == module.class_id).first()
            if parent_class:
                # Extract class-level teaching philosophy and objectives
                class_context = {
                    'id': parent_class.id,
                    'title': parent_class.title,
                    'description': parent_class.description,
                    'system_prompt': parent_class.system_prompt or '',  # Cascades to all modules
                    'learning_objectives': parent_class.learning_objectives or ''
                }

                # ==============================================================
                # PHASE 2: CLASS CORPUS - Fetch shared knowledge base
                # ==============================================================
                class_corpus = self.db.query(ClassCorpus).filter(
                    ClassCorpus.class_id == module.class_id
                ).order_by(ClassCorpus.order_index).all()  # Ordered by priority

                # Build corpus entries list
                class_corpus_entries = [
                    {
                        'title': entry.title,
                        'content': entry.content,
                        'type': entry.type,  # 'knowledge', 'reference', 'misconception'
                        'order_index': entry.order_index
                    }
                    for entry in class_corpus
                ]

        # Get module-specific configuration
        module_config = {
            'system_prompt': getattr(module, 'system_prompt', ''),
            'module_prompt': getattr(module, 'module_prompt', ''),
            'system_corpus': getattr(module, 'system_corpus', ''),
            'module_corpus': getattr(module, 'module_corpus', ''),
            'dynamic_corpus': getattr(module, 'dynamic_corpus', '')
        }

        return {
            'class_context': class_context,  # PHASE 1: Inherited class context
            'class_corpus': class_corpus_entries,  # PHASE 2: Shared knowledge base
            'module_info': {
                'id': module.id,
                'title': module.title,
                'description': module.description
            },
            'teaching_configuration': module_config,
            'socratic_strategy': self._generate_socratic_strategy(module_config)
        }
    
    def _inject_conversation_data(self, user_id: int, module_id: int, conversation_id: Optional[str]) -> Dict[str, Any]:
        """
        LAYER 3: Conversation Data Injection - Active dialogue with smart summarization.

        PHASE 5 ENHANCEMENT:
        - Implements sliding window approach (last 10 messages full, older summarized)
        - Maintains conversation continuity without context bloat
        - Detects breakthrough moments and key insights

        Args:
            user_id: Student user ID
            module_id: Current module ID
            conversation_id: Optional conversation ID for retrieval

        Returns:
            Dict containing:
            - state: 'new_conversation' or 'active_conversation'
            - message_history: Last 10 messages (full context)
            - old_messages_summary: Summarized older messages (PHASE 5)
            - dialogue_context: Extracted conversation state
            - conversation_analysis: Engagement metrics
        """

        # Query Conversation table
        conversation = None
        if conversation_id:
            conversation = self.db.query(Conversation).filter(
                and_(
                    Conversation.id == conversation_id,
                    Conversation.user_id == user_id,
                    Conversation.module_id == module_id
                )
            ).first()

        # Handle new conversation (no history yet)
        if not conversation or not conversation.messages_json:
            return {
                'state': 'new_conversation',
                'message_history': [],
                'old_messages_summary': None,
                'dialogue_context': 'Ready to begin Socratic exploration.'
            }

        # Parse JSON messages from database
        try:
            messages = json.loads(conversation.messages_json)
        except (json.JSONDecodeError, TypeError):
            messages = []

        # ======================================================================
        # PHASE 5: CONVERSATION SUMMARIZATION - Sliding window approach
        # ======================================================================

        old_messages_summary = None
        recent_messages = messages[-10:]  # Keep last 10 messages in full detail

        if len(messages) > 20:
            # For long conversations, summarize older messages (before last 10)
            old_messages = messages[:-10]
            old_messages_summary = self._summarize_old_messages(old_messages)

        return {
            'state': 'active_conversation',
            'message_history': recent_messages,  # Last 10 messages (full)
            'old_messages_summary': old_messages_summary,  # PHASE 5: Summarized older messages
            'dialogue_context': self._extract_dialogue_context(messages),
            'conversation_analysis': self._analyze_conversation_patterns(messages)
        }

    def _summarize_old_messages(self, old_messages: List[Dict]) -> str:
        """
        PHASE 5: Intelligent conversation summarization using extractive approach.

        Instead of keeping all old messages (context bloat), this method:
        1. Identifies breakthrough moments ("I understand", "makes sense")
        2. Extracts key student questions
        3. Preserves important teaching moments
        4. Creates concise summary (200-500 chars)

        This maintains conversation continuity while optimizing token usage.

        Args:
            old_messages: List of message dicts from before the last 10 messages

        Returns:
            String summary of key conversation moments
        """

        if not old_messages:
            return ""

        # Extract key insights using pattern matching
        key_insights = []
        student_questions = []
        breakthroughs = []

        for i, msg in enumerate(old_messages):
            role = msg.get('role', '')
            content = msg.get('content', '').lower()

            # Identify important moments
            if role == 'user':
                # Track student questions
                if '?' in content:
                    student_questions.append(msg.get('content', '')[:100])

                # Identify breakthrough moments
                if any(word in content for word in ['understand', 'i see', 'makes sense', 'oh', 'aha']):
                    breakthroughs.append(f"Message {i}: Student showed understanding")

            elif role == 'assistant':
                # Track key teaching moments (questions that guide discovery)
                if '?' in content and any(word in content for word in ['why', 'how', 'what', 'when']):
                    key_insights.append(f"Explored: {msg.get('content', '')[:80]}...")

        # Build concise summary
        summary_parts = []

        summary_parts.append(f"Earlier conversation ({len(old_messages)} messages):")

        if breakthroughs:
            summary_parts.append(f"  Breakthrough moments: {len(breakthroughs)}")

        if student_questions:
            summary_parts.append(f"  Student explored {len(student_questions)} questions")
            if student_questions:
                summary_parts.append(f"  Early question: \"{student_questions[0]}\"")

        if key_insights:
            summary_parts.append(f"  Key explorations:")
            for insight in key_insights[:3]:  # Top 3 insights
                summary_parts.append(f"    - {insight}")

        return "\n".join(summary_parts)

    def _inject_prior_knowledge(self, user_id: int, current_module_id: int) -> Dict[str, Any]:
        """
        LAYER 4: Prior Knowledge Injection - Real learning insights from other modules.

        PHASE 3 ENHANCEMENT:
        - Queries MemorySummary table instead of just conversation metadata
        - Extracts what students actually learned and how they learned it
        - Provides specific mastered concepts that carry across modules

        This enables true cross-module intelligence:
        - AI can reference learning from other modules
        - Teaching builds on previously mastered concepts
        - Connections between modules become explicit

        Args:
            user_id: Student user ID
            current_module_id: Current module (excluded from prior knowledge)

        Returns:
            Dict containing:
            - prior_module_insights: List of learning insights from other modules (top 3)
            - mastered_concepts: List of key concepts student has mastered (top 5)
        """

        # ======================================================================
        # PHASE 3: MEMORY SUMMARY INTEGRATION - Query actual learning insights
        # ======================================================================

        # Query MemorySummary table for insights from OTHER modules
        memory_summaries = self.db.query(MemorySummary).filter(
            and_(
                MemorySummary.user_id == user_id,
                MemorySummary.module_id != current_module_id,  # Exclude current module
                MemorySummary.module_id.isnot(None)
            )
        ).order_by(desc(MemorySummary.created_at)).all()  # Most recent first

        # Build insights dictionary (one entry per module)
        module_insights = {}
        for summary in memory_summaries:
            if summary.module_id not in module_insights:
                # Get module title for context
                module = self.db.query(Module).filter(Module.id == summary.module_id).first()
                if module:
                    # Extract actual learning content from MemorySummary
                    module_insights[summary.module_id] = {
                        'module_title': module.title,
                        'what_learned': summary.what_learned or 'General understanding developed',
                        'how_learned': summary.how_learned or 'Through Socratic dialogue',
                        'key_concepts': summary.key_concepts or '',
                        'last_activity': summary.created_at.isoformat() if summary.created_at else None
                    }

        # Extract and deduplicate all mastered concepts across modules
        all_concepts = []
        for insight in module_insights.values():
            if insight['key_concepts']:
                # key_concepts stored as comma-separated string
                concepts_str = insight['key_concepts']
                if concepts_str:
                    all_concepts.extend([c.strip() for c in concepts_str.split(',') if c.strip()])

        return {
            'prior_module_insights': list(module_insights.values())[:3],  # Top 3 most recent modules
            'mastered_concepts': list(set(all_concepts))[:5]  # Top 5 unique concepts
        }

    def _inject_document_data(self, module: Module) -> Dict[str, Any]:
        """
        LAYER 5: Document Intelligence - Course materials automatically inform AI.

        PHASE 4 ENHANCEMENT (NEW FEATURE):
        - Queries Document table for uploaded course materials
        - Class-level documents (syllabus) available in all modules
        - Module-specific documents (study guides) provide focused context
        - Intelligent chunking (2000 chars) prevents context bloat

        This enables document-informed teaching:
        - AI references actual syllabus content
        - Study guides inform question strategy
        - Course materials visible to AI without manual copy-paste

        Args:
            module: Module model instance

        Returns:
            Dict containing:
            - class_documents: List of class-level documents (chunked)
            - module_documents: List of module-specific documents (chunked)
        """

        # ======================================================================
        # PHASE 4: DOCUMENT INTELLIGENCE - Query uploaded course materials
        # ======================================================================

        # Query module-specific documents
        module_documents = self.db.query(Document).filter(
            Document.module_id == module.id
        ).all()

        # Query class-level documents (if module belongs to a class)
        class_documents = []
        if module.class_id:
            class_documents = self.db.query(Document).filter(
                Document.class_id == module.class_id
            ).all()

        # Document chunking function (2000 char preview)
        def chunk_document(doc):
            """
            Chunks document content to 2000 characters to optimize context usage.
            Full documents could be 50KB+, we only need first 2000 chars for AI context.
            """
            content = doc.content or ''
            chunk_size = 2000
            return {
                'filename': doc.filename,
                'content_preview': content[:chunk_size] + ('...' if len(content) > chunk_size else ''),
                'full_length': len(content),
                'uploaded_at': doc.uploaded_at.isoformat() if doc.uploaded_at else None
            }

        return {
            'class_documents': [chunk_document(doc) for doc in class_documents],  # Available in all modules
            'module_documents': [chunk_document(doc) for doc in module_documents]  # Module-specific
        }

    def _assemble_optimized_prompt(
        self,
        system_data: Dict,
        module_data: Dict,
        conversation_data: Dict,
        prior_knowledge: Dict,
        document_data: Dict,  # PHASE 4: Document content
        current_message: str
    ) -> str:
        """
        Assembles optimized AI prompt from all 5 memory layers.

        This method combines all dynamic data into a structured prompt (2000-5000 chars)
        that the AI will use to generate contextual, personalized responses.

        Prompt Structure:
        1. Student profile (learning style, pace, background)
        2. Class context (PHASE 1: teaching philosophy, objectives)
        3. Class-wide knowledge (PHASE 2: shared corpus entries)
        4. Module context (title, description, teaching strategy)
        5. Class documents (PHASE 4: syllabi, shared materials)
        6. Module documents (PHASE 4: study guides, module materials)
        7. Prior learning (PHASE 3: insights from other modules, mastered concepts)
        8. Conversation state (PHASE 5: recent messages + summarized old messages)
        9. Socratic approach reminder

        Args:
            system_data: Layer 1 data (learning profile, cross-module activity)
            module_data: Layer 2 data (class inheritance, teaching config)
            conversation_data: Layer 3 data (active dialogue, summarization)
            prior_knowledge: Layer 4 data (learning insights, mastered concepts)
            document_data: Layer 5 data (course materials)
            current_message: Current student message (if any)

        Returns:
            String containing fully assembled, optimized AI prompt
        """

        prompt_sections = []

        # ======================================================================
        # HEADER: HARV Dynamic Memory Context
        # ======================================================================
        prompt_sections.append("=== HARV DYNAMIC MEMORY CONTEXT ===")

        # ======================================================================
        # LAYER 1: STUDENT PROFILE - Learning style and prior activity
        # ======================================================================
        learning_profile = system_data['learning_profile']
        prompt_sections.append(f"STUDENT PROFILE: {learning_profile['style']} learner, {learning_profile['pace']} pace, {learning_profile['background']} background")

        # Cross-module experience indicator
        if system_data['cross_module_mastery']:
            mastery_count = len(system_data['cross_module_mastery'])
            prompt_sections.append(f"PRIOR EXPERIENCE: {mastery_count} previous module interactions")

        # ======================================================================
        # PHASE 1: CLASS-LEVEL CONTEXT - Inherited teaching philosophy
        # ======================================================================
        class_context = module_data.get('class_context', {})
        if class_context and class_context.get('title'):
            prompt_sections.append(f"\nCLASS: {class_context['title']}")
            if class_context.get('system_prompt'):
                prompt_sections.append(f"CLASS TEACHING PHILOSOPHY: {class_context['system_prompt']}")
            if class_context.get('learning_objectives'):
                prompt_sections.append(f"CLASS LEARNING OBJECTIVES: {class_context['learning_objectives']}")

        # ======================================================================
        # PHASE 2: CLASS-WIDE KNOWLEDGE BASE - Shared corpus across modules
        # ======================================================================
        class_corpus = module_data.get('class_corpus', [])
        if class_corpus:
            prompt_sections.append(f"\nCLASS-WIDE KNOWLEDGE (applies to all modules):")
            for entry in class_corpus:
                prompt_sections.append(f"  [{entry['type'].upper()}] {entry['title']}: {entry['content']}")

        # === DYNAMIC MODULE CONTEXT ===
        module_info = module_data['module_info']
        teaching_config = module_data['teaching_configuration']

        prompt_sections.append(f"\nMODULE CONTEXT: {module_info['title']} - {module_info['description']}")

        # Inject your GUI configuration
        if teaching_config['system_prompt']:
            prompt_sections.append(f"MODULE TEACHING APPROACH: {teaching_config['system_prompt']}")

        if teaching_config['module_prompt']:
            prompt_sections.append(f"MODULE STRATEGY: {teaching_config['module_prompt']}")

        # === PHASE 4: DOCUMENT INTELLIGENCE (Course Materials) ===
        if document_data['class_documents']:
            prompt_sections.append(f"\nCLASS MATERIALS (applies to all modules):")
            for doc in document_data['class_documents']:
                prompt_sections.append(f"  [{doc['filename']}]")
                prompt_sections.append(f"    {doc['content_preview']}")

        if document_data['module_documents']:
            prompt_sections.append(f"\nMODULE-SPECIFIC MATERIALS:")
            for doc in document_data['module_documents']:
                prompt_sections.append(f"  [{doc['filename']}]")
                prompt_sections.append(f"    {doc['content_preview']}")

        # === DYNAMIC CONVERSATION CONTEXT ===
        prompt_sections.append(f"\nCONVERSATION STATE: {conversation_data['state']}")
        prompt_sections.append(f"DIALOGUE CONTEXT: {conversation_data['dialogue_context']}")

        # PHASE 5: Include summary of older messages if conversation is long
        if conversation_data.get('old_messages_summary'):
            prompt_sections.append(f"\n{conversation_data['old_messages_summary']}")

        # === PHASE 3: DYNAMIC PRIOR KNOWLEDGE (Actual Learning Insights) ===
        if prior_knowledge['prior_module_insights']:
            prompt_sections.append(f"\nPRIOR LEARNING FROM OTHER MODULES:")
            for insight in prior_knowledge['prior_module_insights'][:2]:
                prompt_sections.append(f"  From '{insight['module_title']}':")
                prompt_sections.append(f"    What learned: {insight['what_learned']}")
                if insight['key_concepts']:
                    prompt_sections.append(f"    Key concepts: {insight['key_concepts']}")

        # Mastered concepts across modules
        if prior_knowledge['mastered_concepts']:
            concepts_str = ', '.join(prior_knowledge['mastered_concepts'])
            prompt_sections.append(f"\nMASTERED CONCEPTS (across all modules): {concepts_str}")

        # === SOCRATIC STRATEGY ===
        prompt_sections.append(f"\nSOCRATIC APPROACH: {module_data['socratic_strategy']}")
        
        # === CURRENT MESSAGE ===
        if current_message:
            prompt_sections.append(f"\nSTUDENT MESSAGE: {current_message}")
            approach = self._analyze_current_message(current_message)
            prompt_sections.append(f"RESPONSE STRATEGY: {approach}")
        
        prompt_sections.append("\nRemember: Use Socratic questioning to guide discovery. Never give direct answers.")
        
        return "\n".join(prompt_sections)
    
    def _generate_socratic_strategy(self, module_config: Dict[str, str]) -> str:
        """Generate dynamic Socratic teaching strategy"""
        strategies = ["Use strategic questions to guide discovery"]
        
        if 'example' in module_config.get('module_prompt', '').lower():
            strategies.append("encourage concrete examples")
        if 'theory' in module_config.get('module_prompt', '').lower():
            strategies.append("build theoretical understanding step-by-step")
        
        return " | ".join(strategies)
    
    def _extract_dialogue_context(self, messages: List[Dict]) -> str:
        """Extract recent dialogue context"""
        if not messages:
            return "Ready to begin Socratic exploration"
        
        recent = messages[-3:] if len(messages) >= 3 else messages
        context_parts = []
        for msg in recent:
            role = "Student" if msg.get('role') == 'user' else "Harv"
            content = msg.get('content', '')[:50]
            context_parts.append(f"{role}: {content}")
        
        return " | ".join(context_parts)
    
    def _analyze_conversation_patterns(self, messages: List[Dict]) -> Dict[str, Any]:
        """Analyze conversation for engagement patterns"""
        user_messages = [m for m in messages if m.get('role') == 'user']
        
        if not user_messages:
            return {'engagement_level': 'starting', 'understanding_indicators': []}
        
        recent_text = ' '.join([m.get('content', '').lower() for m in user_messages[-3:]])
        
        engagement_level = 'building_understanding'
        if 'interesting' in recent_text or 'tell me more' in recent_text:
            engagement_level = 'highly_engaged'
        elif 'confused' in recent_text or "don't understand" in recent_text:
            engagement_level = 'needs_support'
        
        return {
            'engagement_level': engagement_level,
            'understanding_indicators': ['making connections'] if 'understand' in recent_text else []
        }
    
    def _analyze_current_message(self, message: str) -> str:
        """Analyze current message for response strategy"""
        message_lower = message.lower()
        
        if '?' in message:
            if 'why' in message_lower:
                return "Explore underlying reasoning with follow-up questions"
            elif 'how' in message_lower:
                return "Break down process step-by-step through inquiry"
            else:
                return "Respond to question with clarifying questions"
        elif any(word in message_lower for word in ['confused', 'unclear', "don't understand"]):
            return "Use simpler questions and concrete examples"
        elif 'example' in message_lower:
            return "Ask student to generate their own examples first"
        else:
            return "Use Socratic questioning to deepen exploration"
    
    def _calculate_context_metrics(self, assembled_prompt: str) -> Dict[str, Any]:
        """Calculate metrics about assembled context"""
        return {
            'total_chars': len(assembled_prompt),
            'system_weight': 25,
            'module_weight': 35,
            'conversation_weight': 25,
            'prior_weight': 15,
            'optimization_score': min(100, len(assembled_prompt) / 50)
        }
    
    def _create_fallback_context(self, user_id: int, module_id: int) -> Dict[str, Any]:
        """Fallback context if user/module not found"""
        return {
            'assembled_prompt': f"=== HARV FALLBACK CONTEXT ===\nUser: {user_id}, Module: {module_id}\nUse Socratic questioning to guide learning.",
            'context_metrics': {'total_chars': 100, 'optimization_score': 50},
            'memory_layers': {
                'system_data': {'learning_profile': {'style': 'adaptive'}},
                'module_data': {'module_info': {'title': f'Module {module_id}'}},
                'conversation_data': {'state': 'new_conversation'},
                'prior_knowledge': {'prior_module_insights': []}
            },
            'database_status': {'onboarding': False, 'module_config': False, 'conversation_analysis': False, 'cross_module': False}
        }
