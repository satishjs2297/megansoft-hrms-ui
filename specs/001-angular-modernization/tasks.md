# Tasks: Angular Modernization and Performance Optimization

**Input**: Design documents from `/specs/001-angular-modernization/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the modernization baseline and local validation workflow before story delivery.

- [ ] T001 [P] Audit the current Angular 22 app baseline and record the modernization hotspots in src/app, src/environments, and package.json
- [ ] T002 [P] Add the Vite/Vitest-enabled frontend workflow and scripts in package.json and project-level configuration files
- [ ] T003 [P] Define a baseline modernization checklist and validation commands aligned with quickstart.md and the app’s current feature routes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared state and guard patterns that all modernized screens depend on.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

- [ ] T004 Establish the app-level loading and error-state contract in src/app/core/services/api-loading.service.ts and src/app/core/services/api-loading.interceptor.ts
- [ ] T005 [P] Stabilize the authentication baseline and route guards in src/app/core/auth/auth.service.ts and src/app/core/auth/auth.guard.ts
- [ ] T006 [P] Define the shared state boundaries for the shell and protected routes in src/app/app.component.ts and src/app/app.routes.ts
- [ ] T007 Confirm the existing API contracts remain compatible with the planned modernization in src/app/core/services/assessment.service.ts, src/app/core/services/resume.service.ts, and src/app/core/services/report.service.ts

---

## Phase 3: User Story 1 - Modern Angular application baseline for the HRMS UI (Priority: P1) 🎯 MVP

**Goal**: Lift the app to a modern Angular baseline without breaking route access or core business flows.

**Independent Test**: Login, assessment access, resume generation, and report navigation remain functional after refactor.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Refactor the root app shell to use a clearer, lower-churn state model in src/app/app.component.ts
- [ ] T009 [US1] Update route and navigation composition in src/app/app.routes.ts to keep the modernized structure consistent with protected access rules
- [ ] T010 [US1] Refresh auth flow and permission checks in src/app/core/auth/auth.service.ts to support the modernized route contract without changing business behavior
- [ ] T011 [US1] Confirm the app shell remains stable on login, redirect, and permission-driven navigation scenarios

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Performance-driven rendering and state handling (Priority: P1)

**Goal**: Reduce unnecessary UI work and improve responsiveness for interactive screens.

**Independent Test**: Candidate assessment interactions remain smooth and do not trigger broader re-renders than necessary.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Review and apply OnPush or equivalent controlled update strategy in src/app/features/candidate-assessment/candidate-assessment.component.ts
- [ ] T013 [US2] Split local form, rating, and derived UI state into more precise state boundaries in src/app/features/candidate-assessment/candidate-assessment.component.ts
- [ ] T014 [US2] Remove redundant unnecessary updates in the assessment component and related template markup in src/app/features/candidate-assessment/
- [ ] T015 [US2] Validate the assessment screen remains responsive during repeated skill selection, summary generation, and submission actions

**Checkpoint**: At this point, User Story 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Resource-efficient data loading and API usage (Priority: P2)

**Goal**: Reduce wasted requests and improve loading-state handling across shared services.

**Independent Test**: Resume generation, assessment creation, and report refresh flows show clear loading states without redundant network churn.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Review duplicate request and refresh logic in src/app/core/services/assessment.service.ts and src/app/core/services/resume.service.ts
- [ ] T017 [US3] Normalize request lifecycle handling and error messaging in src/app/core/services/assessment.service.ts, src/app/core/services/resume.service.ts, and src/app/core/services/report.service.ts
- [ ] T018 [US3] Connect the loading-state contract to the relevant UI screens through src/app/core/services/api-loading.service.ts and the app shell/state flow
- [ ] T019 [US3] Validate data-heavy flows for resume creation, assessment submission, and report refresh remain stable under repeated interaction

---

## Phase 6: User Story 4 - Faster local build and validation workflow (Priority: P2)

**Goal**: Improve dev iteration speed and introduce a faster validation pipeline.

**Independent Test**: Local build and validation commands can be run quickly and return actionable pass/fail feedback.

### Implementation for User Story 4

- [ ] T020 [P] [US4] Add Vite/Vitest-friendly build and validation commands in package.json and project configuration files
- [ ] T021 [US4] Add a minimal test harness for core Angular behaviors in a test directory or feature-level test files
- [ ] T022 [US4] Add a local regression validation path aligned with quickstart.md and the existing app workflows
- [ ] T023 [US4] Run the modernization validation workflow and confirm that build/test feedback is faster and reliable

---

## Phase 7: User Story 5 - Modern Angular control flow and productivity improvements (Priority: P2)

**Goal**: Adopt Angular 22 control-flow patterns and related quality-of-life improvements in the UI code.

**Independent Test**: Templates and component logic read clearly and remain stable under normal user actions.

### Implementation for User Story 5

- [ ] T024 [P] [US5] Review Angular template usage across app screens and identify upgrade candidates in src/app/features and src/app/app.component.html
- [ ] T025 [US5] Update template control-flow patterns in the affected feature templates to modern Angular conventions without altering business behavior
- [ ] T026 [US5] Introduce signal-friendly local state or derived values where the state is trackable and the gain is clear in the candidate assessment and app shell flows
- [ ] T027 [US5] Validate the upgraded templates and derived values still render correctly across login, assessment, resume, and report views

---

## Phase 8: User Story 6 - Maintainability and team productivity gains (Priority: P2)

**Goal**: Document and standardize the modernization patterns so the team can keep improving without drift.

**Independent Test**: New code follows shared conventions for state boundaries, dependency injection, and change-detection safety.

### Implementation for User Story 6

- [ ] T028 [P] [US6] Define the project’s modernization conventions for standalone components, inject usage, OnPush boundaries, and signal-based state in project documentation or README
- [ ] T029 [US6] Update shared guidance on how to structure new services and components in src/app/core and src/app/features
- [ ] T030 [US6] Review the feature set for consistency with the modernization guidance and resolve any pattern drift in src/app
- [ ] T031 [US6] Complete the final business regression review for the HRMS user journeys and sign off on the modernization baseline

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and cross-story validation.

- [ ] T032 [P] Run end-to-end validation against quickstart.md and confirm the app remains stable across login, assessment, resume, and report flows
- [ ] T033 [P] Fine-tune performance-related regressions and remove leftover duplication across shared service and component logic
- [ ] T034 Finalize migration notes for the Angular 22 modernization in README and feature documentation
- [ ] T035 Review the final diff and confirm that all user story tasks are complete and traceable to their source files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story phases (Phases 3-8)**: All depend on the Foundational phase and can proceed in parallel when team capacity allows
- **Polish (Phase 9)**: Depends on all story phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after the foundation is complete
- **User Story 2 (P1)**: Can start after the foundation is complete and should be validated independently from Story 1
- **User Story 3 (P2)**: Depends on the shared service baseline and can start in parallel with Stories 4-6 after foundation
- **User Story 4 (P2)**: Depends on the shared app baseline and toolchain plan
- **User Story 5 (P2)**: Depends on the app and state baseline
- **User Story 6 (P2)**: Can start after story implementation is in place and should align with the final migration guidance

### Parallel Opportunities

- Setup tasks can run in parallel as they touch different configuration concerns.
- Foundational tasks can run in parallel if the team is validating auth, route behavior, and shared loading state together.
- User stories can be worked in parallel after the foundation is complete.
- The app shell and feature-level tasks are independent enough to split across multiple developers.

### Parallel Example

```bash
# Example: parallel work after foundation is done
Task A: Refactor root app shell in src/app/app.component.ts
Task B: Update assessment component state in src/app/features/candidate-assessment/candidate-assessment.component.ts
Task C: Add Vite/Vitest workflow in package.json
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup
2. Complete Foundational
3. Complete User Story 1
4. Validate login, auth guard, and root navigation independently
5. Stop and confirm the app remains functional before continuing to broader modernization

### Incremental Delivery

1. Stabilize the app shell and shared auth/loading patterns
2. Improve performance and data-loading behavior in high-traffic screens
3. Add the faster local validation workflow and modern Angular template patterns
4. Document and standardize the new conventions
5. Finish with a cross-cutting regression pass

### Parallel Team Strategy

With multiple developers:

1. One engineer focuses on foundation and auth shell stability
2. One engineer focuses on assessment performance and state boundaries
3. One engineer focuses on toolchain and validation workflow
4. One engineer focuses on template modernization and docs

---

## Notes

- [P] tasks indicate parallelizable work across different files or separate concerns.
- [Story] labels map tasks to the corresponding user story for traceability.
- Each user story is independently testable and can be delivered as a separate increment.
- All task IDs are sequential and follow the required checklist format.
