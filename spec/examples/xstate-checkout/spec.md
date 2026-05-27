# Feature Spec: XState Checkout Submission Flow

## User Outcome

Users can submit checkout details through a multi-step flow that handles retries, payment confirmation, and explicit failure recovery without ambiguous UI state.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- entering details
- validating
- submitting payment
- awaiting confirmation
- recoverable failure
- completed

## Navigation Impact

- Updates route: `/checkout`
- Redirect behavior: completed checkout transitions to `/receipt/:orderId`
- Deep link behavior: payment-confirmation deep links resume the waiting state before navigating

## Data Contract

- `POST /checkout/submit`
- `POST /checkout/confirm`
- Response shape: order id, payment state, retry token, receipt metadata
- Error shape: validation error, processor timeout, payment declined

## State and Data Flow

- State library or framework: XState
- State ownership by layer: checkout state machine owns step progression, payment context, and retry tokens; field-level input state stays local until submitted to machine events
- Mutation boundaries: screen components dispatch machine events only; context changes happen in machine actions and guarded transitions
- Persistence policy: in-progress machine snapshot may persist locally for recovery; raw payment inputs remain outside persisted context
- Selectors or derivations: selectors derive current CTA label, retry eligibility, and receipt visibility from machine state tags and context
- Async flow and cancellation: invoked payment services cancel when the user abandons checkout; confirmation actor resumes from deep link retry token
- Optimistic updates and rollback: optimistic transition to awaiting confirmation rolls back to recoverable failure when confirm service times out
- Logging and redaction constraints: transition logs record state value, event type, and retry token hash only
- Security constraints: machine context excludes PAN, CVC, and full billing payloads from persistence, logs, and crash breadcrumbs

## Storage

- Local storage: serialized machine snapshot without raw payment fields
- Secure storage: encrypted retry token if required for payment resumption
- Cache invalidation: clear checkout snapshot after receipt fetch succeeds or user cancels flow
- Data that must never be stored: PAN, CVC, full billing payloads, payment processor secrets

## Permissions

- Required permissions: none
- Permission denial behavior: not applicable

## Tests Required

- Unit: machine guards, selectors, and action redaction helpers
- Integration: retry path, abandonment cancellation, deep link confirmation resume
- E2E: submit checkout, background app, resume, and finish receipt flow
- Accessibility: step changes and recoverable failure actions are announced
- Security: persisted machine snapshot and transition logs exclude payment secrets

## Acceptance Criteria

- [ ] Checkout UI stays aligned with machine state through success, retry, and timeout paths.
- [ ] Deep link confirmation resumes the correct machine state without duplicate charges.
- [ ] Persisted context and logs exclude raw payment data.
