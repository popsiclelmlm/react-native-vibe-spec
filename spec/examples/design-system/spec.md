# Feature Spec: Design Token Adoption

## User Outcome

Product screens use shared tokens for color, spacing, typography, radius, and motion so AI-generated UI stays consistent.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- default
- dark mode
- high contrast
- reduced motion

## Navigation Impact

- No route changes

## Data Contract

- No API changes

## Storage

- Theme preference: approved local storage
- No secure storage

## Tests Required

- Unit: token mapping
- Integration: theme switch
- Accessibility: contrast and reduced motion review

## Acceptance Criteria

- [ ] New components use tokens instead of one-off values.
- [ ] Dark mode behavior is documented.
- [ ] Accessibility states remain readable.
