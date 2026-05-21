# Navigation Rules

## Required Decisions

- Router library
- Route naming convention
- Auth guard strategy
- Deep-link scheme
- Not-found behavior
- Modal and nested navigator strategy

## Rules

- Every new route must be named in the feature spec.
- Deep links must include success, failure, and unauthenticated behavior.
- Auth redirects must avoid loops.
- Navigation params must be typed.
- Screens must handle loading, error, empty, and permission-denied states where relevant.
- Do not mix routing systems without an explicit migration plan.
