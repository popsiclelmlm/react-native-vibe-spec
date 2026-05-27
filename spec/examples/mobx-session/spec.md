# Feature Spec: MobX Session and Profile Bootstrap

## User Outcome

Users see their profile shell render as soon as cached session state is valid, while background profile refresh failures stay recoverable without forcing a full sign-out.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- bootstrapping
- ready
- refreshing
- degraded
- signed-out
- offline

## Navigation Impact

- Adds route: `/profile`
- Updates route: root navigator waits for bootstrap store readiness
- Redirect behavior: unrecoverable auth failure redirects to `/auth/login`
- Deep link behavior: profile deep links wait for bootstrap then reuse the same observable session source

## Data Contract

- Endpoint or local source: secure session snapshot plus `GET /me`
- Request shape: session token presented by authenticated client
- Response shape: user profile summary, feature flags, session expiry metadata
- Error shape: unauthorized, maintenance, network timeout

## State and Data Flow

- Primary framework: MobX with observable session store
- Server state owner: profile repository owns remote `/me` fetch lifecycle and retry windows
- Client state owner: `sessionStore` owns bootstrap status, auth guard state, and recoverable degradation banner
- Form state owner: profile edit form store owns field dirtiness and submit lifecycle
- Mutation boundaries: only MobX actions and flows inside the store may update observables; view components read computed state only
- Selectors or derivations: `isReady`, `profileDisplayName`, and `shouldPromptRelogin` are computed values exported from the store
- Async flow: bootstrap reads secure snapshot, enters refresh flow, publishes profile state, and degrades gracefully on transient fetch failure
- Optimistic updates and rollback: profile edits update local computed shell only after action success; failed refresh restores previous profile snapshot and banner state
- Logging and security constraints: never log observable snapshots containing tokens or profile payloads; reaction logging must be field-level and redacted

## Storage

- Local storage: last non-sensitive profile timestamp
- Secure storage: session token and expiry metadata
- Cache invalidation: clear observable session state and repository cache on logout or 401
- Data that must never be stored: raw access token in async storage, profile API payload dumps, full auth headers

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: computed selectors, action guards, and flow rollback
- Integration: bootstrap success, degraded refresh, and forced sign-out
- E2E: cold start into profile shell with recoverable refresh failure
- Accessibility: degraded banner and sign-out path are announced clearly
- Security: secure storage and logging redaction rules are enforced

## Acceptance Criteria

- [ ] Works on iOS.
- [ ] Works on Android.
- [ ] Handles offline and retry states.
- [ ] Does not log PII, tokens, secrets, or sensitive payloads.
- [ ] Relevant checks pass.
