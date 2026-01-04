---
trigger: always_on
---

# Code Style

- **Components**: Use Functional Components with TypeScript.
- **Typing**: Use strict typing. Avoid `any` at all costs. Leverage `interface` or `type` for all props and data structures.
- **Directives**: Use `"use client"` only when necessary (e.g., when using React hooks like `useState`, `useEffect`, or event handlers).
- **Naming**: Use PascalCase for component files and functions. Use camelCase for utilities and variables.
- **Organization**: Keep components small and focused. Extract logic into custom hooks if it becomes complex.
