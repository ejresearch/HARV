-- Create Psychology Class
INSERT INTO classes (
    title,
    description,
    system_prompt,
    learning_objectives,
    outline,
    created_by,
    created_at
) VALUES (
    'Introduction to Psychology: Understanding the Science of Mental Life',
    'This comprehensive introduction to psychology explores the scientific study of mental life - how we perceive, learn, remember, think, feel, develop, differ from each other, and interact. Drawing from cutting-edge research in cognitive science, neuroscience, and behavioral studies, you''ll discover how psychological processes shape human experience and behavior. From understanding how perception constructs reality to examining what happens when things go wrong, this course provides a foundational understanding of psychology as both a science and a practical discipline that improves lives.',
    'You are an engaging psychology instructor who helps students understand that psychology is not common sense or mind-reading, but a rigorous scientific discipline that uses careful observation, experimentation, and theoretical frameworks to understand mental life. Your teaching emphasizes:

- The scientific method and critical thinking over intuition and preconceptions
- How psychological processes happen largely outside awareness yet profoundly influence behavior
- The interaction between biological, cognitive, emotional, and social factors in shaping human experience
- Real-world applications and experimental evidence for every concept
- How studying both normal and abnormal psychology deepens our understanding of the mind
- The importance of multiple perspectives (cognitive, behavioral, biological, social) in understanding complex psychological phenomena

Encourage students to question their assumptions, think critically about research methods, and understand that psychological findings are based on empirical evidence, not speculation. Use vivid examples, classic experiments, and contemporary research to illustrate concepts. Help students see connections between different areas of psychology and appreciate both the progress made and questions that remain.',
    '- Explain psychology as the scientific study of mental life and distinguish it from pseudoscience and common sense
- Describe the major research methods used in psychology and evaluate their strengths and limitations
- Analyze how perception, attention, learning, and memory actively construct our experience rather than passively recording reality
- Apply principles of cognitive psychology to understand thinking, reasoning, decision-making, and problem-solving
- Examine the biological and cognitive bases of motivation and emotion and their influence on behavior
- Trace typical patterns of human development across the lifespan and identify factors that influence developmental outcomes
- Evaluate theories of intelligence and personality and understand how individual differences are measured and conceptualized
- Identify major categories of psychological disorders and explain different approaches to understanding and treating abnormal behavior
- Analyze how social factors influence individual behavior through conformity, obedience, leadership, and prejudice
- Apply psychological principles to real-world problems in clinical, educational, organizational, and social contexts
- Critically evaluate psychological research and claims, distinguishing between well-designed studies and flawed methodology
- Synthesize knowledge from multiple psychological perspectives to understand complex human behavior',
    'I. Foundations of Scientific Psychology
   - Psychology as the science of mental life
   - Historical development from introspection to cognitive neuroscience
   - Research methods and scientific thinking
   - Branches of psychology and related fields

II. Core Cognitive Processes
   - Perception: Constructing reality from sensory input
   - Attention: Managing a limited-capacity system
   - Learning: Classical and operant conditioning, complex learning
   - Memory: Encoding, storage, retrieval, and reconstruction

III. Higher Mental Functions
   - Thinking: System 1 (fast, intuitive) vs System 2 (slow, deliberate)
   - Reasoning: Heuristics, biases, and decision-making
   - Problem-solving and creativity
   - Language and communication

IV. Motivation and Emotion
   - Biological and psychological drives
   - Reward processing and prediction
   - Components of emotion and emotional experience
   - Interactions between cognition and affect

V. Development Across the Lifespan
   - Innate abilities and critical periods
   - Brain development from infancy through adulthood
   - Attachment and social development
   - Effects of early experience and developmental plasticity

VI. Individual Differences
   - Measuring intelligence: IQ tests, theories, and controversies
   - Nature vs nurture in intelligence
   - Personality theories and assessment
   - Practical applications and limitations of psychological testing

VII. Abnormal Psychology
   - Defining and classifying abnormality
   - Major categories of mental disorders
   - Theories of abnormal behavior (medical, psychodynamic, cognitive-behavioral)
   - Evidence-based treatments and interventions

VIII. Social Psychology
   - Social facilitation and leadership
   - Conformity and obedience
   - Prejudice and intergroup relations
   - Applications to real-world social problems

IX. Applications and Future Directions
   - Professional roles for psychologists
   - Uses and potential misuses of psychology
   - Emerging areas: cognitive neuroscience, behavioral economics
   - Future challenges and interdisciplinary collaboration',
    1,
    datetime('now')
);

-- Class Corpus Entries
INSERT INTO class_corpus (class_id, title, content, type, order_index, created_at) VALUES
(2, 'Psychology as Scientific Study of Mental Life', 'Psychology is defined as the science of mental life - the study of how organisms use their mental abilities to operate in and on the world. Unlike common sense or introspection, scientific psychology uses rigorous methods to study observable behavior and brain function to make inferences about mental processes. The field emerged in the late 19th century when researchers began applying scientific methods to psychological questions. Modern psychology combines insights from cognitive science, neuroscience, and experimental research to understand perception, learning, memory, thinking, emotion, development, and social behavior. Psychology is not mind-reading or manipulation - it''s about understanding the conditions under which mental processes operate through careful observation, measurement, hypothesis testing, and theory building.', 'framework', 1, datetime('now')),

(2, 'The Cognitive Revolution and Information Processing', 'Psychology underwent a cognitive revolution when researchers began viewing the mind as an information processing system. This approach, enabled by advances in technology like fMRI scanners and computational neuroscience, allows psychologists to study what happens between stimulus and response. The brain actively constructs our experience of reality by combining sensory input with stored knowledge and expectations, often using processes similar to Bayesian inference. Much of this processing happens automatically, outside conscious awareness, yet profoundly influences our perceptions, decisions, and behaviors. Understanding these hidden processes through experimental methods has transformed psychology from purely behavioral observation to a sophisticated science that can describe, predict, and sometimes modify mental functions.', 'framework', 2, datetime('now')),

(2, 'The Nature-Nurture Interaction', 'The debate about whether human characteristics are determined by genetics (nature) or environment (nurture) has evolved into understanding their complex interaction. Identical twin studies, adoption research, and brain imaging reveal that both biological predispositions and environmental experiences shape psychological development. Genes may set potentials, but environment determines how those potentials are expressed. For example, we''re born with the capacity for language, but which language we learn depends on our environment. Moreover, interactions occur: a baby''s temperament (partly genetic) influences how caregivers respond, which in turn shapes further development. Modern psychology recognizes that questions about nature versus nurture are better framed as understanding how nature and nurture work together.', 'framework', 3, datetime('now')),

(2, 'The Active Construction of Reality', 'One of psychology''s most important discoveries is that we don''t passively receive information from the world - we actively construct our experience of reality. Perception involves the brain making hypotheses and predictions based on sensory input combined with prior knowledge and expectations. The Necker cube and other illusions demonstrate this: the brain alternates between interpretations of ambiguous stimuli. Similarly, memory is not a tape recording but an active reconstruction that combines what actually happened with our interpretations and subsequent experiences. Even attention selectively filters information based on expectations and motivations. This constructive nature of mental life means that psychological reality is partly subjective, influenced by our unique history, current state, and cognitive processes operating outside awareness.', 'framework', 4, datetime('now')),

(2, 'Multiple Levels of Psychological Explanation', 'Psychology cannot be explained by a single theory or level of analysis because mental processes involve multiple interacting systems. A complete understanding requires examining phenomena at different levels: biological (brain structures, neurotransmitters, genetics), cognitive (information processing, beliefs, expectations), behavioral (observable actions, learned responses), affective (emotions, motivations), and social (cultural norms, group influences). For example, depression involves altered brain chemistry, negative thinking patterns, reduced activity levels, low mood, and often social isolation. Effective treatment may require interventions at multiple levels. This complexity means psychology uses diverse methods and perspectives, from neuroscience to humanistic approaches, each contributing unique insights into the multifaceted nature of mental life.', 'framework', 5, datetime('now'));
