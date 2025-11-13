#!/usr/bin/env python3
import sqlite3

# Connect to database
conn = sqlite3.connect('backend/harv.db')
cursor = conn.cursor()

# Module 2: Writing Art History
cursor.execute("""
INSERT INTO modules (class_id, title, description, created_by) VALUES
(1, 'Writing Art History', 'Discover how art history has been written from ancient times to the present. Examine key figures from Pliny the Elder to Giorgio Vasari, from Winckelmann to Gombrich. Explore different narrative frameworks including biography, style-based histories, and gendered perspectives. Consider how feminist art historians have challenged traditional approaches and opened up new ways of understanding artistic production.', 1)
""")
module2_id = cursor.lastrowid

# Module 2 Corpus Entries (6 entries)
module2_corpus = [
    ("Pliny and Ancient Writing About Art", """Gaius Plinius Secundus (Pliny the Elder, CE 23/24-79) wrote 'Natural History,' a 37-volume encyclopedia that included important sections on art and architecture of the Graeco-Roman world.

**Significance:**
- Survived intact (unlike many fragmentary ancient texts)
- Translated to Italian in 1476, making it widely accessible during Renaissance
- Influenced Renaissance attitudes toward ancient art
- Provided descriptions that helped identify rediscovered ancient sculptures (e.g., Apollo Belvedere)

**Approach:**
- Biographical details of artists (especially Apelles, the painter)
- Technical descriptions
- Anecdotes about artistic skill and competition
- Helped establish idea of artist as having status and intellectual worth

The Renaissance fascination with Pliny shows how art historical writing itself has a history and influences artistic practice.""", "theory", 1),

    ("Giorgio Vasari's Lives of the Artists", """Giorgio Vasari (1511-1574) was a Florentine painter and architect whose 'Lives of the Artists' (1550, revised 1568) is still in print and remains influential.

**Structure:**
- **Part 1**: 'Rebirth' after Dark Ages (Cimabue, Giotto)
- **Part 2**: Early Renaissance (Masaccio, Botticelli, Brunelleschi, Alberti)
- **Part 3**: High Renaissance climaxing in Michelangelo (Leonardo, Raphael, Michelangelo)

**Vasari's Criteria for Quality:**
1. **Disegno** (design/draughtsmanship): Divine idea in artist's mind
2. **Natura** (naturalism): Imitation and idealization of nature
3. **Grazia** (grace): Softness, beauty
4. **Decoro** (decorum): Appropriateness to subject
5. **Maniera** (style): Personal or school style

**Impact:**
- Established biography as a way to write art history
- Created idea of artistic progress toward greater naturalism
- Founded the canon of Renaissance 'great artists'
- Emphasized individual genius

**Problems:**
- Teleological (everything leads to Michelangelo)
- Personal biases (favorite artists get more attention)
- What happens after 'perfection' is reached?
- Ignores social/political context
- No interest in earlier (Gothic, Byzantine) periods
- Focus on male artists only""", "theory", 2),

    ("Winckelmann and Systematic Art History", """Johann Joachim Winckelmann (1717-1768) pioneered a more systematic, chronological approach in works like 'History of the Art of Antiquity' (1764).

**Key Ideas:**
- Art should be studied as a historical system, not just individual biographies
- Ancient Greek art (5th century BCE) represents the pinnacle of beauty and perfection
- Art goes through cycles: development, perfection, decline
- Applied theories of language development to visual art
- Art reflects the culture and values of its time

**Influence:**
- Established 'classical' Greek art as the ideal
- Introduced systematic periodization
- Made cultural context important
- Influenced Neoclassicism in 18th-century art
- Less focused on individual artists than on aesthetic and historical analysis

**Limitations:**
- Still Eurocentric (privileges Greek art)
- Cyclical model of rise and decline can be limiting
- Many 'Greek' sculptures he studied were actually Roman copies
- Relied heavily on textual descriptions (limited access to good images)""", "theory", 3),

    ("Hegel, Marx, and Contextual Art History", """**G.W.F. Hegel (1770-1831):**
- Art manifests the 'world spirit' (Weltgeist)
- History shaped by 'spirit of the age' (Zeitgeist) and 'spirit of the nation' (Volksgeist)
- Art progresses through Symbolic → Classical → Romantic periods
- De-emphasizes individual genius in favor of broader historical forces
- Style develops autonomously, transcending individual artists

**Karl Marx (1818-1883):**
- Historical materialism: economic base determines cultural superstructure
- Art reflects class relationships and power dynamics
- Ideology: Art shapes how we see ourselves and our society
- Social production and consumption of art matters more than individual artists
- Example: Constable's 'The Cornfield' (1826) presents rural idyll, but this ideology serves the landowning elite while ignoring displacement of rural poor during Enclosure and Industrial Revolution

**Impact on Art History:**
- Opens up social and political analysis
- Questions whose interests art serves
- Considers patronage, production methods, audience
- Influential on social art history and New Art History
- Challenges formalist/aesthetic-only approaches""", "theory", 4),

    ("Feminist Art History: Gender and the Canon", """**Key Questions (Linda Nochlin, 1971):**
'Why Have There Been No Great Women Artists?'

**Answers:**
NOT because women lack talent, but because:
- Excluded from training (no access to academies, life drawing classes)
- Expected to focus on domestic roles
- Denied patronage and commissions
- Systematic marginalization from art institutions
- Written out of art history narratives

**Griselda Pollock and Rozsika Parker ('Old Mistresses,' 1981):**
'Women are represented negatively, as lacking in creativity, with nothing significant to contribute, and as having no influence on the course of art. Paradoxically, to negate them women have to be acknowledged; they are mentioned in order to be categorised, set apart and marginalised.'

**Feminist Interventions:**
1. **Recovery**: Rediscover forgotten women artists
2. **Critique**: Analyze gender bias in canon, museums, scholarship
3. **Analysis**: Study how women are represented in art (male gaze, objectification)
4. **Rethinking**: Question what counts as art (include crafts, textiles, decorative arts)
5. **Intersectionality**: Consider race, class, sexuality alongside gender

**Broader Impact:**
- Opened door to studying marginalized groups (colonial subjects, LGBTQ+ artists)
- Challenged notion of 'universal' aesthetic standards
- Made visible the ideological work art and art history perform
- Inspired queer theory, post-colonial approaches in art history""", "theory", 5),

    ("Comparing Art Historical Writing: Vasari vs. Gombrich", """Both Vasari and Ernst Gombrich (20th-century art historian) wrote about Raphael's 'School of Athens' (1509-11), but their approaches differ significantly:

**Vasari's Approach:**
- Focus on Raphael's artistic skill and biography
- Describes figures in detail: 'Diogenes with his cup, lying deep in thought on the steps'
- Praises beauty and technical execution
- Misidentifies some figures (working from engravings, not original)
- Emphasizes artist's genius

**Gombrich's Approach ('Symbolic Images,' 1972):**
- Corrects Vasari's errors based on better scholarship
- Contextualizes within entire room (Stanza della Segnatura)
- Explains iconographic program: ceiling personifications relate to wall frescoes
- Shows how 'School of Athens' (Philosophy) pairs with Theology, Law, Poetry
- Analyzes cultural meaning: Liberal Arts as taught in Italian universities
- Critiques Vasari for isolating fresco from its decorative and intellectual context

**Lesson:**
How we write about art changes as the discipline evolves. Gombrich builds on Vasari but uses better evidence, considers broader context, and corrects errors. Both approaches have value but serve different purposes.""", "example", 6)
]

for title, content, entry_type, order_idx in module2_corpus:
    cursor.execute("""
    INSERT INTO module_corpus_entries (module_id, title, content, type, order_index, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    """, (module2_id, title, content, entry_type, order_idx))

print(f"✓ Module 2 created (ID: {module2_id})")

# Module 3: Presenting Art History
cursor.execute("""
INSERT INTO modules (class_id, title, description, created_by) VALUES
(1, 'Presenting Art History', 'Investigate how art is displayed and experienced in museums and galleries. Trace the history of collecting from ancient times through the Grand Tour to modern public museums. Understand how display strategies (chronological, thematic, monographic) shape our understanding of art history. Consider the relationship between museums and national identity, the politics of inclusion/exclusion, and how exhibitions themselves construct historical narratives.', 1)
""")
module3_id = cursor.lastrowid

# Module 3 Corpus Entries (5 entries)
module3_corpus = [
    ("History of Collecting: From Antiquity to Museums", """**Ancient Origins:**
- Mouseion (Ancient Greece): 'Home of the Muses' - buildings housing religious offerings
- Roman collections: Emperor Hadrian's villa at Tivoli (sculptures, art objects)
- Private collections indicate status and wealth

**Renaissance (16th-17th centuries):**
- Cabinet of curiosities: Small private collections (prints, drawings, scientific instruments, natural specimens)
- Papal and princely collections: Vatican collection with Apollo Belvedere
- Pope Julius II as patron: Commissioned Michelangelo (Sistine Chapel), Raphael (Vatican Stanze), Bernini
- Collections signify cultural worth and power

**18th Century - The Grand Tour:**
- Educational travel for wealthy young men through Europe, especially Italy
- Rome as focal point: View ancient ruins, Renaissance art
- Purchase souvenirs: Antique sculptures (often assembled from fragments), paintings, drawings
- Influenced collecting trends and classical revival in art and architecture
- Example: Reynolds' 'Three Ladies Adorning a Term of Hymen' (1773) shows classical references as part of elite culture

**Late 18th Century - Public Access:**
- Private princely collections opened to select public (Paris, Rome, Florence, Dresden, Stockholm)
- Not fully open-access, but increasing availability

**1793 - Louvre Opens:**
- French Revolutionary ideals: Royal collection opened to public
- Symbolizes liberty, equality, fraternity
- However, class divides persist (working-class visitors criticized for lacking knowledge)
- Model for other national museums

**19th Century Expansion:**
- National Gallery, London (founded on Angerstein Collection of Italian Renaissance art)
- British Museum (Graeco-Roman antiquities)
- Victoria & Albert Museum (1857): Design, crafts, and imperial acquisitions
- Museums express national prestige and identity
- Art from colonies displayed to show Britain's power
- Working-class encouraged to visit for 'improvement' and to prevent unrest

**20th-21st Centuries:**
- Proliferation of public museums worldwide
- Increasing attention to non-Western art
- Debates over colonial acquisition and repatriation
- Expansion beyond 'high art' to include design, photography, popular culture""", "concept", 1),

    ("Display Strategies and Their Meanings", """Museums use various strategies to organize and present art:

**1. Chronological Display:**
- Art arranged by date and period (Egyptian → Greek/Roman → Medieval → Renaissance → Modern)
- Creates linear narrative of progress and development
- Example: Musée d'Orsay (French 19th century art from Academic → Impressionist → Post-Impressionist)
- Advantage: Clear educational progression
- Disadvantage: Implies teleological development (history moving toward a goal)

**2. National Schools:**
- Organized by country/region (Italian, Dutch, French galleries)
- Emphasizes national artistic traditions
- Example: Rijksmuseum (Dutch art), Prado (Spanish), National Gallery London
- Reinforces national identity
- Can obscure cross-cultural influences

**3. Thematic Display:**
- Groups art by subject matter or concept, regardless of date or origin
- Example: Tate Modern (female nude room showing works across periods)
- Breaks with traditional chronology and authorship
- Invites new comparisons and interpretations
- Shows how themes persist across time and culture

**4. Monographic:**
- Entire rooms or wings devoted to single artist or movement
- Common for modern/contemporary art (rooms for Pollock, Warhol, etc.)
- Celebrates individual 'genius'
- Can support art market value

**5. Period Rooms:**
- Recreate historical settings
- Show art in context (furniture, decorative arts)
- Example: Metropolitan Museum period rooms
- Aims for authenticity but is still a modern reconstruction

**Implications:**
- ALL display strategies are interpretive choices
- Reflect current values and concerns, not timeless truth
- What is included/excluded reveals ideology
- 'Neutral' presentation is impossible - space, lighting, labels all affect meaning
- Museums mediate between us and the past""", "concept", 2),

    ("Museums, National Identity, and Ideology", """Museums serve multiple functions beyond simply displaying art:

**Nation-Building:**
- Express cultural values and achievements
- Create shared national heritage
- Mark cities as cultural capitals
- Examples: Louvre (French grandeur), British Museum (British Empire), National Gallery Washington (American arrival as cultural power)

**Education and 'Improvement':**
- 19th century belief that viewing art improves morality and taste
- Working-class encouraged to visit for edification
- Victoria & Albert Museum: Teach good design standards to masses
- Implicit assumption: There are 'correct' aesthetic standards

**Colonial Power:**
- Imperial nations displayed art from colonies
- Showed extent of their global dominance
- Often acquired through warfare, colonization, unequal trade
- Example: British Museum's Egyptian, Greek, African, Oceanic collections
- Current debates: Should Elgin Marbles be returned to Greece? Benin Bronzes to Nigeria?

**Canon Formation:**
- Museums legitimize what counts as 'art'
- Inclusion confers value and importance
- Example: Carl Andre's 'Equivalent VIII' (1976) - 120 bricks arranged on floor
- Public outcry: 'This isn't art!' But Tate's acquisition confers art status
- Museums have power to define boundaries of art

**The 'White Cube' Effect:**
- Modern gallery aesthetic: White walls, spotlights, minimal context
- Presents art as autonomous aesthetic objects
- Removes from original social/religious/political context
- Makes all art look 'the same' regardless of origin

**Exclusions Reveal Ideology:**
- Whose art is shown? Historically: European, male, 'high' art
- Whose art is marginalized? Women, non-Western, 'low' art (crafts, textiles, popular culture)
- Recent improvements: More diverse exhibitions, but challenges remain""", "concept", 3),

    ("Special Exhibitions and Art History", """Temporary exhibitions play crucial role in shaping art historical knowledge:

**Roger Fry's 'Manet and the Post-Impressionists' (1910-11):**
- Brought Van Gogh, Gauguin, Cézanne to British attention
- Fry NAMED the movement 'Post-Impressionism' (didn't exist before!)
- Caused controversy but established these artists in canon
- Shows how exhibitions create categories and movements

**Blockbuster Exhibitions:**
- Major touring shows bring together works from multiple collections
- Unique opportunity to see works in conversation
- Generate publicity and visitors
- Examples: 'Primitivism' (MoMA, 1984), 'Sensation' (Royal Academy, 1997)

**Advantages:**
- Enable scholarship by bringing dispersed works together
- Generate new research and catalogues
- Make art accessible to broader audiences
- Can challenge or revise existing narratives

**Controversies:**
- Selection and framing reveal curatorial biases
- Can perpetuate problematic narratives (e.g., 'Primitivism' show criticized for treating African art as inspiration for Western Modernism rather than on its own terms)
- Sponsorship and politics influence what gets shown

**Impact on Art History:**
- Exhibition catalogues become important scholarly resources
- Shows can launch or revise artistic reputations
- Make arguments about historical connections and influences
- Art criticism of exhibitions shapes public understanding""", "concept", 4),

    ("Two Mini-Exhibitions: Gender and Representation", """Consider how curatorial choices shape meaning:

**Exhibition 1: 'Woman'**
Artworks selected:
- Leonardo's 'Virgin and Child with St Anne and St John the Baptist' (c.1500) - Maternity
- Vermeer's 'Maid with a Milk Jug' (c.1658-60) - Domesticity, servitude
- Reynolds' 'Three Ladies Adorning a Term of Hymen' (1773) - Matrimonial status (spinster, fiancée, bride)
- Baule female figure, Ivory Coast (19th century) - Sexuality, fertility

**Themes Revealed:**
Women represented through roles: mother, servant, wife, sexual object. Focus on reproduction, domestic sphere, and relation to men.

**Exhibition 2: 'Man'**
Artworks selected:
- Manuscript illustration of Four Evangelists (9th century) - Religious authority, authorship
- Raphael's 'School of Athens' (1509-11) - Intellectual achievement, philosophy
- Apollo Belvedere (Roman copy of Greek original) - Physical perfection, beauty, divinity
- Easter Island statues (Ahu Akivi) - Tribal chiefs, warriors, gods - political/military authority

**Themes Revealed:**
Men represented through achievements: religious leaders, thinkers, ideal beauty, secular authority. Focus on public sphere, intellect, and power.

**Curatorial Insight:**
How we group artworks creates meaning and reveals patterns. These patterns reflect historical gender ideologies. A good exhibition can make visible what individual works might not reveal.""", "example", 5)
]

for title, content, entry_type, order_idx in module3_corpus:
    cursor.execute("""
    INSERT INTO module_corpus_entries (module_id, title, content, type, order_index, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    """, (module3_id, title, content, entry_type, order_idx))

print(f"✓ Module 3 created (ID: {module3_id})")

# Commit the changes
conn.commit()
conn.close()

print("\n✅ Modules 2-3 created successfully!")
print("Run this script again to add modules 4-6")
