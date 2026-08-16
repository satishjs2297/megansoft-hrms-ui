# Research: Angular 22 Modernization Strategy

## Decision: Adopt a phased modernization rather than a full rewrite

**Decision**: The application should move to the Angular 22 modern baseline incrementally, focusing on standalone components, inject-based dependencies, signal-friendly state boundaries, and controlled change detection. The initial lift should retain the existing business flows and APIs while improving maintainability and reducing unnecessary work.

**Rationale**: The project is already on Angular 22, but it still uses older component conventions and mostly classic RxJS-heavy patterns. A full rewrite would raise change risk without guaranteeing faster value. A phased implementation lets the team improve performance and code clarity while preserving login, assessment, resume, and reporting workflows.

**Alternatives considered**:
- Full zoneless migration in one pass: rejected because it is a wider framework-level change and would increase risk across app bootstrapping and existing patterns.
- Complete signal rewrite across all modules: rejected as too broad for the first phase; better applied to selected state-heavy screens and shared services.
- Direct adoption of every Angular 22 feature in one release: rejected because it would mix incompatible patterns and obscure the business value of the change.

## Decision: Prefer standalone components and inject-based composition for new and refactored code

**Decision**: New or refactored screens should use standalone components, local imports, and inject-based services where the code is not already committed to constructor injection.

**Rationale**: This reduces boilerplate, improves template clarity, and aligns with Angular’s current preferred composition model. It also enables easier extraction of smaller, more testable units.

**Alternatives considered**:
- Keeping NgModules for all new work: rejected because it adds complexity and moves the app further from Angular’s current preferred structure.
- Converting the entire project in a single sweep: rejected because the feature is intentionally incremental and should preserve stability.

## Decision: Use OnPush and signals selectively, not universally

**Decision**: The most state-heavy and frequently updated screens should adopt `ChangeDetectionStrategy.OnPush` and signal-based state boundaries, while simpler templates remain in a low-risk configuration.

**Rationale**: The app has several data-driven flows and repeated UI updates. Signals and OnPush are especially beneficial when data changes frequently or when derived values are recomputed often. Applying them selectively reduces render churn without forcing the whole app into a single pattern too early.

**Alternatives considered**:
- Enabling OnPush everywhere at once: rejected due to hidden change detection issues and inconsistent state updates.
- Replacing all state with signals immediately: rejected because some service and form patterns are still naturally RxJS-driven and should be migrated only where the benefits are clear.

## Decision: Use resource-oriented async patterns only for the highest-value screens

**Decision**: The team should adopt resource-oriented loading patterns only for screens or flows where strong async lifecycle benefits are visible and the data model is stable. Other flows may continue with RxJS or custom loading state patterns until migration payoff is clear.

**Rationale**: The project already uses a loading service and REST APIs with predictable request lifecycles. A full move to every async API shape is unnecessary. The value is highest where data-fetch state is more complex or reused across multiple components.

**Alternatives considered**:
- Replacing all async data flow with resource APIs: rejected because this would add migration complexity.
- Leaving all async flows as-is: rejected because it misses a clear win on performance and clarity.

## Decision: Add Vite and Vitest as a faster local dev and quality workflow

**Decision**: The project should adopt a modern frontend workflow that emphasizes fast feedback, local iteration, and a more maintainable test pipeline via Vite and Vitest.

**Rationale**: The app already has a small but active UI and multiple business flows. Faster rebuilds and better validation reduce time-to-feedback and help teams catch regression risk earlier. This aligns directly with the feature’s productivity and performance goals.

**Alternatives considered**:
- Keeping only Angular CLI build/test tooling: rejected because it does not materially improve iteration speed or test ergonomics.
- Introducing a heavier monorepo or dev tooling change: rejected because the current project is a single frontend application and does not need that level of complexity.

## Decision: Keep backend contracts stable and focus on client-side modernization first

**Decision**: Preserve the existing API response shapes and auth flow for assessment, resume, and login while refactoring the client code to match modern Angular patterns.

**Rationale**: The business flows already work. Modernization should improve UI performance and maintainability without forcing backend changes. This keeps the migration incremental and lowers business risk.

**Alternatives considered**:
- Coupling the client refactor to API redesign: rejected because it broadens scope beyond the frontend modernization objective.
- Replacing the auth flow with a new architecture in the first phase: rejected because it is outside the immediate feature need and would increase risk.

## Open questions resolved from the feature context

- The project is a single Angular frontend web app with a browser-based user experience and an existing authenticated service model.
- The priority is modernization, not a rewrite of the backend or business logic.
- The app benefits most from a staged adoption of best practices rather than a single all-at-once migration.
- Vite and Vitest are included as a dev workflow improvement, not as a replacement for the Angular runtime itself.
