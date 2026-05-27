# Feature Spec: Zustand Draft Composer

## User Outcome

Users can draft a long-form post, leave the screen, and resume later without losing unsent work.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- editing
- autosaving
- saved locally
- publish pending
- publish error

## Navigation Impact

- Adds route: `/compose`
- Redirect behavior: return to feed after publish success

## Data Contract

- `POST /posts`
- Local draft persistence

## State and Data Flow

- State framework: Zustand store for draft composition state
- State ownership: the compose store owns draft fields and attachments, server state owns publish responses, and screen-local state owns keyboard-only UI toggles
- Mutation boundaries: updates happen through named Zustand actions; components do not mutate draft objects directly
- Persistence and hydration: draft text and attachment references persist locally and hydrate on screen mount; auth and media tokens do not persist in the store
- Selectors and derivations: selectors derive character count, dirty status, publish eligibility, and attachment upload readiness
- Async flow and side effects: user edits -> debounced local persistence -> publish action uploads attachments -> submit post -> clear persisted draft
- Rollback or conflict handling: failed publish preserves the local draft and resets publish-pending flags
- Logging and observability: analytics log draft lifecycle events without raw draft text or attachment URLs
- Security constraints: never log draft body, private media URLs, access tokens, or author identifiers outside approved telemetry fields

## Storage

- Local storage: draft content and attachment references
- Secure storage: none
- Cache invalidation: refresh feed after publish success
- Data that must never be stored: auth tokens, signed upload URLs, sensitive personal content outside the draft itself

## Tests Required

- Unit: draft selectors and persistence actions
- Integration: autosave and hydration behavior
- E2E: draft recovery after app restart
- Security: verify logs redact draft content

## Acceptance Criteria

- [ ] Drafts survive app restarts until publish succeeds or the user discards them.
- [ ] Publishing clears local draft state exactly once.
- [ ] Draft content is not leaked through logs or telemetry.
