# Security Rules

## Required Coverage

- Secrets
- Token storage
- PII logging
- Authentication
- Network requests and boundaries
- Mobile permissions
- Platform integrations

## Rules

- Never put private secrets, privileged API keys, refresh tokens, signing keys, or certificates in bundled app code or assets.
- Treat public environment variables as client-visible data.
- Store sensitive user tokens only in the approved secure storage mechanism.
- Do not log tokens, PII, one-time codes, headers, or sensitive payloads.
- Request the minimum mobile permissions needed for the feature.
- Document permission denial behavior.
- Production network requests must use TLS and target documented allowed hosts.
- Cleartext HTTP is limited to documented local development endpoints such as localhost or Android emulator loopback.
- Feature specs must name blocked schemes, disallowed domains, proxy boundaries, or third-party network surfaces when relevant.
- Security-sensitive PRs need explicit review notes.

## Recommended Reading

- React Native security documentation: https://reactnative.dev/docs/security
- OWASP MASVS: https://mas.owasp.org/MASVS/
