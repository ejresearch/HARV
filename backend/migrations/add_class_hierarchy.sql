-- Migration: Add Class Hierarchy (Additive Migration - Safe)
-- This migration adds the Class concept as parent to Modules
-- Existing data is preserved

-- Step 1: Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    outline TEXT,
    learning_objectives TEXT,
    system_prompt TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_classes_id ON classes (id);

-- Step 2: Add class_id to modules table (nullable for now)
ALTER TABLE modules ADD COLUMN class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE;

-- Step 3: Rename course_corpus to class_corpus
ALTER TABLE course_corpus RENAME TO class_corpus;

-- Step 4: Add class_id to class_corpus
ALTER TABLE class_corpus ADD COLUMN class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE;

-- Step 5: Add class_id to documents (can belong to class OR module)
ALTER TABLE documents ADD COLUMN class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE;

-- Step 6: Add outline column to modules (for module-level outlines)
ALTER TABLE modules ADD COLUMN outline TEXT;

-- Step 7: Add class_id to user_progress (to track class-level progress)
ALTER TABLE user_progress ADD COLUMN class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE;

-- Step 8: Create default class for existing modules (optional migration helper)
-- INSERT INTO classes (title, description, system_prompt)
-- VALUES ('Default Class', 'Migrated from existing modules', NULL);

-- UPDATE modules SET class_id = 1 WHERE class_id IS NULL;

-- Note: After migration complete and all modules have class_id, you can make it NOT NULL:
-- ALTER TABLE modules ALTER COLUMN class_id SET NOT NULL; (SQLite doesn't support this - need to recreate table)
