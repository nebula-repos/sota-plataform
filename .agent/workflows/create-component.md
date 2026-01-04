---
description: Create a new React component
---

1. Ask the user for the name of the component (e.g., `MyButton`) if not provided.
2. Ask for the destination directory (default to `components/` if not specified).
3. Create the component file (e.g., `components/MyButton.tsx`) with the following structure:
   - Imports (React, `cn` utility, types).
   - TypeScript Interface for Props.
   - Functional component export.
   - Basic Tailwind styling.
4. If the component requires interactivity (hooks, event listeners), ensure `"use client"` is added at the top.
5. If new dependencies are needed, install them using `pnpm`.
