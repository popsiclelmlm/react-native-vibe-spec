# Security

Security guidance in this repository has two layers:

- Project security for this CLI and package workspace
- React Native app security rules exposed through `rules/security.md`

## Repository Rules

- Do not commit real secrets or tokens.
- Keep secret detection conservative and explain false positives.
- Treat non-local cleartext HTTP endpoints as security findings in `rnvibe check`.
- Keep security guidance explicit about bundled secrets, token storage, logging, permissions, and network boundaries.
- Do not claim the CLI is a complete mobile security scanner.
- Treat `rnvibe check` as a readiness signal, not a formal audit.

## React Native Rules

See `rules/security.md`.
