---
trigger: model_decision
description: Guideline for the project tech stack
---

# Technology Stack

- **Styling**: Use Tailwind CSS. For conditional classes, use the `cn` utility (combined `clsx` and `tailwind-merge`).
- **Icons**: Use `lucide-react`. Check existing components for icon patterns before adding new ones.
- **UI Components**: Check `components/ui/` for Shadcn components before building custom ones. Follow Shadcn patterns for new components.
- **Backend/DB**: Use Supabase for all database interactions. Leverage the generated types if available.
- **Typography**: Adhere to the Geist Mono font configuration in the project.