# Testing Rules

## Required Test Layers

- Unit tests for pure validation, formatting, and state transitions
- Integration tests for API and storage behavior
- E2E tests for critical user flows
- Manual checks for platform-specific behavior
- Accessibility review for interactive flows

## Rules

- Test the behavior described in the feature spec.
- Avoid snapshot tests as the only coverage for important UI behavior.
- Mock network and storage through approved test helpers.
- Every bug fix should include a regression test when practical.
- High-risk release changes need a manual verification note.
