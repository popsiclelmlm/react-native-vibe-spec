# Performance Rules

## Required Considerations

- Startup cost
- Bundle size
- List rendering
- Image loading and caching
- Re-render behavior
- Native bridge or JSI cost
- Offline cache size

## Rules

- Use virtualized lists for unbounded lists.
- Images must have a loading and failure strategy.
- Avoid adding heavy dependencies for narrow use cases.
- Memoization should solve measured or obvious render churn, not hide unclear data flow.
- Performance-sensitive changes need before/after notes.
