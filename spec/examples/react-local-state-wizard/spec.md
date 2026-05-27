# Feature Spec: React Local State Onboarding Wizard

## User Outcome

Users move through a short onboarding wizard, review their choices, and finish setup without cross-screen state leaks or premature persistence.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- step editing
- validating input
- review summary
- submit pending
- submit failed

## Navigation Impact

- Adds route: `/onboarding/wizard`
- Redirect behavior: incomplete required fields block forward navigation
- Deep link behavior: direct deep links open the first incomplete step

## Data Contract

- Local draft state plus `POST /onboarding/complete`
- Request shape: selected preferences and profile setup fields
- Response shape: completion flag and next-route metadata
- Error shape: validation failure, transient network failure

## State and Data Flow

- State library or framework: React local state with `useReducer`
- State ownership by layer: wizard screen owns the draft reducer; step components receive derived props only
- Mutation boundaries: draft updates happen through reducer actions dispatched by step components; shared app state is unchanged until submit succeeds
- Persistence policy: draft remains in memory only; partial progress is discarded when the flow is abandoned
- Selectors or derivations: derived step validity, completion percentage, and review summary come from reducer state
- Async flow and cancellation: submit starts only from the review step; leaving the screen cancels the in-flight completion request
- Optimistic updates and rollback: optimistic completion UI rolls back to the review step if the request fails
- Logging and redaction constraints: analytics records step index and completion status only, never raw profile values
- Security constraints: local reducer state must not be mirrored into global debug stores or persistent caches

## Storage

- Local storage: none
- Secure storage: none
- Cache invalidation: invalidate onboarding-gated bootstrap query after completion
- Data that must never be stored: raw onboarding answers outside in-memory reducer state

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: reducer transitions and derived step validity
- Integration: blocked navigation, failed submit recovery, abandon flow reset
- E2E: complete wizard across multiple steps
- Accessibility: step progress and validation errors are announced
- Security: analytics payload excludes raw answer values

## Acceptance Criteria

- [ ] Wizard state stays scoped to the onboarding flow until submit succeeds.
- [ ] Back and next navigation preserve valid step data without mutating global profile state.
- [ ] Failed submit returns the user to the review step without persisting raw answers.
