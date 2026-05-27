# Feature Spec: MobX Checkout Draft

## User Outcome

Users can build a checkout draft, recover from pricing errors, and complete payment without duplicate charges.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- editing
- pricing
- authorizing
- success
- error
- offline

## Navigation Impact

- Adds route: `/checkout`
- Updates route: order confirmation route
- Redirect behavior: completed checkout redirects to confirmation
- Deep link behavior: cart deep links restore the last valid checkout draft

## Data Contract

- `POST /checkout/price`
- `POST /checkout/authorize`
- `POST /checkout/confirm`

## Storage

- Local storage: non-sensitive checkout draft metadata only
- Secure storage: payment session token if platform SDK requires handoff
- Cache invalidation: invalidate cart and order history after confirmation
- Data that must never be stored: PAN, CVV, raw payment tokens

## State and Data Flow

- Primary client state pattern: MobX domain store + view-model store
- State owner: checkout store owns cart draft and pricing state; payment SDK owns sensitive payment instruments
- Mutation boundary: observable writes happen only in MobX actions and flows
- Persistence boundary: recoverable draft fields persist; payment credentials never persist
- Selectors and derivations: computed values expose total price, submit readiness, and retry eligibility
- Async flow: edit draft -> price request -> authorize payment -> confirm order -> invalidate cart
- Rollback and recovery: failed authorization resets transient SDK state and preserves editable draft fields
- Logging and redaction: pricing request ids are safe to log; payment tokens, card metadata, and addresses are redacted
- Security constraints: PCI-sensitive fields stay inside payment SDK primitives, secure storage is limited, and production logs are redacted

## Permissions

- Required permissions: none unless wallet SDK is enabled
- Permission denial behavior: wallet flow falls back to manual card entry if supported

## Tests Required

- Unit: computed totals, action guards, retry state
- Integration: pricing mismatch, authorization failure, confirmation success
- E2E: successful checkout and duplicate-submit prevention
- Accessibility: error summaries and confirmation state announcements
- Security: no payment secrets in persistence, analytics, or logs

## Acceptance Criteria

- [ ] Works on iOS.
- [ ] Works on Android.
- [ ] Handles offline and retry states.
- [ ] Does not log PII, tokens, secrets, or sensitive payloads.
- [ ] Relevant checks pass.
