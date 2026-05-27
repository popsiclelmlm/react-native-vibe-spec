# Feature Spec: Redux Async Permission Gate

## User Outcome

Users see the correct permission-gated screen before entering a protected camera flow, with clear retry behavior when the permission status fetch fails.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- checking permission
- permission granted
- permission denied
- request in progress
- request failed

## Navigation Impact

- Updates route guard behavior for `/capture`
- Redirect behavior: denied users stay on the education screen until they retry or leave
- Deep link behavior: `/capture` links pause on the permission gate before camera mount

## Data Contract

- Native permission status read plus local Redux action flow
- Request shape: `CAMERA_PERMISSION_REQUESTED`
- Response shape: `CAMERA_PERMISSION_RESOLVED` with status and timestamp
- Error shape: native permission bridge failure or unsupported capability

## State and Data Flow

- State library or framework: Redux with handwritten reducers and thunk middleware
- State ownership by layer: permission reducer owns gate status; camera screen reads selectors; native module result stays at the permission boundary
- Mutation boundaries: state changes happen through dispatched actions only; thunks orchestrate native permission checks and request retries
- Persistence policy: permission status remains in memory only and is recomputed on app foreground
- Selectors or derivations: `selectCanEnterCamera`, `selectPermissionStatus`, `selectPermissionError`
- Async flow and cancellation: permission check runs before route entry; stale responses after screen exit are ignored by request id
- Optimistic updates and rollback: request state shows pending immediately and rolls back to denied or failed if the native request rejects
- Logging and redaction constraints: logs include status transitions and request ids only, never media metadata or user identifiers
- Security constraints: permission state must not be used to infer unrelated device capabilities or persisted to general storage

## Storage

- Local storage: none
- Secure storage: none
- Cache invalidation: recompute permission state when app foregrounds or system settings change
- Data that must never be stored: camera output, device identifiers, raw native error payloads

## Permissions

- Required permissions: camera
- Permission denial behavior: show education copy, retry action, and route fallback without auto-looping prompts

## Tests Required

- Unit: reducer transitions and permission selectors
- Integration: thunk success, denial, bridge failure, and stale response ignore path
- E2E: deep link into `/capture` with denied then granted permission
- Accessibility: permission explanation and retry controls are announced correctly
- Security: logs redact native payload details and no permission state is persisted

## Acceptance Criteria

- [ ] Protected camera routes never mount the camera before the gate resolves.
- [ ] Permission retry handles denial and native bridge failure without duplicate prompts.
- [ ] Logs and stored data exclude camera-related sensitive details.
