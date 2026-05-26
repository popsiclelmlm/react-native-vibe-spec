# Feature Spec: MobX Profile Editor Drafts

## User Outcome

Users can edit their profile in a staged draft, review unsaved changes, and either save or discard them without cross-screen drift.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- viewing profile
- editing draft
- saving
- save failed
- unsaved changes warning

## Navigation Impact

- Updates route: `/settings/profile`
- Redirect behavior: back navigation prompts when draft is dirty
- Deep link behavior: direct links open editor with current profile snapshot

## Data Contract

- `GET /profile`
- `PATCH /profile`
- Error shape: validation failure, auth failure, transient network failure

## State and Data Flow

- State library or framework: MobX
- State ownership by layer: profile store owns observable draft and server snapshot; form fields bind to observable draft only
- Mutation boundaries: mutations only inside MobX actions; reactions may trigger save reminders but not network writes
- Persistence policy: draft state remains in memory only unless explicit save-for-later support is added
- Selectors or derivations: computed values for `isDirty`, `canSubmit`, and changed field summary
- Async flow and cancellation: save action serializes requests; leaving screen during save keeps request alive and restores result on return
- Optimistic updates and rollback: optimistic success banner rolls back if save response fails validation
- Logging and redaction constraints: telemetry records changed field names, never raw field values
- Security constraints: personally identifiable profile fields never enter debug snapshots or breadcrumbs

## Storage

- Local storage: none by default
- Secure storage: none
- Cache invalidation: refresh profile query after successful save
- Data that must never be stored: raw profile payloads in diagnostics or drafts outside approved memory scope

## Permissions

- Required permissions: optional photo-library permission for avatar update
- Permission denial behavior: avatar picker remains disabled with fallback copy

## Tests Required

- Unit: computed values and draft action boundaries
- Integration: dirty-form navigation guard and failed save recovery
- E2E: edit profile, cancel, reopen, and save
- Accessibility: unsaved-change prompt and save errors are announced
- Security: telemetry and MobX debug output redact profile field values

## Acceptance Criteria

- [ ] Observable drafts do not leak into unrelated screens before save.
- [ ] Discard resets the draft to the last server snapshot.
- [ ] Telemetry and debug output avoid raw profile values.
