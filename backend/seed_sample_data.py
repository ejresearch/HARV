#!/usr/bin/env python3
"""
Seed database with sample data for testing:
- 1 Admin user
- 1 Student user
- 1 Sample class
- 3 Sample modules
- 1 Conversation per module for the student
"""
import sys
sys.path.insert(0, '/Users/elle_jansick/Harv_2/backend')

from datetime import datetime
import json
from app.database import SessionLocal, engine, Base
from app.models import User, OnboardingSurvey, Class, Module, Conversation, MemorySummary
from app.auth import get_password_hash

# Create all tables
Base.metadata.create_all(bind=engine)

# Create database session
db = SessionLocal()

try:
    # Clear existing data
    print("Clearing existing data...")
    db.query(Conversation).delete()
    db.query(MemorySummary).delete()
    db.query(Module).delete()
    db.query(Class).delete()
    db.query(OnboardingSurvey).delete()
    db.query(User).delete()
    db.commit()

    # ===== CREATE USERS =====
    print("\nCreating users...")

    # Admin user
    admin = User(
        email="admin@harv.com",
        name="Admin User",
        hashed_password=get_password_hash("admin123"),
        is_admin=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Created admin: {admin.email} (ID: {admin.id})")

    # Student user
    student = User(
        email="student@harv.com",
        name="Sarah Johnson",
        hashed_password=get_password_hash("student123"),
        is_admin=False
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    print(f"Created student: {student.email} (ID: {student.id})")

    # Student onboarding survey
    survey = OnboardingSurvey(
        user_id=student.id,
        reason="I want to understand how media shapes society and communication",
        familiarity="beginner",
        learning_style="visual",
        goals="Master communication theory and media analysis",
        background="College sophomore interested in journalism and media studies",
        age_grade_level="Sophomore (2nd year)",
        learning_notes="I prefer examples and real-world case studies. Visual diagrams help me understand concepts better."
    )
    db.add(survey)
    db.commit()
    print(f"Created onboarding survey for student")

    # ===== CREATE CLASS =====
    print("\nCreating class...")

    sample_class = Class(
        title="Introduction to Media & Communication",
        description="Explore how media shapes our understanding of the world, from traditional journalism to digital platforms. Learn critical media literacy and communication theory through real-world examples.",
        outline="""
# Course Overview
This course examines the role of media in modern society, covering:
- Communication models and theory
- Media effects and influence
- Digital transformation
- Critical media literacy

## Learning Objectives
- Understand key communication theories
- Analyze media messages critically
- Recognize media's societal impact
- Apply media literacy skills
        """.strip(),
        learning_objectives="""
1. Explain major communication theories and models
2. Analyze how media shapes public perception
3. Evaluate media messages for bias and accuracy
4. Apply critical thinking to media consumption
5. Understand the evolution from traditional to digital media
        """.strip(),
        system_prompt="You are Harv, a Socratic tutor for Introduction to Media & Communication. Guide students to discover media literacy and communication theory through strategic questioning, real-world examples, and critical analysis."
    )
    db.add(sample_class)
    db.commit()
    db.refresh(sample_class)
    print(f"Created class: {sample_class.title} (ID: {sample_class.id})")

    # ===== CREATE MODULES =====
    print("\nCreating modules...")

    modules_data = [
        {
            "title": "Understanding Media Effects",
            "description": "How media influences our thoughts, behaviors, and perceptions of reality",
            "outline": """
# Module 1: Understanding Media Effects

## Key Topics
- Cultivation Theory: How TV shapes our worldview
- Agenda Setting: Media's power to tell us what to think about
- Priming and Framing: How presentation affects perception
- Third-person effect: We think media affects others more than us

## Real-World Examples
- News coverage of crime vs. actual crime statistics
- Political advertising and voter perception
- Social media and body image
            """.strip(),
            "resources": "Gerbner's Cultivation Theory, McCombs & Shaw's Agenda-Setting research",
            "system_prompt": "Guide students to discover how media shapes perception through Cultivation Theory, Agenda-Setting, and related concepts. Use Socratic questioning to help them recognize media effects in their own lives."
        },
        {
            "title": "Digital Media & Social Networks",
            "description": "The transformation from traditional to digital media and the rise of social networks",
            "outline": """
# Module 2: Digital Media & Social Networks

## Key Topics
- Evolution from broadcast to interactive media
- Social media platforms and user behavior
- Echo chambers and filter bubbles
- Viral content and information spread
- Digital literacy and misinformation

## Case Studies
- How news consumption changed from newspapers to Twitter
- The role of YouTube in modern education
- Instagram's impact on visual culture
            """.strip(),
            "resources": "Pew Research on Social Media Use, Pariser's Filter Bubble concept",
            "system_prompt": "Help students understand the shift from traditional to digital media through strategic questioning about their own social media use and information consumption habits."
        },
        {
            "title": "Media Literacy & Critical Thinking",
            "description": "Developing skills to analyze, evaluate, and create media messages",
            "outline": """
# Module 3: Media Literacy & Critical Thinking

## Core Skills
- Identifying bias and perspective
- Fact-checking and source verification
- Understanding persuasive techniques
- Recognizing emotional appeals
- Evaluating credibility

## Practical Applications
- Analyzing news articles for bias
- Detecting misinformation on social media
- Understanding advertising psychology
- Creating responsible media content
            """.strip(),
            "resources": "News Literacy Project, NAMLE media literacy standards",
            "system_prompt": "Guide students to develop critical media literacy skills through analysis of real media examples. Use Socratic method to help them discover bias, persuasion techniques, and credibility markers."
        }
    ]

    created_modules = []
    for i, mod_data in enumerate(modules_data, 1):
        module = Module(
            class_id=sample_class.id,
            title=mod_data["title"],
            description=mod_data["description"],
            outline=mod_data["outline"],
            resources=mod_data["resources"],
            system_prompt=mod_data["system_prompt"]
        )
        db.add(module)
        db.commit()
        db.refresh(module)
        created_modules.append(module)
        print(f"Created module {i}: {module.title} (ID: {module.id})")

    # ===== CREATE CONVERSATIONS =====
    print("\nCreating sample conversations...")

    conversations_data = [
        {
            "module": created_modules[0],
            "title": "Exploring Cultivation Theory",
            "messages": [
                {
                    "role": "user",
                    "content": "Can you help me understand cultivation theory? I'm not sure how TV can really affect how people think."
                },
                {
                    "role": "assistant",
                    "content": "That's a great question, Sarah! Let me ask you this: how much television do you think the average American watches per day? And what kinds of shows are most popular?"
                },
                {
                    "role": "user",
                    "content": "I'd guess maybe 3-4 hours? And probably news, crime shows, and reality TV?"
                },
                {
                    "role": "assistant",
                    "content": "Close! It's actually closer to 4-5 hours for many adults. Now, thinking about crime shows specifically - shows like Law & Order, CSI, true crime documentaries - what do you think happens when someone watches several hours of crime content every day for years?"
                },
                {
                    "role": "user",
                    "content": "I guess they might start thinking crime is everywhere? Even if it's not really that common in real life?"
                },
                {
                    "role": "assistant",
                    "content": "Exactly! That's the essence of cultivation theory. George Gerbner found that heavy TV viewers tend to overestimate crime rates and believe the world is more dangerous than it actually is. He called this the 'mean world syndrome.' Can you think of other ways TV might 'cultivate' certain beliefs about reality?"
                }
            ]
        },
        {
            "module": created_modules[1],
            "title": "Social Media's Impact on News",
            "messages": [
                {
                    "role": "user",
                    "content": "Why do people say social media is bad for news? I get most of my news from Twitter and it seems fine."
                },
                {
                    "role": "assistant",
                    "content": "Interesting observation! Let me ask you: when you scroll through Twitter, do you see news from sources you disagree with, or mostly from sources that align with your views?"
                },
                {
                    "role": "user",
                    "content": "Hmm, mostly from sources I follow, so... probably ones I agree with?"
                },
                {
                    "role": "assistant",
                    "content": "That's a key insight! This is what Eli Pariser calls a 'filter bubble.' Social media algorithms show you content similar to what you've engaged with before. What might be the problem with only seeing news that confirms what you already believe?"
                },
                {
                    "role": "user",
                    "content": "You'd never really challenge your own ideas or see other perspectives. You might think everyone agrees with you when they don't."
                },
                {
                    "role": "assistant",
                    "content": "Precisely! This is very different from traditional newspapers, where you'd see multiple perspectives on the same page. How might this affect democracy when people live in different 'information bubbles'?"
                }
            ]
        },
        {
            "module": created_modules[2],
            "title": "Identifying Bias in News",
            "messages": [
                {
                    "role": "user",
                    "content": "How can you tell if a news article is biased? Sometimes I can't tell the difference between facts and opinions."
                },
                {
                    "role": "assistant",
                    "content": "That's one of the most important media literacy skills! Let me give you an example and see if you can spot the difference. Which sounds more factual: 'The protest drew 5,000 people' or 'A massive crowd of angry protesters disrupted the city'?"
                },
                {
                    "role": "user",
                    "content": "The first one! It just gives a number. The second one uses words like 'massive' and 'angry' and 'disrupted' which are kind of judgy."
                },
                {
                    "role": "assistant",
                    "content": "Excellent analysis! Words like 'massive,' 'angry,' and 'disrupted' are loaded language - they carry emotional weight and judgment. What other clues might tell you an article has bias?"
                },
                {
                    "role": "user",
                    "content": "Maybe if they only quote people from one side? Or if the headline is really dramatic?"
                },
                {
                    "role": "assistant",
                    "content": "Exactly right! Selection of sources and sensational headlines are major bias indicators. Another thing to watch: Does the article provide context and multiple perspectives, or just push one narrative? Practice this every time you read news, and you'll become much better at spotting bias."
                }
            ]
        }
    ]

    for i, conv_data in enumerate(conversations_data, 1):
        # Create conversation with messages stored as JSON
        conversation = Conversation(
            user_id=student.id,
            module_id=conv_data["module"].id,
            title=conv_data["title"],
            messages_json=json.dumps(conv_data["messages"]),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        print(f"Created conversation {i}: {conversation.title} (ID: {conversation.id}, {len(conv_data['messages'])} messages)")

        # Create memory summary for each conversation
        if i == 1:
            what_learned = "Sarah is beginning to understand cultivation theory. She recognized that heavy TV viewing can shape perceptions of reality, particularly regarding crime rates. She grasps the 'mean world syndrome' concept."
            how_learned = "Through Socratic questioning about TV viewing habits and crime show content. Sarah made the connection herself about how repeated exposure shapes perceptions."
            key_concepts = "Cultivation Theory, Mean World Syndrome, Media Effects, Perception vs Reality"
        elif i == 2:
            what_learned = "Sarah identified her own filter bubble on social media. She understands that algorithms create echo chambers by showing content similar to what she's engaged with before."
            how_learned = "By reflecting on her own Twitter usage and realizing she mostly sees news from sources she agrees with. Compared social media to traditional newspapers."
            key_concepts = "Filter Bubbles, Echo Chambers, Algorithmic Content Curation, Information Diversity"
        else:
            what_learned = "Sarah is developing strong bias detection skills. She can distinguish factual reporting from loaded language and emotional framing. She identified key bias indicators."
            how_learned = "Through comparative analysis of two example sentences. She independently identified loaded language and proposed additional bias indicators like source selection and sensational headlines."
            key_concepts = "Media Bias, Loaded Language, Source Selection, Credibility Analysis, Critical Thinking"

        memory = MemorySummary(
            user_id=student.id,
            module_id=conv_data["module"].id,
            conversation_id=conversation.id,
            what_learned=what_learned,
            how_learned=how_learned,
            key_concepts=key_concepts,
            created_at=datetime.now()
        )
        db.add(memory)
        db.commit()
        print(f"Created memory summary for conversation {i}")

    # ===== SUMMARY =====
    print("\n" + "="*60)
    print("SAMPLE DATA SEEDED SUCCESSFULLY!")
    print("="*60)
    print(f"\nUsers Created:")
    print(f"   Admin: admin@harv.com / admin123 (ID: {admin.id})")
    print(f"   Student: student@harv.com / student123 (ID: {student.id})")
    print(f"\nClass Created:")
    print(f"   {sample_class.title} (ID: {sample_class.id})")
    print(f"\nModules Created:")
    for mod in created_modules:
        print(f"   {mod.id}. {mod.title}")
    print(f"\nConversations Created: {len(conversations_data)} (one per module)")
    print(f"\nMemory Summaries Created: {len(conversations_data)}")
    print("\n" + "="*60)

except Exception as e:
    print(f"\nError: {e}")
    db.rollback()
    raise
finally:
    db.close()
