# Feature Spec: Redux Toolkit Auth Session Refresh

## User Outcome

Signed-in users keep their session during normal app use, and expired sessions recover or sign out cleanly without exposing token details.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- authenticated
- refreshing session
- refresh failed
- signed out
- offline refresh deferred

## Navigation Impact

- Updates route guard behavior for protected routes
- Redirect behavior: expired unrecoverable sessions go to `/auth/login`
- Deep link behavior: protected deep links wait for refresh completion before routing

## Data Contract

- `POST /auth/refresh`
- Request shape: secure refresh token only
- Response shape: access token, refresh token rotation metadata, expiry
- Error shape: unauthorized, revoked, transient network failure

## Network Boundaries

- Allowed hosts: configured auth API host
- TLS required: yes
- Development-only cleartext hosts: localhost and Android emulator loopback only
- Disallowed schemes or domains: production cleartext HTTP and unapproved auth domains

## State and Data Flow

- State library or framework: Redux Toolkit with RTK Query
- State ownership by layer: auth slice owns session flags; RTK Query owns refresh request lifecycle; screens read selectors only
- Mutation boundaries: session updates happen through slice reducers and RTK Query lifecycle handlers only
- Persistence policy: refresh token metadata only in approved secure storage; access token stays in memory
- Selectors or derivations: `selectIsAuthenticated`, `selectSessionExpiry`, `selectRefreshPending`
- Async flow and cancellation: route guard triggers refresh once; duplicate refreshes are deduped; sign-out cancels in-flight protected requests
- Optimistic updates and rollback: temporary authenticated UI rolls back to signed-out state on refresh failure
- Logging and redaction constraints: auth middleware must redact token fields and auth headers from logs
- Security constraints: no token payloads in Redux devtools snapshots in production builds

## Storage

- Local storage: none
- Secure storage: rotated refresh token metadata
- Cache invalidation: clear protected RTK Query caches on sign-out
- Data that must never be stored: access tokens, OTP codes, auth headers

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: auth selectors and reducer transitions
- Integration: refresh success, revoked session, offline retry path
- E2E: protected deep link while token is expired
- Accessibility: sign-out and retry messaging remains screen-reader readable
- Security: redaction coverage for auth logs and Redux snapshot policy

## Acceptance Criteria

- [ ] Refresh flow does not trigger duplicate network calls for one session expiry event.
- [ ] Failed refresh clears protected caches and returns the user to login.
- [ ] No auth token values appear in logs, persisted state, or production devtools output.
