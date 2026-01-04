---
trigger: always_on
---

# Package Management

- **ALWAYS** use `pnpm` for all package management commands (install, run, add, remove, dev, build). 
- **NEVER** use `npm` or `yarn` unless explicitly requested by the user for a migration task.
- If a lockfile other than `pnpm-lock.yaml` is found, alert the user but do not use it to install packages.
