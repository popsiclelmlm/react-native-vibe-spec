# Feature Spec: Expo Router Auth Login

## User Outcome

Users can sign in with a phone number and one-time code, then return to the protected home route.

## Platforms

- iOS: required
- Android: required
- Web: optional

## UX States

- idle
- validating phone
- sending code
- verifying code
- authenticated
- error
- offline

## Navigation Impact

- Adds route: `/auth/login`
- Redirect after success: `/home`
- Deep link behavior: `app://login?phone=`

## Data Contract

- `POST /auth/otp`
- `POST /auth/verify`
- `POST /auth/refresh`

## Network Boundaries

- Allowed hosts: configured auth API host
- TLS required: yes
- Development-only cleartext hosts: localhost and Android emulator loopback only
- Disallowed schemes or domains: production cleartext HTTP and unapproved auth domains

## Storage

- Access token: memory only
- Refresh token: secure storage
- Never store one-time codes or privileged API keys in the bundle

## Tests Required

- Unit: phone validation
- Integration: OTP success and failure
- E2E: login happy path
- Security: no sensitive auth values in logs

## Acceptance Criteria

- [ ] Works on iOS and Android.
- [ ] Handles offline failure gracefully.
- [ ] Does not log PII, tokens, or OTP codes.
- [ ] All relevant checks pass.
