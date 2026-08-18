# Quickstart Validation Guide

## Purpose

This guide describes the minimum end-to-end validation scenarios needed to confirm that the Angular modernization work preserves the app’s business value while improving responsiveness, maintainability, and a faster local development workflow.

## Prerequisites

- Node.js and npm installed for the frontend workspace
- Existing backend services running for assessment, resume, and authentication APIs
- Access to the project workspace and ability to run Angular dev commands

## Local validation workflow

### 1. Install dependencies

```bash
npm install
```

**Expected outcome**: dependencies are installed without package resolution failures.

### 2. Run the app locally

```bash
npm start
```

**Expected outcome**: the HRMS UI boots successfully and the route structure is available for login and protected features.

### 3. Validate authentication flow

- Log in using the configured app credentials.
- Confirm that the app redirects appropriately and that the authenticated session is retained.

**Expected outcome**: login works without breaking existing access rules or route navigation.

### 4. Validate assessment workflow

- Navigate to the candidate assessment screen.
- Paste or upload a job description and extract skills.
- Rate the extracted skills and generate the summary.
- Submit the assessment and verify the success feedback.

**Expected outcome**: the feature remains stable and user-visible behavior remains consistent after modernization.

### 5. Validate resume workflow

- Navigate to the resume generator.
- Upload a resume or structured input.
- Generate a resume using the available template flow.
- Confirm that the generated output remains available and user-friendly.

**Expected outcome**: generation continues to work without regressions in user experience or output quality.

### 6. Validate reporting flow

- Open the report view.
- Apply any available filters and confirm that the displayed aggregates update correctly.

**Expected outcome**: report data remains accurate and the screen remains responsive during updates.

### 7. Validate modernization quality checks

- Verify that components show the expected app behavior without excessive rerender churn.
- Confirm the application structure reflects the chosen modern Angular patterns without breaking route logic or dependency injection.
- Run the project validation commands added as part of the Vite/Vitest workflow.

**Expected outcome**: the app remains stable while the codebase becomes easier to reason about and faster to iterate on.
