#!/usr/bin/env python3
"""
Script to add 10 Psychology modules to the HARV database (class_id=2)
Each module includes: title, description, learning objectives, outline, system prompt, and 5 corpus entries
"""

import sqlite3
import json
from datetime import datetime

# Database path
DB_PATH = "/Users/elle_jansick/harv_demo/backend/harv.db"

# Psychology modules data
MODULES = [
    {
        "title": "Foundations of Scientific Psychology",
        "description": "Explore the scientific foundations of psychology, including its history, major theoretical perspectives, and research methods. Learn how psychologists use the scientific method to study behavior and mental processes, and understand the ethical considerations in psychological research.",
        "learning_objectives": [
            "Trace the historical development of psychology from philosophy to science",
            "Compare and contrast major theoretical perspectives (biological, cognitive, behavioral, psychodynamic, humanistic, sociocultural)",
            "Explain the scientific method and how it applies to psychological research",
            "Identify and describe various research methods including experiments, correlational studies, and case studies",
            "Evaluate ethical considerations in psychological research and practice"
        ],
        "outline": [
            "1. What is Psychology? Definition and scope of the field",
            "2. Historical Foundations: From Wundt to Watson to modern psychology",
            "3. Major Theoretical Perspectives: Different lenses for understanding behavior",
            "4. The Scientific Method in Psychology: Hypotheses, variables, and operational definitions",
            "5. Research Methods: Experiments, correlational studies, surveys, naturalistic observation, case studies",
            "6. Statistical Analysis: Descriptive and inferential statistics basics",
            "7. Ethics in Research: Informed consent, deception, debriefing, animal research",
            "8. Critical Thinking in Psychology: Evaluating claims and avoiding pseudoscience"
        ],
        "system_prompt": "You are an expert psychology instructor teaching the foundations of scientific psychology. Help students understand how psychology evolved into a rigorous scientific discipline. Emphasize the importance of the scientific method, critical thinking, and ethical research practices. When discussing research methods, provide concrete examples and help students distinguish between correlation and causation. Encourage students to think critically about psychological claims they encounter in daily life and media. Use historical examples to show how different perspectives emerged and why multiple viewpoints enrich our understanding of human behavior.",
        "corpus": [
            {
                "content": "The scientific method in psychology follows a systematic process: (1) identify a research question, (2) review existing literature, (3) formulate a testable hypothesis, (4) design a study with operational definitions, (5) collect and analyze data, (6) draw conclusions, and (7) report findings. This process ensures that psychological knowledge is built on empirical evidence rather than speculation. For example, if studying whether exercise improves mood, researchers must operationally define 'exercise' (e.g., 30 minutes of aerobic activity) and 'mood' (e.g., scores on a standardized depression inventory) to test the hypothesis systematically.",
                "tags": ["scientific method", "research design", "operational definitions", "empirical evidence"]
            },
            {
                "content": "Major theoretical perspectives in psychology offer different explanations for human behavior: The biological perspective examines how brain structures, neurotransmitters, and genetics influence behavior. The cognitive perspective focuses on mental processes like perception, memory, and problem-solving. The behavioral perspective emphasizes observable behaviors and environmental influences through learning. The psychodynamic perspective explores unconscious motives and early childhood experiences. The humanistic perspective highlights personal growth, free will, and self-actualization. The sociocultural perspective examines how culture, social norms, and group dynamics shape behavior. No single perspective is complete; understanding requires integrating multiple viewpoints.",
                "tags": ["theoretical perspectives", "biological psychology", "cognitive psychology", "behavioral psychology", "psychodynamic theory", "humanistic psychology", "sociocultural psychology"]
            },
            {
                "content": "Experimental research is the gold standard for establishing causation in psychology. Key features include: (1) Random assignment of participants to conditions to eliminate selection bias, (2) Manipulation of an independent variable by the researcher, (3) Measurement of a dependent variable to observe effects, (4) Control of extraneous variables through standardization and control groups, and (5) Statistical analysis to determine if results are significant. For instance, to test whether caffeine improves attention, researchers randomly assign participants to caffeine or placebo conditions, then measure attention performance, controlling for factors like time of day and prior sleep.",
                "tags": ["experimental research", "random assignment", "independent variable", "dependent variable", "causation", "control groups"]
            },
            {
                "content": "Correlation does not imply causation - a fundamental principle in psychological research. When two variables are correlated, they vary together systematically, but this doesn't prove one causes the other. Three possible explanations exist: A causes B, B causes A, or a third variable C causes both A and B. For example, ice cream sales and drowning deaths are positively correlated, but ice cream doesn't cause drowning. Instead, warm weather (third variable) increases both ice cream consumption and swimming activity. Understanding this distinction prevents false conclusions and recognizes when experimental research is needed to establish causation.",
                "tags": ["correlation", "causation", "third variable problem", "correlational research", "confounding variables"]
            },
            {
                "content": "Ethical guidelines in psychological research protect participant welfare and dignity. The APA Ethics Code requires: (1) Informed consent - participants must understand the study's nature and risks before agreeing, (2) Right to withdraw - participants can leave at any time without penalty, (3) Confidentiality - personal information must be protected, (4) Minimal risk - potential harm must be minimized, (5) Deception only when necessary and followed by debriefing, (6) Special protections for vulnerable populations (children, prisoners, etc.), and (7) Institutional Review Board (IRB) approval before research begins. Historical violations like the Stanford Prison Experiment led to these essential protections.",
                "tags": ["research ethics", "informed consent", "confidentiality", "IRB", "participant rights", "deception in research"]
            }
        ]
    },
    {
        "title": "Perception: How We Construct Reality",
        "description": "Discover how our sensory systems detect physical energy from the environment and how our brain transforms this raw data into meaningful experiences. Explore the processes of sensation and perception across all sensory modalities, understanding both the remarkable capabilities and systematic limitations of human perception.",
        "learning_objectives": [
            "Distinguish between sensation (detecting physical energy) and perception (interpreting sensory information)",
            "Explain signal detection theory and absolute/difference thresholds",
            "Describe the anatomy and function of each sensory system (vision, hearing, touch, taste, smell)",
            "Analyze perceptual organization principles (Gestalt laws, depth perception, perceptual constancies)",
            "Understand perceptual illusions and what they reveal about perceptual processes"
        ],
        "outline": [
            "1. Sensation vs. Perception: Bottom-up and top-down processing",
            "2. Psychophysics: Thresholds, signal detection theory, sensory adaptation",
            "3. Vision: Eye anatomy, photoreceptors, color vision theories, visual pathways",
            "4. Hearing: Ear anatomy, sound localization, pitch perception theories",
            "5. Other Senses: Touch, pain, taste, smell, kinesthesis, vestibular sense",
            "6. Perceptual Organization: Gestalt principles (proximity, similarity, closure, etc.)",
            "7. Depth Perception: Monocular and binocular cues",
            "8. Perceptual Constancies: Size, shape, brightness constancy",
            "9. Perceptual Illusions: What they teach us about perception"
        ],
        "system_prompt": "You are an expert psychology instructor teaching perception and sensation. Help students understand that perception is an active construction, not a passive recording of reality. Use concrete examples and visual demonstrations to illustrate perceptual principles. When discussing sensory systems, connect anatomy to function (how structure enables specific capabilities). Emphasize that perceptual illusions aren't failures but reveal the intelligent shortcuts our perceptual systems use. Help students appreciate both the remarkable accuracy and systematic biases in human perception. Encourage students to notice perceptual phenomena in their daily lives.",
        "corpus": [
            {
                "content": "Signal detection theory explains how we make decisions under conditions of uncertainty, accounting for both sensitivity and response bias. It distinguishes four outcomes: Hit (correctly detecting a signal when present), Miss (failing to detect a signal when present), False Alarm (reporting a signal when absent), and Correct Rejection (correctly reporting no signal when absent). This framework applies beyond simple detection - for example, in medical diagnosis, a doctor must balance sensitivity (detecting disease when present) against false alarms (diagnosing disease when absent). Conservative criteria reduce false alarms but increase misses; liberal criteria increase hits but also false alarms.",
                "tags": ["signal detection theory", "sensitivity", "response bias", "hits", "false alarms", "psychophysics"]
            },
            {
                "content": "The trichromatic theory and opponent-process theory together explain color vision. Trichromatic theory (Young-Helmholtz) states that three types of cones respond maximally to short (blue), medium (green), and long (red) wavelengths, and all colors result from their combined activation. This explains color mixing and certain forms of colorblindness. Opponent-process theory (Hering) proposes three opponent channels: red-green, blue-yellow, and black-white. This explains afterimages (staring at red produces green afterimage) and why we never see reddish-green or bluish-yellow. Modern research shows both theories are correct at different processing stages: trichromatic at the receptor level, opponent-process at neural processing levels.",
                "tags": ["color vision", "trichromatic theory", "opponent-process theory", "cones", "afterimages", "colorblindness"]
            },
            {
                "content": "Gestalt principles describe how we organize sensory information into meaningful wholes. Key principles include: Proximity - items close together are grouped; Similarity - similar items are grouped; Continuity - we perceive continuous patterns rather than discontinuous ones; Closure - we complete incomplete figures; Figure-ground - we organize stimuli into a focal figure against a background. These principles show that perception is more than the sum of individual sensations ('gestalt' means 'organized whole'). For example, when viewing a flock of birds, proximity and similarity cause us to see the flock as a unit rather than individual birds. These organizing principles likely evolved because they usually reflect real-world structure.",
                "tags": ["Gestalt principles", "perceptual organization", "proximity", "similarity", "closure", "figure-ground"]
            },
            {
                "content": "Depth perception relies on both monocular (one-eye) and binocular (two-eye) cues. Monocular cues include: relative size (smaller objects appear farther), interposition (objects blocking others appear closer), linear perspective (parallel lines converge), texture gradient (texture becomes denser with distance), relative height (objects higher in visual field appear farther), and motion parallax (closer objects move faster across vision). Binocular cues include retinal disparity (each eye sees slightly different images; greater disparity indicates closer objects) and convergence (eyes turn inward more for close objects). The visual system integrates these cues automatically. Artists use monocular cues to create depth in two-dimensional paintings.",
                "tags": ["depth perception", "monocular cues", "binocular cues", "retinal disparity", "convergence", "linear perspective"]
            },
            {
                "content": "Perceptual constancies allow us to perceive stable properties of objects despite changing sensory input. Size constancy: we perceive objects as the same size despite changes in retinal image size with distance (a person walking away doesn't shrink). Shape constancy: we recognize object shapes from different angles (a door is rectangular whether open or closed). Brightness constancy: we perceive consistent object colors despite illumination changes (white paper looks white in both bright and dim light). These constancies demonstrate top-down processing - our knowledge about the world influences perception. Without them, the world would appear chaotic as objects seemed to constantly change size, shape, and color with every viewing angle and lighting condition.",
                "tags": ["perceptual constancy", "size constancy", "shape constancy", "brightness constancy", "top-down processing"]
            }
        ]
    },
    {
        "title": "Learning and Memory: Building Knowledge That Lasts",
        "description": "Examine how experience changes behavior through different forms of learning, from simple associations to complex cognitive processes. Understand memory systems, why we remember some things vividly while forgetting others, and evidence-based strategies for enhancing learning and retention.",
        "learning_objectives": [
            "Compare and contrast classical conditioning, operant conditioning, and observational learning",
            "Apply learning principles to understand real-world behavior (phobias, habits, skill acquisition)",
            "Distinguish between different memory systems (sensory, short-term/working, long-term)",
            "Explain encoding, storage, and retrieval processes and factors affecting each",
            "Analyze why forgetting occurs and evaluate memory improvement strategies"
        ],
        "outline": [
            "1. Classical Conditioning: Pavlov's discoveries, acquisition, extinction, generalization, discrimination",
            "2. Applications of Classical Conditioning: Phobias, taste aversions, advertising, therapy",
            "3. Operant Conditioning: Thorndike and Skinner, reinforcement, punishment, schedules",
            "4. Applications of Operant Conditioning: Behavior modification, education, parenting",
            "5. Observational Learning: Bandura's social learning theory, modeling, vicarious reinforcement",
            "6. Memory Systems: Sensory memory, short-term/working memory, long-term memory",
            "7. Encoding and Storage: Levels of processing, organization, imagery, schemas",
            "8. Retrieval: Recognition vs. recall, context effects, state-dependent memory",
            "9. Forgetting: Decay, interference, retrieval failure, motivated forgetting",
            "10. Memory Enhancement: Effective study strategies, spaced practice, testing effect"
        ],
        "system_prompt": "You are an expert psychology instructor teaching learning and memory. Help students understand that learning principles apply universally across species and situations, from simple reflexes to complex skills. Use diverse examples showing how classical and operant conditioning shape everyday behavior - phobias, habits, motivation, etc. When teaching memory, emphasize that it's not a video recording but an active reconstruction influenced by current knowledge and expectations. Connect memory research to practical study strategies, helping students understand why some techniques (re-reading, highlighting) feel effective but aren't, while others (retrieval practice, spaced repetition) are more effective but feel harder. Make the science personally relevant and actionable.",
        "corpus": [
            {
                "content": "Classical conditioning, discovered by Ivan Pavlov, occurs when a neutral stimulus becomes associated with a meaningful stimulus, eventually producing a similar response. The process involves: Unconditioned Stimulus (US) - naturally triggers a response; Unconditioned Response (UR) - natural response to US; Neutral Stimulus (NS) - initially produces no particular response; Conditioned Stimulus (CS) - previously neutral stimulus that, after pairing with US, triggers response; Conditioned Response (CR) - learned response to CS. For example, in Pavlov's experiments, food (US) naturally caused salivation (UR). After repeatedly pairing a bell (NS) with food, the bell alone (now CS) caused salivation (CR). This fundamental learning mechanism explains many emotional responses, including phobias.",
                "tags": ["classical conditioning", "Pavlov", "conditioned stimulus", "unconditioned stimulus", "conditioned response", "associative learning"]
            },
            {
                "content": "Operant conditioning involves learning through consequences - behaviors followed by satisfying consequences increase, while those followed by unsatisfying consequences decrease. Key concepts include: Reinforcement (increases behavior) - positive reinforcement adds something desirable; negative reinforcement removes something undesirable. Punishment (decreases behavior) - positive punishment adds something undesirable; negative punishment removes something desirable. Continuous reinforcement strengthens behavior quickly but extinction is rapid. Partial reinforcement schedules (fixed/variable ratio/interval) are more resistant to extinction. For example, a child who receives praise (positive reinforcement) for sharing will share more; removing homework (negative reinforcement) for good behavior increases good behavior; adding extra chores (positive punishment) for misbehavior decreases it.",
                "tags": ["operant conditioning", "reinforcement", "punishment", "Skinner", "positive reinforcement", "negative reinforcement", "reinforcement schedules"]
            },
            {
                "content": "The multi-store memory model proposes three memory systems: Sensory memory holds incoming sensory information briefly (1/4 to 4 seconds) with large capacity but rapid decay. Short-term/working memory maintains information actively for about 20-30 seconds, limited to 7±2 chunks, and serves as a mental workspace for processing. Long-term memory stores information permanently with apparently unlimited capacity, including explicit/declarative memory (episodic and semantic) and implicit/nondeclarative memory (procedural, conditioning, priming). Information flows from sensory to short-term (through attention) to long-term memory (through rehearsal and encoding). Retrieval brings information back from long-term to working memory. This framework explains phenomena like the serial position effect.",
                "tags": ["memory systems", "sensory memory", "short-term memory", "working memory", "long-term memory", "multi-store model"]
            },
            {
                "content": "Encoding specificity principle states that memory retrieval is most effective when the retrieval context matches the encoding context. This includes physical context (studying and testing in the same room improves recall), state-dependent memory (information learned in a particular physiological state is recalled better in that state), and mood-congruent memory (mood at encoding and retrieval affects what's remembered). Related concepts include transfer-appropriate processing (match processing type at encoding and retrieval) and the encoding-retrieval match. For example, scuba divers recalled words better when tested in the same environment (underwater or on land) where they learned them. This explains why it helps to recreate the learning context during retrieval.",
                "tags": ["encoding specificity", "context-dependent memory", "state-dependent memory", "retrieval cues", "transfer-appropriate processing"]
            },
            {
                "content": "Effective learning strategies based on cognitive psychology research: (1) Retrieval practice (testing effect) - actively recalling information strengthens memory more than re-reading; (2) Spaced practice (distributed practice) - spreading study sessions over time is more effective than massed practice (cramming); (3) Interleaving - mixing different topics during study enhances discrimination and retention; (4) Elaborative interrogation - asking 'why' questions and connecting new information to existing knowledge deepens understanding; (5) Dual coding - combining verbal and visual information enhances encoding. Less effective strategies many students use: highlighting, re-reading, and summarizing without retrieval. The most effective strategies often feel harder initially but produce superior long-term retention and transfer.",
                "tags": ["study strategies", "retrieval practice", "spaced practice", "testing effect", "interleaving", "effective learning", "metacognition"]
            }
        ]
    },
    {
        "title": "Thinking, Reasoning, and Decision-Making: Two Systems of Thought",
        "description": "Explore cognitive processes underlying thinking, problem-solving, judgment, and decision-making. Understand how concepts and categories are formed, how we solve problems, and the systematic biases affecting human reasoning. Learn about dual-process theories distinguishing fast intuitive thinking from slower analytical reasoning.",
        "learning_objectives": [
            "Explain how concepts and categories organize knowledge and enable generalization",
            "Analyze problem-solving strategies and obstacles (algorithms, heuristics, mental sets, functional fixedness)",
            "Distinguish between System 1 (fast, automatic) and System 2 (slow, deliberate) thinking",
            "Identify common cognitive biases and heuristics affecting judgment and decision-making",
            "Evaluate evidence regarding factors affecting creativity and insight"
        ],
        "outline": [
            "1. Concepts and Categories: Defining features, prototypes, exemplars",
            "2. Problem-Solving Strategies: Algorithms, heuristics, means-end analysis",
            "3. Obstacles to Problem-Solving: Mental set, functional fixedness, confirmation bias",
            "4. Dual-Process Theory: System 1 vs. System 2 thinking (Kahneman)",
            "5. Judgment Heuristics: Availability, representativeness, anchoring and adjustment",
            "6. Cognitive Biases: Overconfidence, hindsight bias, framing effects, sunk cost fallacy",
            "7. Decision-Making: Expected utility theory, prospect theory, loss aversion",
            "8. Reasoning: Deductive vs. inductive reasoning, logical fallacies",
            "9. Creativity and Insight: Divergent thinking, incubation, aha moments"
        ],
        "system_prompt": "You are an expert psychology instructor teaching thinking, reasoning, and decision-making. Help students understand that human thinking involves trade-offs between speed and accuracy, with systematic biases resulting from generally-useful mental shortcuts. When teaching heuristics and biases, use concrete examples that students can relate to their own experiences, helping them recognize these patterns in real-world decisions. Emphasize Kahneman's dual-process framework (System 1 vs System 2) as a unifying principle. Make students aware that recognizing biases doesn't automatically eliminate them - they're features of our cognitive architecture. Help students develop metacognitive awareness about when to trust intuition (System 1) and when to engage deliberate analysis (System 2).",
        "corpus": [
            {
                "content": "Dual-process theory distinguishes two modes of thinking: System 1 is fast, automatic, intuitive, effortless, and emotional - it operates unconsciously based on pattern recognition and associative memory. System 2 is slow, controlled, analytical, effortful, and logical - it requires conscious attention and mental resources. Most daily activities rely on System 1 (recognizing faces, driving familiar routes), freeing System 2 for demanding tasks (solving math problems, evaluating arguments). System 1 is efficient but prone to systematic biases; System 2 can correct these but is lazy and often accepts System 1's suggestions. For example, the question '2+2=?' activates System 1 immediately, while '17×24=?' requires System 2. Good decision-making involves knowing when each system is appropriate.",
                "tags": ["dual-process theory", "System 1", "System 2", "Kahneman", "automatic processing", "controlled processing", "cognitive efficiency"]
            },
            {
                "content": "The availability heuristic is a mental shortcut where we judge the probability or frequency of events based on how easily examples come to mind. Events that are vivid, recent, or emotionally charged are more mentally available. This often produces accurate judgments (common events are easier to recall), but leads to systematic biases. For example, people overestimate risks of shark attacks and plane crashes (vivid, publicized) while underestimating risks of heart disease and diabetes (common but less dramatic). After seeing news about a crime, people judge crime rates as higher. The availability heuristic explains why personal anecdotes are often more persuasive than statistical evidence, despite being less reliable. Effective decision-making requires recognizing when availability diverges from actual frequency.",
                "tags": ["availability heuristic", "judgment", "cognitive bias", "mental shortcuts", "risk assessment", "probability estimation"]
            },
            {
                "content": "The representativeness heuristic involves judging the probability that something belongs to a category based on how similar it is to a typical category member (prototype). This leads to base rate neglect - ignoring actual probability information in favor of similarity judgments. Classic example: Linda is 31, single, outspoken, and majored in philosophy. She participated in anti-discrimination demonstrations. Which is more probable: (a) Linda is a bank teller, or (b) Linda is a bank teller and feminist? Most choose (b) because it seems more representative of the description, violating the conjunction rule - the probability of A and B cannot exceed probability of A alone. This demonstrates how representativeness overrides logical reasoning. The heuristic also causes insensitivity to sample size and gambler's fallacy.",
                "tags": ["representativeness heuristic", "base rate neglect", "conjunction fallacy", "prototype", "probability judgment", "Linda problem"]
            },
            {
                "content": "Confirmation bias is the tendency to search for, interpret, favor, and recall information confirming existing beliefs while giving less attention to contradictory evidence. This affects hypothesis testing (seeking confirming rather than disconfirming evidence), interpretation of ambiguous information (interpreting it as supporting our views), and memory (better recall of belief-consistent information). For example, someone believing vaccines cause autism notices and remembers cases supporting this but dismisses contrary evidence as flawed. Scientists combat confirmation bias through rigorous methodology (seeking disconfirmation, peer review, replication). This bias makes changing beliefs difficult and contributes to polarization. Effective critical thinking requires actively seeking disconfirming evidence and considering alternative explanations.",
                "tags": ["confirmation bias", "belief perseverance", "hypothesis testing", "critical thinking", "selective attention", "motivated reasoning"]
            },
            {
                "content": "Prospect theory (Kahneman & Tversky) describes how people actually make decisions under risk, challenging traditional expected utility theory. Key principles: (1) People evaluate outcomes as gains or losses relative to a reference point rather than absolute wealth; (2) Loss aversion - losses loom larger than equivalent gains (losing $100 feels worse than gaining $100 feels good); (3) Diminishing sensitivity - the difference between $0 and $100 feels larger than between $1000 and $1100; (4) Framing effects - preferences reverse depending on whether options are framed as gains or losses. For example, people prefer a sure gain of $500 over 50% chance of $1000, but prefer 50% chance of losing $1000 over a sure loss of $500, even though outcomes are equivalent. This explains risk aversion for gains but risk seeking for losses.",
                "tags": ["prospect theory", "loss aversion", "framing effects", "Kahneman", "Tversky", "decision-making under risk", "reference dependence"]
            }
        ]
    },
    {
        "title": "Motivation and Emotion: The Forces That Drive Behavior",
        "description": "Investigate what drives behavior, from basic biological needs to complex psychological motives. Explore theories of motivation, the nature of emotions and their expression, and the relationship between motivation, emotion, and behavior. Understand both universal patterns and individual differences in motivational and emotional processes.",
        "learning_objectives": [
            "Compare major theories of motivation (instinct, drive reduction, arousal, incentive, hierarchy of needs)",
            "Analyze biological and psychological factors regulating hunger, eating, and body weight",
            "Explain psychological needs (achievement, affiliation, power) and their behavioral consequences",
            "Describe major theories of emotion (James-Lange, Cannon-Bard, Schachter-Singer, cognitive appraisal)",
            "Evaluate evidence for universality and cultural variation in emotional expression and experience"
        ],
        "outline": [
            "1. Theories of Motivation: Instinct, drive reduction, optimal arousal, incentive theories",
            "2. Maslow's Hierarchy of Needs: From survival to self-actualization",
            "3. Hunger and Eating: Biological regulation, set point, environmental and cultural influences",
            "4. Achievement Motivation: Need for achievement, attributions, intrinsic vs. extrinsic motivation",
            "5. Other Psychological Needs: Affiliation, power, autonomy, competence, relatedness (SDT)",
            "6. What are Emotions? Components, functions, basic emotions",
            "7. Theories of Emotion: James-Lange, Cannon-Bard, two-factor, cognitive appraisal",
            "8. Emotional Expression: Facial expressions, cultural display rules, body language",
            "9. Emotion Regulation: Strategies for managing emotional experiences",
            "10. Stress and Coping: Stressors, physiological responses, coping strategies"
        ],
        "system_prompt": "You are an expert psychology instructor teaching motivation and emotion. Help students understand that motivation involves complex interactions between biological drives, psychological needs, cognitive interpretations, and environmental incentives - no single theory explains all motivated behavior. When discussing hunger and eating, address both biological mechanisms and environmental/cultural influences, acknowledging the complexity of eating disorders without oversimplifying. Emphasize that emotions involve multiple components (physiological, cognitive, behavioral) that interact. Use theories of emotion to show how different perspectives highlight different aspects of emotional experience. Help students apply concepts to understand their own motivations and emotions. Discuss cultural universals and variations in emotional expression, avoiding stereotypes while recognizing genuine differences.",
        "corpus": [
            {
                "content": "Drive reduction theory proposes that physiological needs create aroused states (drives) that motivate behavior to reduce the need and return to homeostasis. For example, food deprivation creates hunger (drive), motivating eating behavior that reduces the drive and restores balance. While this explains basic biological motivations (hunger, thirst, temperature regulation), it has limitations: (1) It doesn't explain behavior that increases arousal (curiosity, thrill-seeking), (2) It doesn't account for learned drives and incentives, (3) It doesn't explain why satisfied needs still motivate behavior (eating delicious food when not hungry). Optimal arousal theory addresses some limitations by proposing that organisms seek an optimal level of arousal - not minimal, but moderate. This better explains exploratory behavior and individual differences (high sensation seekers need more stimulation).",
                "tags": ["drive reduction theory", "homeostasis", "arousal", "optimal arousal theory", "motivation theories", "physiological needs"]
            },
            {
                "content": "Maslow's hierarchy of needs proposes that human needs are arranged in a pyramid: (1) Physiological needs (food, water, shelter) form the base; (2) Safety needs (security, stability); (3) Belongingness and love needs (relationships, acceptance); (4) Esteem needs (achievement, recognition, respect); (5) Self-actualization (realizing one's full potential) at the peak. Lower needs must be satisfied before higher needs motivate behavior - someone starving prioritizes food over self-actualization. However, research shows the hierarchy is less rigid than Maslow proposed - people sometimes pursue higher needs despite unmet lower needs (artists starving for their craft). The framework usefully emphasizes that humans have diverse psychological needs beyond survival, and self-actualization represents growth motivation rather than deficiency motivation.",
                "tags": ["Maslow", "hierarchy of needs", "self-actualization", "physiological needs", "psychological needs", "humanistic psychology"]
            },
            {
                "content": "Self-Determination Theory (SDT) proposes three innate psychological needs essential for well-being and optimal functioning: (1) Autonomy - experiencing behavior as self-endorsed and volitional rather than controlled; (2) Competence - feeling effective and capable in one's activities; (3) Relatedness - feeling connected to and cared for by others. When these needs are satisfied, people experience intrinsic motivation (engaging in activities for inherent satisfaction) and well-being. When thwarted, extrinsic motivation (performing activities for external rewards/pressures) dominates and well-being suffers. For example, students perform better and persist longer when they feel autonomous (choosing topics), competent (appropriately challenging work), and related (supported by teachers/peers) versus controlled by rewards and punishments. This framework explains why rewards sometimes undermine intrinsic motivation.",
                "tags": ["self-determination theory", "SDT", "autonomy", "competence", "relatedness", "intrinsic motivation", "extrinsic motivation"]
            },
            {
                "content": "The two-factor theory of emotion (Schachter-Singer) proposes that emotion results from two components: (1) physiological arousal, and (2) cognitive label/interpretation of that arousal based on situational context. The same physiological arousal can be experienced as different emotions depending on how it's interpreted. Classic study: participants received arousing injections and were exposed to either euphoric or angry confederates. Those not informed about injection effects experienced emotions matching the confederate's behavior (their arousal needed explanation, which context provided). This demonstrates that emotions aren't just bodily states (James-Lange) or independent brain patterns (Cannon-Bard) but involve cognitive interpretation. Modern appraisal theories extend this: emotions result from evaluating situations' relevance to personal goals and well-being.",
                "tags": ["two-factor theory", "Schachter-Singer", "emotion theories", "cognitive appraisal", "physiological arousal", "emotional experience"]
            },
            {
                "content": "Research on facial expressions reveals both universal and culturally variable aspects. Universal elements (supporting evolutionary perspective): People across cultures recognize basic emotions (happiness, sadness, fear, anger, disgust, surprise) from facial expressions at above-chance levels; blind individuals show similar expressions without learning through observation; expressions appear in other primates. Cultural variation: Display rules govern when, where, and how emotions should be expressed (Japanese culture emphasizes emotional restraint in public; Mediterranean cultures allow stronger expressions). Context affects interpretation - the same expression can signify different emotions depending on situation. Emotional dialects exist - subtle variations in expressions across cultures. Modern view: Emotions have universal biological foundations with cultural shaping of expression and interpretation through socialization.",
                "tags": ["facial expressions", "universal emotions", "display rules", "cultural psychology", "emotion recognition", "Ekman", "emotional expression"]
            }
        ]
    },
    {
        "title": "Human Development: Nature, Nurture, and Change Across the Lifespan",
        "description": "Trace physical, cognitive, and socioemotional development from conception through old age. Explore the nature-nurture debate, critical/sensitive periods, and theories explaining developmental change. Understand both universal developmental patterns and individual differences shaped by genetics, environment, and their interaction.",
        "learning_objectives": [
            "Describe prenatal development and factors affecting it (teratogens, environmental influences)",
            "Explain Piaget's theory of cognitive development and evaluate its strengths and limitations",
            "Analyze attachment theory and research on the effects of different attachment styles",
            "Compare theories of moral development (Kohlberg) and their critiques",
            "Understand physical, cognitive, and social changes in adolescence and adulthood"
        ],
        "outline": [
            "1. Developmental Psychology Foundations: Nature-nurture, continuity-discontinuity, stability-change",
            "2. Prenatal Development: Conception through birth, critical periods, teratogens",
            "3. Infancy: Physical development, motor milestones, sensory capabilities",
            "4. Cognitive Development: Piaget's stages (sensorimotor, preoperational, concrete, formal)",
            "5. Vygotsky and Information Processing: Alternative perspectives on cognitive development",
            "6. Attachment: Bowlby, Ainsworth's Strange Situation, attachment styles and outcomes",
            "7. Social Development: Temperament, parenting styles, peer relationships",
            "8. Moral Development: Kohlberg's stages, Gilligan's critique, moral emotions",
            "9. Adolescence: Puberty, identity formation (Erikson), brain development",
            "10. Adulthood and Aging: Physical changes, cognitive changes, socioemotional development"
        ],
        "system_prompt": "You are an expert psychology instructor teaching human development across the lifespan. Help students understand that development results from continuous interaction between genetic predispositions and environmental influences - not nature versus nurture, but nature via nurture. When teaching stage theories (Piaget, Kohlberg, Erikson), present them as influential frameworks while noting limitations and cultural considerations. Emphasize that development doesn't stop at adolescence - important changes continue throughout adulthood. Connect concepts to students' own developmental experiences and observations of others. Address sensitive topics (attachment, parenting) with nuance, avoiding deterministic interpretations (early experiences matter but aren't destiny). Help students appreciate both universal developmental patterns and individual/cultural variations.",
        "corpus": [
            {
                "content": "Piaget's theory proposes that children progress through four qualitatively different cognitive stages: (1) Sensorimotor (0-2 years) - understanding through sensory experiences and motor actions; develops object permanence (understanding objects exist when out of sight). (2) Preoperational (2-7 years) - symbolic thought emerges (language, pretend play); characterized by egocentrism (difficulty taking others' perspectives), centration (focusing on one aspect), and lack of conservation (understanding quantities remain constant despite appearance changes). (3) Concrete Operational (7-11 years) - logical thinking about concrete objects; masters conservation, reversibility, and classification. (4) Formal Operational (12+ years) - abstract, hypothetical, and systematic reasoning. Strengths: Recognized children as active learners; identified important phenomena. Limitations: Underestimated young children's abilities; development is more continuous than stage-like; cultural variation exists.",
                "tags": ["Piaget", "cognitive development", "developmental stages", "object permanence", "conservation", "egocentrism", "concrete operational"]
            },
            {
                "content": "Attachment theory (Bowlby) proposes that infants are biologically predisposed to form emotional bonds with caregivers, providing security for exploration and serving as a foundation for later relationships. Ainsworth's Strange Situation assesses attachment quality through separation-reunion episodes, identifying patterns: (1) Secure attachment (65%) - infant explores when caregiver present, distressed when separated, quickly comforted upon reunion; associated with sensitive, responsive caregiving. (2) Insecure-avoidant (20%) - little distress at separation, avoids caregiver at reunion; linked to rejecting caregiving. (3) Insecure-resistant/ambivalent (10-15%) - extreme distress, angry resistance mixed with proximity-seeking at reunion; associated with inconsistent caregiving. (4) Disorganized (5-10%) - contradictory behaviors, freezing; linked to frightening or frightened caregiving. Early attachment quality predicts later social relationships, but isn't deterministic.",
                "tags": ["attachment theory", "Bowlby", "Ainsworth", "Strange Situation", "secure attachment", "insecure attachment", "attachment styles"]
            },
            {
                "content": "Parenting styles, identified by Baumrind and expanded by Maccoby & Martin, differ along two dimensions: demandingness (control, maturity demands) and responsiveness (warmth, support). (1) Authoritative (high demand, high responsive) - set clear standards while being responsive and communicative; children show best outcomes: competent, self-reliant, socially responsible. (2) Authoritarian (high demand, low responsive) - strict rules, obedience-oriented, punitive; children may be obedient but less happy, lower self-esteem. (3) Permissive/Indulgent (low demand, high responsive) - warm but few demands or controls; children may be impulsive, lack self-control. (4) Uninvolved/Neglectful (low demand, low responsive) - minimal involvement; children show worst outcomes. Important caveat: These correlations don't prove causation; child temperament influences parenting, and cultural contexts affect which style is most effective.",
                "tags": ["parenting styles", "authoritative parenting", "authoritarian parenting", "Baumrind", "child development", "parent-child relationships"]
            },
            {
                "content": "Kohlberg's theory proposes moral reasoning develops through three levels: (1) Preconventional - morality based on consequences (Stage 1: obedience to avoid punishment; Stage 2: self-interest and reciprocity). (2) Conventional - morality based on social rules and others' expectations (Stage 3: approval from others; Stage 4: upholding law and social order). (3) Postconventional - morality based on abstract principles (Stage 5: social contract and individual rights; Stage 6: universal ethical principles). Research shows progression through stages is sequential and universal across cultures. Critiques: (1) Gilligan argued the theory reflects male-oriented justice perspective, missing care-based morality more common in females (debate over this continues); (2) Moral reasoning doesn't always predict moral behavior; (3) Cultural bias favors individualistic over collectivist values. Modern view: Moral development involves multiple domains (reasoning, emotion, behavior).",
                "tags": ["moral development", "Kohlberg", "moral reasoning", "moral stages", "Gilligan", "care ethics", "justice orientation"]
            },
            {
                "content": "Adolescent development involves dramatic changes across domains: Physical - puberty triggers sexual maturation, growth spurt, and hormonal changes affecting mood and behavior; timing matters (early maturation poses risks, especially for girls). Cognitive - prefrontal cortex continues developing into mid-20s while limbic system matures earlier, creating imbalance that may explain risk-taking and emotional volatility; abstract reasoning and metacognition improve. Social - identity exploration intensifies (Erikson's identity vs. role confusion); peer influence peaks; autonomy from parents increases while attachment remains important; social media creates new developmental contexts. Individual differences are substantial - adolescence isn't universally turbulent. Understanding brain development has practical implications: adolescents have developing but not yet mature decision-making capabilities, relevant to education, legal policy, and parenting approaches that balance autonomy with appropriate structure.",
                "tags": ["adolescent development", "puberty", "identity formation", "Erikson", "brain development", "prefrontal cortex", "peer influence"]
            }
        ]
    },
    {
        "title": "Intelligence and Personality: Measuring Individual Differences",
        "description": "Explore how psychologists conceptualize, measure, and explain individual differences in cognitive abilities and personality characteristics. Understand debates about the nature of intelligence, controversies surrounding testing, and major theories describing personality structure and development.",
        "learning_objectives": [
            "Compare theories of intelligence (Spearman's g, multiple intelligences, triarchic theory)",
            "Explain key psychometric concepts (reliability, validity, standardization, norms)",
            "Analyze the genetic and environmental contributions to intelligence and the heritability debate",
            "Describe major personality theories (trait, psychodynamic, humanistic, social-cognitive)",
            "Evaluate personality assessment methods and their applications"
        ],
        "outline": [
            "1. Defining Intelligence: Historical perspectives, Spearman's g, fluid vs. crystallized",
            "2. Alternative Theories: Gardner's multiple intelligences, Sternberg's triarchic theory, emotional intelligence",
            "3. Intelligence Testing: Binet, Stanford-Binet, Wechsler scales, IQ scores",
            "4. Psychometrics: Reliability, validity, standardization, norming, test bias",
            "5. Nature and Nurture: Heritability, twin studies, environmental influences, group differences",
            "6. Trait Theories: Allport, Cattell, Eysenck, Five-Factor Model (Big Five)",
            "7. Psychodynamic Theories: Freud's structure of personality, defense mechanisms, neo-Freudians",
            "8. Humanistic Theories: Rogers, Maslow, self-concept, conditions of worth",
            "9. Social-Cognitive Theories: Reciprocal determinism, self-efficacy, locus of control",
            "10. Personality Assessment: Projective tests, objective inventories, behavioral assessment"
        ],
        "system_prompt": "You are an expert psychology instructor teaching intelligence and personality. Help students understand that both intelligence and personality represent attempts to organize the enormous diversity of human cognitive abilities and behavioral patterns. When discussing intelligence, acknowledge ongoing debates about its definition, measurement, and malleability while presenting scientific consensus where it exists. Address controversial topics (group differences, heritability) with sensitivity and precision, emphasizing within-group variation exceeds between-group variation and heritability doesn't mean unchangeable. For personality theories, show how different approaches (trait, psychodynamic, humanistic, social-cognitive) address different questions and offer complementary insights. Help students appreciate psychometric principles underlying psychological assessment and think critically about personality tests they encounter. Connect abstract concepts to understanding themselves and others.",
        "corpus": [
            {
                "content": "The Five-Factor Model (Big Five) represents the current consensus in trait psychology, identifying five broad dimensions capturing personality variation: (1) Openness to Experience - imagination, curiosity, aesthetic appreciation vs. conventional, practical; (2) Conscientiousness - organized, disciplined, achievement-oriented vs. spontaneous, careless; (3) Extraversion - sociable, assertive, energetic vs. reserved, quiet; (4) Agreeableness - compassionate, cooperative, trusting vs. competitive, suspicious; (5) Neuroticism - anxious, emotionally unstable vs. calm, secure. These traits are: relatively stable across adulthood, show moderate heritability (40-60%), predict important outcomes (job performance, relationship satisfaction, health), and appear across cultures. However, people also show situational variability. The Big Five provides a useful taxonomy without explaining why traits develop or how they operate - complementary approaches address these questions.",
                "tags": ["Big Five", "Five-Factor Model", "personality traits", "OCEAN", "trait theory", "openness", "conscientiousness", "extraversion"]
            },
            {
                "content": "Intelligence testing began with Binet's practical goal of identifying students needing educational assistance. Modern tests (Stanford-Binet, Wechsler scales) provide IQ scores with mean 100 and standard deviation 15, representing performance relative to same-age peers. Key psychometric properties: (1) Reliability - consistency of measurement (test-retest, split-half, inter-rater); high reliability is necessary but insufficient. (2) Validity - does the test measure what it claims? Types include content validity (comprehensive coverage), criterion validity (predicting relevant outcomes like academic performance), and construct validity (measuring the theoretical construct). (3) Standardization - uniform administration and scoring procedures. (4) Normative data - establishing average performance and variability. IQ tests show good reliability and predict academic achievement, but critics question whether they capture all important cognitive abilities and whether cultural bias affects scores.",
                "tags": ["intelligence testing", "IQ", "psychometrics", "reliability", "validity", "Stanford-Binet", "Wechsler scales", "standardization"]
            },
            {
                "content": "The nature-nurture debate in intelligence examines genetic and environmental contributions. Heritability estimates (from twin and adoption studies) suggest 50-80% of individual differences in IQ relate to genetic variation - but heritability doesn't mean unchangeable. Important considerations: (1) Heritability describes population variance, not individual potential; (2) Heritability can differ across environments (genes may matter more when environments are similar); (3) Gene-environment interactions and correlations are complex (genes influence which environments people select and how they respond to them); (4) Environmental interventions affect IQ - nutrition, education, enrichment programs show effects; (5) The Flynn effect (rising IQ scores over generations) demonstrates substantial environmental influence. Group differences in average scores don't indicate genetic differences - environments differ systematically between groups.",
                "tags": ["nature-nurture", "heritability", "intelligence", "twin studies", "gene-environment interaction", "Flynn effect", "environmental influences"]
            },
            {
                "content": "Freud's psychodynamic theory proposes personality consists of three systems: (1) Id - unconscious reservoir of psychic energy operating on the pleasure principle, seeking immediate gratification of primitive urges. (2) Ego - operates on reality principle, mediating between id's demands, superego's restrictions, and reality's constraints; uses defense mechanisms to manage anxiety. (3) Superego - internalized moral standards from parents and society, striving for perfection. Personality reflects the dynamic conflicts between these systems. Defense mechanisms protect against anxiety: repression (pushing threatening thoughts to unconscious), projection (attributing own unacceptable impulses to others), reaction formation (expressing opposite of true feelings), displacement (redirecting impulses to safer targets), sublimation (channeling impulses into socially acceptable activities). While Freud's specific claims lack empirical support, concepts like unconscious processes and defense mechanisms have lasting influence.",
                "tags": ["psychodynamic theory", "Freud", "id", "ego", "superego", "defense mechanisms", "unconscious", "psychoanalysis"]
            },
            {
                "content": "Social-cognitive theory (Bandura, Mischel, Rotter) emphasizes reciprocal determinism - continuous interaction between person (cognitions, personality), behavior, and environment, each influencing the others. Key concepts: (1) Self-efficacy - beliefs about one's capability to perform behaviors successfully; predicts effort, persistence, and achievement across domains. High self-efficacy develops through mastery experiences, vicarious learning, social persuasion, and physiological states. (2) Locus of control (Rotter) - whether people attribute outcomes to internal (own efforts) or external (luck, powerful others) factors; internal locus predicts achievement and well-being. (3) Situational specificity - behavior varies across situations more than trait theories suggest; personality involves person-situation interactions. This approach integrates cognitive processes, learning principles, and social context, explaining how personality both shapes and is shaped by experience. It emphasizes potential for change through cognitive restructuring and skill development.",
                "tags": ["social-cognitive theory", "Bandura", "self-efficacy", "reciprocal determinism", "locus of control", "person-situation interaction"]
            }
        ]
    },
    {
        "title": "Understanding and Treating Psychological Disorders",
        "description": "Examine major categories of psychological disorders, their symptoms, causes, and treatments. Understand how disorders are classified and diagnosed, explore biological, psychological, and sociocultural factors contributing to psychopathology, and learn about evidence-based treatments from various therapeutic perspectives.",
        "learning_objectives": [
            "Explain criteria for defining psychological disorders and issues in classification (DSM-5)",
            "Describe major categories of disorders including anxiety, mood, psychotic, and personality disorders",
            "Analyze biological, psychological, and social factors contributing to specific disorders (biopsychosocial model)",
            "Compare major therapeutic approaches (psychodynamic, behavioral, cognitive, biological, humanistic)",
            "Evaluate evidence for treatment effectiveness and understand principles of evidence-based practice"
        ],
        "outline": [
            "1. Defining Abnormality: Statistical, deviation from ideal, maladaptive behavior, personal distress",
            "2. Classification: DSM-5 structure, categorical vs. dimensional approaches, diagnostic reliability and validity",
            "3. Anxiety Disorders: Specific phobias, panic disorder, generalized anxiety, social anxiety",
            "4. Obsessive-Compulsive and Related Disorders: OCD, body dysmorphic disorder, hoarding",
            "5. Mood Disorders: Major depression, persistent depressive disorder, bipolar disorders",
            "6. Schizophrenia Spectrum: Positive and negative symptoms, subtypes, developmental course",
            "7. Personality Disorders: Clusters A, B, C; focus on borderline and antisocial",
            "8. Treatment Approaches: Psychodynamic, behavioral, cognitive-behavioral, humanistic therapies",
            "9. Biological Treatments: Medications (antidepressants, antipsychotics, anxiolytics), ECT, newer approaches",
            "10. Treatment Effectiveness: Evidence-based practice, common factors, cultural considerations"
        ],
        "system_prompt": "You are an expert psychology instructor teaching psychological disorders and treatment. Help students understand that psychological disorders represent the extremes of normal psychological processes rather than fundamentally different conditions - there's continuity between normal and abnormal. Emphasize the biopsychosocial model: disorders result from complex interactions between biological vulnerabilities, psychological factors, and social/cultural contexts. When discussing specific disorders, focus on understanding rather than stigmatizing - these are conditions people experience, not defining characteristics. Present multiple theoretical perspectives on etiology and treatment as complementary rather than competing. Discuss treatment with balanced optimism - many disorders are treatable, though not always curable. Address cultural considerations in defining, experiencing, and treating disorders. Help students think critically about diagnosis while appreciating its clinical utility.",
        "corpus": [
            {
                "content": "The biopsychosocial model proposes that psychological disorders result from interacting biological, psychological, and social factors. Biological factors include genetic predispositions, neurotransmitter imbalances, brain structure abnormalities, and hormonal influences. Psychological factors include maladaptive learning, cognitive biases, unconscious conflicts, and coping styles. Social factors include stressful life events, social support, cultural norms, and socioeconomic conditions. For example, depression involves: biological vulnerability (genetic risk, serotonin dysregulation), psychological factors (negative thinking patterns, learned helplessness), and social factors (loss events, social isolation, cultural stigma). The diathesis-stress model specifies that disorders emerge when predispositions (diathesis) interact with environmental stressors. This integrative framework recognizes that no single factor causes disorders and suggests multiple intervention points - biological (medication), psychological (therapy), and social (support, lifestyle changes).",
                "tags": ["biopsychosocial model", "diathesis-stress", "etiology", "psychological disorders", "biological factors", "psychosocial factors"]
            },
            {
                "content": "Major Depressive Disorder involves persistent depressed mood or loss of interest/pleasure (anhedonia) plus additional symptoms: significant weight/appetite changes, sleep disturbances (insomnia or hypersomnia), psychomotor agitation or retardation, fatigue, feelings of worthlessness or excessive guilt, concentration difficulties, and recurrent thoughts of death/suicide. Symptoms must persist most of the day, nearly every day, for at least two weeks and cause significant distress/impairment. Cognitive symptoms include Beck's negative triad - negative views of self, world, and future. Contributing factors: genetic vulnerability (heritability ~40%), neurotransmitter dysregulation (serotonin, norepinephrine, dopamine), stress, negative thinking patterns, learned helplessness, and loss events. Effective treatments include antidepressant medications (SSRIs, SNRIs), cognitive-behavioral therapy (challenging negative thoughts, behavioral activation), and often their combination.",
                "tags": ["major depression", "depressive disorders", "mood disorders", "anhedonia", "cognitive triad", "Beck", "antidepressants", "CBT"]
            },
            {
                "content": "Schizophrenia is a severe disorder involving disturbances in thought, perception, emotion, and behavior. Positive symptoms (additions to normal experience): delusions (false beliefs, often persecutory or grandiose), hallucinations (typically auditory - hearing voices), disorganized speech (loose associations, word salad), and grossly disorganized or catatonic behavior. Negative symptoms (diminution of normal functions): flat affect, alogia (poverty of speech), avolition (lack of motivation), anhedonia, and social withdrawal. Cognitive symptoms include impaired working memory, attention, and executive function. Onset typically in late adolescence/early adulthood; course is variable but often chronic. Etiology involves strong genetic component (heritability ~80%), dopamine hypothesis (excess dopamine activity), brain abnormalities (enlarged ventricles, reduced gray matter), and prenatal factors. Treatment combines antipsychotic medications (blocking dopamine receptors) with psychosocial interventions.",
                "tags": ["schizophrenia", "psychotic disorders", "positive symptoms", "negative symptoms", "delusions", "hallucinations", "dopamine hypothesis", "antipsychotics"]
            },
            {
                "content": "Cognitive-Behavioral Therapy (CBT) is based on the principle that psychological problems stem from maladaptive thinking patterns and behaviors, which can be changed through learning. Cognitive component: identify and challenge distorted automatic thoughts and underlying beliefs/schemas. Techniques include cognitive restructuring (examining evidence for thoughts), Socratic questioning, and identifying cognitive distortions (all-or-nothing thinking, overgeneralization, catastrophizing). Behavioral component: exposure to feared situations (for anxiety), behavioral activation (for depression), and skills training. CBT is structured, time-limited (typically 12-20 sessions), present-focused, collaborative, and homework-oriented. It shows strong empirical support for anxiety disorders, depression, OCD, PTSD, and eating disorders. Variations include Dialectical Behavior Therapy (DBT) for borderline personality disorder and Acceptance and Commitment Therapy (ACT) incorporating mindfulness and values.",
                "tags": ["cognitive-behavioral therapy", "CBT", "cognitive restructuring", "exposure therapy", "behavioral activation", "evidence-based treatment", "psychotherapy"]
            },
            {
                "content": "Anxiety disorders involve excessive fear (emotional response to perceived threat) and anxiety (apprehension about future threat). Types include: (1) Specific phobias - intense fear of particular objects/situations (animals, heights, blood) leading to avoidance; often develop through classical conditioning or observational learning. (2) Panic disorder - recurrent unexpected panic attacks (intense fear with physiological symptoms like palpitations, sweating, trembling) plus fear of future attacks. (3) Agoraphobia - fear of situations where escape might be difficult or help unavailable. (4) Social anxiety disorder - intense fear of social situations involving possible scrutiny. (5) Generalized anxiety disorder - excessive worry about various domains, difficult to control, plus restlessness, fatigue, concentration problems, irritability, muscle tension, sleep disturbance. Treatment: CBT (particularly exposure therapy) and/or medications (SSRIs, SNRIs, or benzodiazepines for short-term use).",
                "tags": ["anxiety disorders", "panic disorder", "phobias", "social anxiety", "generalized anxiety disorder", "GAD", "exposure therapy"]
            }
        ]
    },
    {
        "title": "Social Influence: From Leadership to Prejudice",
        "description": "Investigate how social contexts influence thoughts, feelings, and behaviors. Explore conformity, obedience, persuasion, group dynamics, prejudice, and attraction. Understand both the power of social situations to shape behavior and individual factors that moderate social influence.",
        "learning_objectives": [
            "Explain classic studies of conformity (Asch) and obedience (Milgram) and their implications",
            "Analyze factors influencing persuasion and attitude change (elaboration likelihood model)",
            "Describe group processes including social facilitation, social loafing, groupthink, and group polarization",
            "Understand the psychology of prejudice, stereotyping, and discrimination",
            "Evaluate factors affecting attraction, love, and prosocial behavior"
        ],
        "outline": [
            "1. Social Cognition: Attribution theory, fundamental attribution error, self-serving bias",
            "2. Attitudes: Formation, measurement, attitude-behavior consistency",
            "3. Persuasion: Routes to persuasion (ELM), source, message, and audience factors",
            "4. Conformity: Asch's line studies, normative vs. informational influence",
            "5. Obedience: Milgram's experiments, factors affecting obedience, ethical issues",
            "6. Group Processes: Social facilitation/inhibition, social loafing, deindividuation, groupthink",
            "7. Prejudice and Stereotyping: Origins, maintaining factors, reduction strategies",
            "8. Aggression: Biological, psychological, and social influences; media violence",
            "9. Attraction and Relationships: Proximity, similarity, reciprocity, attachment styles",
            "10. Prosocial Behavior: Altruism, bystander effect, factors promoting helping"
        ],
        "system_prompt": "You are an expert psychology instructor teaching social psychology. Help students understand the power of social situations to influence behavior in ways people often underestimate - the fundamental attribution error applies to understanding ourselves too. Classic studies (Milgram, Asch, Stanford Prison Experiment) demonstrate this dramatically; discuss them to illuminate principles while addressing ethical concerns they raise. Emphasize that social influence operates through multiple mechanisms (normative, informational, identification) and affects everyone, though to varying degrees. When teaching prejudice, balance individual and systemic perspectives - prejudice involves both individual cognitions/motivations and cultural/institutional factors. Make social psychology personally relevant by helping students recognize these processes in daily life - conformity, persuasion attempts, group dynamics, stereotyping. Encourage students to use social psychological knowledge to understand current events and improve intergroup relations.",
        "corpus": [
            {
                "content": "Milgram's obedience studies (1960s) demonstrated that ordinary people would administer apparently dangerous electric shocks to innocent others when directed by an authority figure. Participants believed they were testing learning by shocking a 'learner' (confederate) for errors. Despite protests and apparent pain, 65% continued to maximum 450 volts when the experimenter insisted. Factors increasing obedience: legitimate authority, gradual escalation of commitment, physical distance from victim, proximity to authority, institutional setting. Factors decreasing obedience: victim's proximity, presence of disobedient peers, personal responsibility. Implications: Situational factors can produce destructive behavior in normal people (relevant to understanding atrocities); however, individual variation exists - 35% resisted. Ethical concerns about the study (deception, stress) led to stricter research guidelines but also sparked important discussions about research ethics versus social value.",
                "tags": ["Milgram", "obedience", "authority", "situational factors", "research ethics", "social influence", "destructive obedience"]
            },
            {
                "content": "The Elaboration Likelihood Model (Petty & Cacioppo) proposes two routes to persuasion: Central route - systematic processing of message arguments when motivation and ability are high; produces lasting attitude change resistant to counterarguments. Peripheral route - reliance on superficial cues (source attractiveness, number of arguments, emotional appeals) when motivation or ability are low; produces temporary attitude change. Factors affecting elaboration: Personal relevance increases motivation; distraction, time pressure, or low knowledge decrease ability; individual differences (need for cognition) affect preference for central processing. Implications: Effective persuasion matches strategy to audience - use strong arguments for involved audiences (central route) but peripheral cues for uninvolved audiences. Advertisers use both routes - celebrity endorsements (peripheral) and product comparisons (central). Understanding these routes helps people resist unwanted influence.",
                "tags": ["elaboration likelihood model", "ELM", "persuasion", "central route", "peripheral route", "attitude change", "Petty", "Cacioppo"]
            },
            {
                "content": "Prejudice (negative attitude toward group members), stereotyping (overgeneralized beliefs about groups), and discrimination (negative behavior toward group members) arise from multiple sources: Cognitive - categorization simplifies complex social world but exaggerates differences between groups and similarities within groups; confirmation bias maintains stereotypes. Motivational - social identity theory proposes people derive self-esteem from group memberships, creating ingroup favoritism and outgroup derogation; scapegoating displaces frustration onto vulnerable groups. Social/cultural - socialization transmits prejudiced attitudes; institutional discrimination perpetuates inequality. Reduction strategies: Equal-status contact under cooperative conditions (Sherif's Robbers Cave); perspective-taking and empathy; recognizing common ingroup identity; education about automatic biases (implicit associations). Understanding that stereotypes often operate automatically (System 1) but can be overridden with motivation and cognitive resources (System 2).",
                "tags": ["prejudice", "stereotyping", "discrimination", "social identity theory", "ingroup favoritism", "implicit bias", "stereotype reduction"]
            },
            {
                "content": "The fundamental attribution error (FAE) is the tendency to overestimate dispositional (personality) factors and underestimate situational factors when explaining others' behavior. For example, seeing someone trip and concluding they're clumsy (dispositional) rather than considering an uneven sidewalk (situational). The actor-observer bias extends this - we attribute our own behavior to situations but others' to dispositions. The self-serving bias attributes our successes to internal factors (ability, effort) but failures to external factors (bad luck, task difficulty), protecting self-esteem. Cultural variation exists - FAE is stronger in individualistic cultures emphasizing personal agency versus collectivistic cultures emphasizing context and relationships. Understanding these biases helps us: (1) avoid harsh judgments of others, (2) recognize situational influences on our own behavior, (3) appreciate how culture shapes thinking patterns.",
                "tags": ["fundamental attribution error", "FAE", "attribution theory", "actor-observer bias", "self-serving bias", "dispositional attribution", "situational attribution"]
            },
            {
                "content": "The bystander effect describes the phenomenon where individuals are less likely to help in emergencies when others are present. Darley and Latané's research (following Kitty Genovese case) identified a multi-step decision process: (1) Notice the event, (2) Interpret it as emergency (pluralistic ignorance - if others seem calm, interpret as non-emergency), (3) Assume personal responsibility (diffusion of responsibility - each person feels less responsible when others present), (4) Know appropriate helping form, (5) Implement decision to help. Number of bystanders particularly affects steps 2 and 3. Factors increasing helping: being alone, personal relationship with victim, having relevant skills, perceiving victim as similar or deserving, good mood, small town/rural environment, time pressure (absent). Arousal: cost-reward model proposes helping reduces unpleasant arousal from witnessing suffering, but people weigh costs/benefits. Understanding the bystander effect can reduce it - education helps people recognize and resist these processes.",
                "tags": ["bystander effect", "prosocial behavior", "diffusion of responsibility", "pluralistic ignorance", "altruism", "helping behavior", "Darley", "Latané"]
            }
        ]
    },
    {
        "title": "Applications and Future Directions of Psychology",
        "description": "Explore how psychological principles and research methods apply to real-world domains including health, work, education, law, and technology. Understand career paths in psychology, emerging research areas, and psychology's role in addressing contemporary challenges. Synthesize knowledge from across the course.",
        "learning_objectives": [
            "Apply psychological principles to understand health behaviors and promote wellness",
            "Analyze how psychology contributes to organizational effectiveness and employee well-being",
            "Evaluate psychological factors in educational success and learning environments",
            "Understand psychology's role in legal contexts (eyewitness testimony, jury decision-making)",
            "Explore emerging areas (positive psychology, neuroscience, technology, cultural psychology)"
        ],
        "outline": [
            "1. Health Psychology: Stress and health, health behaviors, biopsychosocial model of illness",
            "2. Coping and Resilience: Stress management, emotion regulation, post-traumatic growth",
            "3. Industrial-Organizational Psychology: Personnel selection, motivation, leadership, organizational culture",
            "4. Educational Psychology: Learning principles application, motivation, testing, individual differences",
            "5. Psychology and Law: Eyewitness memory, jury decision-making, criminal profiling, competency",
            "6. Positive Psychology: Well-being, strengths, flow, meaning, gratitude, mindfulness",
            "7. Cultural Psychology: Individualism-collectivism, cultural influences on cognition and emotion",
            "8. Technology and Psychology: Social media effects, digital wellness, human-computer interaction",
            "9. Neuroscience Advances: Brain imaging, neuroplasticity, brain-computer interfaces",
            "10. Psychology Careers and Ethics: Professional paths, ethical principles, lifelong learning"
        ],
        "system_prompt": "You are an expert psychology instructor teaching applications of psychology and future directions. Help students synthesize knowledge from across the course by showing how different topics connect in applied contexts - for example, health psychology integrates stress physiology, learning principles, social influence, and cognition. Emphasize that psychology is fundamentally an applied science - understanding human behavior has practical value for improving lives, organizations, and society. When discussing career paths, present the diversity of psychology (clinical, research, I-O, school, forensic, health, etc.) and emphasize that psychology training develops valuable skills (research, analysis, communication, understanding people) applicable to many careers. Highlight emerging areas showing psychology's evolving nature and relevance to contemporary challenges. Encourage students to think about ethical responsibilities of applying psychological knowledge and to continue learning beyond the course.",
        "corpus": [
            {
                "content": "Health psychology examines psychological and behavioral factors affecting physical health and illness. The biopsychosocial model applies: biological factors (genetics, physiology), psychological factors (stress, coping, personality, health beliefs), and social factors (support, socioeconomic status, culture) interact to influence health. Research areas include: (1) Stress and health - chronic stress affects immune function, cardiovascular health, and disease progression through physiological pathways (HPA axis, inflammation) and health behaviors; (2) Health behaviors - psychology informs interventions promoting exercise, healthy eating, smoking cessation, medication adherence using learning principles, motivation theories, and social influence; (3) Illness management - psychological interventions improve adjustment to chronic illness, pain management, and treatment outcomes; (4) Prevention - understanding risk perception and behavior change promotes preventive behaviors. Integration of psychology in healthcare (behavioral medicine) improves outcomes and reduces costs.",
                "tags": ["health psychology", "biopsychosocial model", "stress and health", "health behaviors", "behavioral medicine", "chronic illness", "prevention"]
            },
            {
                "content": "Industrial-Organizational (I-O) psychology applies psychological principles to workplace issues. Personnel psychology focuses on employee selection (job analysis, valid assessment methods, reducing bias), performance appraisal, and training effectiveness. Organizational psychology examines motivation (goal-setting theory, expectancy theory, job characteristics model), job satisfaction, leadership styles and effectiveness, organizational culture, and team dynamics. Work-life balance, workplace diversity, and employee well-being are growing concerns. Applications include: designing valid selection procedures, structuring effective performance feedback, creating motivating work environments, developing leaders, managing organizational change, and promoting psychological safety. For example, structured interviews based on job analysis improve hiring validity and reduce bias compared to unstructured interviews. Understanding motivation helps design jobs providing autonomy, skill variety, and meaningfulness, enhancing both performance and satisfaction.",
                "tags": ["industrial-organizational psychology", "I-O psychology", "personnel selection", "work motivation", "leadership", "job satisfaction", "organizational behavior"]
            },
            {
                "content": "Eyewitness testimony research reveals systematic memory errors with serious legal implications. Problems include: (1) Misinformation effect - exposure to misleading information after an event distorts memory (Loftus); leading questions by police/attorneys can alter recollections. (2) Source monitoring errors - confusing where information came from (witnessed vs. suggested). (3) Unconscious transference - misidentifying familiar person as perpetrator. (4) Weapon focus - attention to weapon reduces memory for other details. (5) Cross-race effect - reduced accuracy identifying other-race faces. (6) Confidence-accuracy relationship is weak - confident witnesses aren't necessarily accurate; confidence is influenced by feedback and repeated questioning. Implications: (1) Lineup procedures should be double-blind and use sequential presentation; (2) Interview techniques should avoid leading questions; (3) Jury instructions should address memory limitations; (4) Expert testimony can educate about these factors. Understanding memory's reconstructive nature is crucial for justice system.",
                "tags": ["eyewitness testimony", "Loftus", "misinformation effect", "memory distortion", "forensic psychology", "legal psychology", "lineup procedures"]
            },
            {
                "content": "Positive psychology, founded by Seligman and colleagues, studies human strengths, well-being, and optimal functioning, complementing psychology's traditional focus on dysfunction. Research areas include: (1) Well-being components - PERMA model proposes Positive emotions, Engagement/flow, Relationships, Meaning, and Accomplishment; (2) Character strengths - VIA classification identifies 24 strengths (wisdom, courage, humanity, justice, temperance, transcendence); using signature strengths enhances well-being; (3) Resilience - factors promoting positive adaptation to adversity; growth mindset and optimistic explanatory style buffer against depression; (4) Positive interventions - gratitude exercises, savoring, acts of kindness, and mindfulness increase happiness and life satisfaction. Critiques: risk of ignoring real problems, cultural bias toward Western individualism, 'happiology' oversimplification. Balanced view: Understanding both problems and strengths provides complete picture of human psychology.",
                "tags": ["positive psychology", "well-being", "PERMA", "character strengths", "resilience", "Seligman", "flourishing", "mindfulness"]
            },
            {
                "content": "Cultural psychology examines how cultural meanings, practices, and institutions shape psychological processes. Key dimension: Individualism (prioritizing personal goals, independence, uniqueness) versus Collectivism (prioritizing group goals, interdependence, harmony). Effects include: (1) Self-concept - independent (separate, unique) vs. interdependent (connected, relational); affects motivation, emotion, cognition. (2) Attribution - fundamental attribution error stronger in individualistic cultures; collectivistic cultures attend more to context. (3) Cognition - analytic (focus on objects, categories, rules) vs. holistic (attention to relationships, context) thinking styles. (4) Emotion - display rules, ideal affect (high vs. low arousal), shame vs. guilt. (5) Development - parenting goals, attachment patterns, moral reasoning vary culturally. Importance: Most psychology research uses WEIRD samples (Western, Educated, Industrialized, Rich, Democratic), potentially limiting generalizability. Cultural psychology reveals both universal and culturally-specific aspects of human psychology.",
                "tags": ["cultural psychology", "individualism-collectivism", "cross-cultural psychology", "self-construal", "cultural differences", "WEIRD samples", "holistic thinking"]
            }
        ]
    }
]

def main():
    """Main function to add Psychology modules to database"""
    print(f"Connecting to database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        module_count = 0
        total_corpus_count = 0

        # Insert each module
        for idx, module in enumerate(MODULES, 1):
            print(f"\nProcessing Module {idx}: {module['title']}")

            # Convert lists and corpus to JSON strings
            learning_objectives_json = json.dumps(module['learning_objectives'])
            outline_json = json.dumps(module['outline'])
            corpus_json = json.dumps(module['corpus'])

            # Insert module
            cursor.execute("""
                INSERT INTO modules
                (class_id, title, description, learning_objectives, outline, system_prompt, module_corpus, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                2,  # class_id for Psychology
                module['title'],
                module['description'],
                learning_objectives_json,
                outline_json,
                module['system_prompt'],
                corpus_json,
                1  # created_by
            ))

            module_id = cursor.lastrowid
            module_count += 1
            corpus_count = len(module['corpus'])
            total_corpus_count += corpus_count
            print(f"  - Inserted module with ID: {module_id}")
            print(f"  - Added {corpus_count} corpus entries to module_corpus field")

        # Commit all changes
        conn.commit()
        print(f"\n{'='*60}")
        print(f"SUCCESS! Added to HARV database:")
        print(f"  - {module_count} Psychology modules")
        print(f"  - {total_corpus_count} total corpus entries (5 per module)")
        print(f"  - All modules assigned to class_id=2 (Psychology)")
        print(f"  - All modules created_by user_id=1")
        print(f"{'='*60}\n")

    except Exception as e:
        conn.rollback()
        print(f"\nERROR: {str(e)}")
        raise
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == "__main__":
    main()
