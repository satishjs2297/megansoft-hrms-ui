# Implementation Plan: Angular Modernization and Performance Optimization

**Branch**: `001-angular-modernization` | **Date**: 2026-08-16 | **Spec**: [specs/001-angular-modernization/spec.md](specs/001-angular-modernization/spec.md)

**Input**: Feature specification from [specs/001-angular-modernization/spec.md](specs/001-angular-modernization/spec.md)

## Summary

This feature modernizes the Angular 22 frontend by adopting modern Angular patterns where they provide clear performance and maintainability value: standalone components, inject-based dependencies, signal-aware state boundaries, controlled change detection, and more composable async data handling. The plan also includes the fast local developer workflow introduced by Vite and Vitest so the team can iterate faster while preserving the HRMS app’s existing workflows for login, candidate assessment, resume generation, and reporting.

## Technical Context

**Language/Version**: TypeScript with Angular 22.1.x; application uses Angular CLI and Angular Material

**Primary Dependencies**: Angular Core, Router, Forms, HttpClient, Angular Material, RxJS, TypeScript

**Storage**: Browser session/local storage for auth state and current application session data; backend APIs remain the source of truth for business records

**Testing**: Planned Vitest-based validation workflow, with component and regression checks added to support the modernization phase

**Target Platform**: Browser-based HRMS frontend deployed in a standard web environment

**Project Type**: Single-application frontend web app

**Performance Goals**: Reduced unnecessary re-renders, faster local iteration, smoother UI interaction in assessment and reporting flows, lower overhead in data-heavy screens

**Constraints**: Must preserve existing business workflows; no broad backend rewrite; incremental migration prioritized over all-at-once refactor; keep auth and API contracts stable for compatibility

**Scale/Scope**: Small-to-medium Angular app with several feature screens and shared service logic; modernization limited to frontend code quality, performance, and workflow efficiency

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project does not currently define a functional constitution file beyond the generated spec workflow. Based on the feature goals and the repository structure, the plan passes the core governance check because it:

- keeps the change incremental and low-risk,
- avoids a full rewrite of the backend or business logic,
- focuses on measurable benefits for performance, maintainability, and team productivity,
- preserves the current business flows for login, assessment, resume, and reports.

No unresolved design violations are present that require a complexity exception.

## Project Structure

### Documentation (this feature)

```text
specs/001-angular-modernization/
├── plan.md              # This file
├── research.md          # Research and decision log
├── data-model.md        # Domain state model
├── quickstart.md        # Validation walkthrough
├── contracts/           # API contract notes
├── checklist/
│   └── requirements.md
└── spec.md              # Feature specification
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.routes.ts
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.interceptor.ts
│   │   ├── models/
│   │   │   ├── assessment.model.ts
│   │   │   └── resume.model.ts
│   │   └── services/
│   │       ├── api-loading.interceptor.ts
│   │       ├── api-loading.service.ts
│   │       ├── assessment.service.ts
│   │       ├── report.service.ts
│   │       └── resume.service.ts
│   └── features/
│       ├── candidate-assessment/
│       ├── login/
│       ├── reports/
│       └── resume-generator/
├── environments/
├── main.ts
├── styles.scss
└── index.html
```

**Structure Decision**: This is a single Angular frontend application, not a multi-project monorepo. Modernization should be applied in-place to the existing app and feature folders while preserving the current route structure and service contracts.

## Phase 0 Findings

The research phase resolved the major design decisions:

- A phased modernization is preferable to a full rewrite.
- Standalone components and inject-based dependencies are the preferred direction for new or refactored Angular code.
- Signals and OnPush should be adopted selectively around state-heavy screens rather than across the whole app in one step.
- Resource-oriented async patterns are valuable only for the highest-value screens and should not be forced across the entire app prematurely.
- A faster local developer workflow using Vite and Vitest should be adopted to improve build/test speed and fast feedback.
- Backend contracts should remain stable while the UI is refactored for performance and maintainability.

## Phase 1 Design

### 1. Architecture direction

The modernization will focus on the following client-side patterns:

- Transition new classes and feature components to standalone-first composition.
- Use `inject()` for direct dependency access in new services, guards, and lightweight composition points where it reduces boilerplate.
- Prefer `ChangeDetectionStrategy.OnPush` in feature screens that update frequently or depend on derived state.
- Use signals or signal-like state boundaries for local screen state where value changes are frequent and computationally cheap to derive.
- Keep RxJS usage where it remains the clearest model for request orchestration and complex async flows.

### 2. Screen-level refactor plan

**Login and app shell**
- Preserve current auth flow and route guards.
- Refactor shell state to be clearer and less dependent on repeated lifecycle work.
- Keep permission checking and default route behavior stable while reducing redundant calculation.

**Candidate assessment**
- Simplify form and rating state management to prevent broader view re-renders.
- Convert state-heavy logic to more precise local state boundaries and derived values.
- Keep the assessment API contract unchanged while optimizing component responsiveness.

**Resume generator**
- Isolate async file upload and generation states more cleanly.
- Reduce repeated work in data parsing and template selection flows.
- Keep the current API contract and output behavior unchanged.

**Reports**
- Clarify list/filter refresh logic and reduce state churn during route and filter changes.
- Align aggregation and data refresh with a more predictable state model.

### 3. Tooling improvements

- Add a modern frontend build/test workflow centered on Vite and Vitest for faster feedback.
- Keep the Angular runtime and webpack-based build compatibility while improving local developer experience.
- Add focused validation checks that confirm route navigation, auth flows, and commonly used data interactions remain reliable.

### 4. Risks and mitigations

- Risk: broad UI refactors introduce change-detection regressions.
  - Mitigation: adopt OnPush and state boundaries incrementally, validating the highest-risk screens first.

- Risk: signals are adopted too early in complex form logic.
  - Mitigation: begin with local screen state and derived values rather than rewriting all shared services.

- Risk: tooling changes reduce compatibility with the current Angular workflow.
  - Mitigation: keep the Angular app stable while introducing Vite and Vitest as additive productivity improvements.

## Outputs Generated

- [specs/001-angular-modernization/research.md](specs/001-angular-modernization/research.md)
- [specs/001-angular-modernization/data-model.md](specs/001-angular-modernization/data-model.md)
- [specs/001-angular-modernization/quickstart.md](specs/001-angular-modernization/quickstart.md)
- [specs/001-angular-modernization/contracts/http-contracts.md](specs/001-angular-modernization/contracts/http-contracts.md)

## Complexity Tracking

No material complexity exceptions are required for this feature. The project remains a single frontend application, and the proposed modernization stays within the existing app boundaries.
