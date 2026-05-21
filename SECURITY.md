# Security Policy

## Reporting

Please report security issues privately through GitHub security advisories when this repository is published. Do not open a public issue for vulnerabilities that expose secrets, tokens, or exploitable project behavior.

## Scope

Security guidance in this project focuses on React Native app development with AI agents:

- Secret handling
- Token storage
- Public environment variables
- PII logging
- Mobile permissions
- Network boundaries
- Release and rollback safety
- Agent-generated code review gates

## Baseline Rule

Anything bundled into a mobile app can be inspected. Do not put private secrets, privileged API keys, refresh tokens, or signing material in app source code or public environment variables.
