# Feature Spec: Context + Query Profile Editing

## User Outcome

Users can update profile details with clear ownership between server-backed profile data and local editing/session state.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- loading
- idle
- editing
- saving
- success
- error
- offline

## Navigation Impact

- Adds route: `/settings/profile`
- Updates route: settings stack
- Redirect behavior: session expiry returns users to login
- Deep link behavior: profile links require an authenticated session provider

## Data Contract

- `GET /me`
- `PATCH /me`

## Storage

- Local storage: none
- Secure storage: session token if not already owned by auth feature
- Cache invalidation: invalidate `me` query after successful save
- Data that must never be stored: raw auth headers, secrets, deleted profile fields

## State and Data Flow

- Primary client state pattern: React Context for session + TanStack Query for profile data + local form state
- State owner: session provider owns auth context; query cache owns profile resource; form hook owns dirty field state
- Mutation boundary: save action is the only write path from form state into the profile mutation
- Persistence boundary: session token storage is delegated to auth; profile edits stay in memory until submit succeeds
- Selectors and derivations: derived values expose dirty state, save eligibility, and stale-session warnings
- Async flow: load profile query -> edit local form state -> submit mutation -> invalidate/refetch profile
- Rollback and recovery: failed save preserves dirty form values and restores last server snapshot for compare/retry
- Logging and redaction: analytics captures save success/failure and changed-field count only
- Security constraints: context never exposes tokens to presentation components, logs redact identifiers, and only approved fields reach the mutation

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: derivations for dirty/save state
- Integration: query hydration, optimistic save disabled, retry on failure
- E2E: edit profile, background app, resume, and submit
- Accessibility: form labels, validation messages, and save state announcements
- Security: mutation payload filtering and log redaction

## Acceptance Criteria

- [ ] Works on iOS.
- [ ] Works on Android.
- [ ] Handles offline and retry states.
- [ ] Does not log PII, tokens, secrets, or sensitive payloads.
- [ ] Relevant checks pass.
