# Data Model: Angular Modernization and Performance Optimization

## Overview

This feature is primarily a frontend modernization effort. The data model therefore focuses on the user-facing state and domain objects that currently drive the app, with emphasis on how they should be represented as clearer, lower-churn, and more maintainable state boundaries.

## Entities

### UserSession

Represents the authenticated user context for the HRMS UI.

**Fields**:
- userId: identifier for the authenticated user
- username: display value used in the app shell
- role: runtime authorization role
- permissions: list of allowed access rights
- token: access credential stored in the browser session or local storage

**Relationships**:
- Used by the route guard to authorize navigation and by the app shell to render role-aware navigation.

**Validation rules**:
- A valid session requires a token or equivalent authenticated state.
- Permission checks must resolve against the current role and permission list.

### CandidateAssessment

Represents the assessment workflow and candidate evaluation form.

**Fields**:
- candidateName: full name of the candidate
- panelName: interviewer or panel identifier
- dateOfInterview: interview date in a readable app format
- assessmentStatus: one of the supported status values
- skillsAssessment: map of skill names to rating values
- overallObservation: summary text entered by the reviewer
- jobDescriptionText: optional text captured from uploaded or pasted JD content

**Relationships**:
- Submitted to the assessment service for persistence.
- Used to generate summary text and support reporting tasks.

**Validation rules**:
- Required fields for candidate name, panel name, interview date, and assessment status must be present before submission.
- At least one skill rating should exist for a valid summary or save operation.

### ResumeData

Represents the resume-generation workflow and its input/output relationships.

**Fields**:
- extractedText: plain text captured from a resume file or import source
- jobDescriptionText: optional text used to align the resume with a role
- structuredResume: normalized resume model produced after parsing or structuring
- templateId: selected or generated resume template identifier
- generatedBlob: output artifact created by the generation step

**Relationships**:
- Used by the resume generator feature and its downstream services.
- May be consumed by visual rendering or file download flows.

**Validation rules**:
- Resume generation should only proceed with complete structured input and a valid template selection.
- Failure states must surface clear user feedback and preserve partial data as needed.

### ReportData

Represents reporting and analytics data used within the app shell and reporting screens.

**Fields**:
- summaryCounts: values describing current assessment outcomes or counts
- filterState: active search and date-range selection state
- records: list of items displayed in report tables or dashboards

**Relationships**:
- Derived from assessment data and used for operational visibility.
- May be displayed as status counts or aggregated summary cards.

**Validation rules**:
- Filter state must remain consistent with user-selected values.
- Empty or failed data loads should not prevent the UI from showing a clear error or empty state.

### ApplicationState

Represents the UI state used across the application, especially around async operations and view updates.

**Fields**:
- loadingState: boolean or state machine representing current request activity
- errorState: user-friendly error message or error metadata
- selectedRoute: current navigation route
- sidebarState: mobile/desktop layout decisions
- refreshState: whether a view needs to reload or recompute data

**Relationships**:
- Shared across components that display progress, fetch data, or update after route changes.

**Validation rules**:
- Loading and error flags must be consistent with the current request lifecycle.
- Unrelated parts of the UI should not be re-rendered when only a single screen or state slice changes.

## State transitions

### Authentication flow
- Logged out -> login form -> successful token storage -> authenticated route access
- Auth failure -> error feedback -> user remains on login path

### Assessment flow
- Form draft -> skill extraction -> rating updates -> summary generation -> save -> success message
- Failure states should leave the form in a recoverable state without losing user input

### Resume flow
- Upload/parse -> structure -> template selection -> generation -> download or preview
- Errors should stop generation and present actionable feedback

### Reporting flow
- Filters applied -> fetch data -> render summary and table -> state refresh on navigation or filter changes
