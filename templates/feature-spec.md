# Feature Spec: <feature-name>

## User Outcome

Describe the user-visible outcome in one or two sentences.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- loading
- success
- error
- offline

## Navigation Impact

- Adds route:
- Updates route:
- Redirect behavior:
- Deep link behavior:

## Data Contract

- Endpoint or local source:
- Request shape:
- Response shape:
- Error shape:

## State and Data Flow

- State library or framework:
- State ownership by layer:
- Mutation boundaries:
- Persistence policy:
- Selectors or derivations:
- Async flow and cancellation:
- Optimistic updates and rollback:
- Logging and redaction constraints:
- Security constraints:

## Storage

- Local storage:
- Secure storage:
- Cache invalidation:
- Data that must never be stored:

## Permissions

- Required permissions:
- Permission denial behavior:

## Tests Required

- Unit:
- Integration:
- E2E:
- Accessibility:
- Security:

## Acceptance Criteria

- [ ] Works on iOS.
- [ ] Works on Android.
- [ ] Handles offline and retry states.
- [ ] Does not log PII, tokens, secrets, or sensitive payloads.
- [ ] Relevant checks pass.
