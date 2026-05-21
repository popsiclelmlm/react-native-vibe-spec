# Architecture Rules

## Required Decisions

Every project must document:

- Expo-first, bare React Native, or library/module target
- Directory layout
- Navigation choice
- State management boundaries
- API client ownership
- Storage and secure storage choices
- Test tools
- Release path

## Rules

- Do not introduce architectural dependencies without updating `docs/architecture.md`.
- Keep feature code grouped by domain or route, not by file type alone.
- Keep reusable UI primitives separate from product-specific screens.
- Keep API DTOs and domain models explicit.
- Platform-specific behavior must be visible through file naming or clear platform guards.
- Generated code must follow existing module boundaries.
