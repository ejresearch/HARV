# Legacy Code Archive

This directory contains deprecated code that has been moved out of the main application.

## Files

### `legacy-functions.js`
Contains old memory functions and archive section code that was replaced by the new 4-Layer Memory Inspector.

**Deprecated features:**
- Old memory summaries view (replaced by Memory Inspector)
- Progress section (migrated to Memory Inspector Layer 4)
- Table View section (migrated to Memory Inspector)
- Archive section (functionality moved to Classes & Modules)

## Why moved?

These sections were consolidated into the new **4-Layer Memory Inspector** which provides:
- Hierarchical drill-down (Class → Module → Student)
- Real-time assembled prompt preview
- Organized layer-by-layer data viewing
- Search functionality

The legacy code is kept here for reference only and is not loaded in the main application.
