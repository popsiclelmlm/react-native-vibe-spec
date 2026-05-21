# API Rules

## Required For Each Data Contract

- Method and path
- Request shape
- Response shape
- Error shape
- Authentication behavior
- Retry behavior
- Offline behavior
- Cache behavior

## Rules

- Keep API DTOs explicit and typed.
- Do not leak raw transport errors directly into UI copy.
- Do not log full request or response payloads when they may contain PII.
- Authentication and refresh behavior must be centralized.
- Mock data must be clearly separated from production code.
