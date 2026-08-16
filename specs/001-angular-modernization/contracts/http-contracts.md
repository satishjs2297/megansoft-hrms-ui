# HTTP Contracts

## Overview

This feature addresses frontend modernization, not backend redesign. The client continues to rely on the existing REST API contracts for auth, assessment, resume, and reporting operations.

## Auth

### POST /auth/login

**Purpose**: Authenticate the user and return the current session context.

**Request**:
- content-type: application/x-www-form-urlencoded
- fields:
  - username: string
  - password: string

**Response**:
```json
{
  "access_token": "string",
  "username": "string",
  "role": "string",
  "permissions": ["string"]
}
```

**Notes**:
- The client stores the token in browser storage and uses permissions to gate route access.

## Assessment

### POST /assessment

**Purpose**: Create an assessment record.

**Request shape**:
```json
{
  "candidate_name": "string",
  "panel_name": "string",
  "date_of_interview": "DD-MM-YYYY",
  "assessment_status": "Select | Above Average | Reject | Strong Reject | On Hold",
  "skills_assessment": {
    "skill": "Very Good | Good | Average | Low"
  },
  "overall_observation": "string",
  "job_description_text": "string"
}
```

**Response**:
- Creates a persisted assessment record and returns the saved object.

### GET /assessment

**Purpose**: Retrieve the list of assessments with optional filters.

**Query parameters**:
- search
- panelName
- feedbackStatus
- fromDate
- toDate
- pageNo
- maxRecords

**Response**:
```json
{
  "records": [],
  "summary": {
    "total": 0,
    "selected": 0,
    "rejected": 0,
    "on_hold": 0
  },
  "status_counts": {},
  "pagination": {
    "pageNo": 1,
    "maxRecords": 20,
    "totalRecords": 0,
    "totalPages": 0
  }
}
```

### POST /assessment/summarize

**Purpose**: Generate a natural-language assessment summary from candidate and skill data.

**Request**:
```json
{
  "candidate_name": "string",
  "assessment_status": "string",
  "skill_ratings": {
    "skill": "string"
  }
}
```

**Response**:
```json
{
  "summary": "string"
}
```

## Resume

### POST /resume/extract

**Purpose**: Extract text from a resume file.

**Request**:
- multipart/form-data with the uploaded file

**Response**:
```json
{
  "extracted_text": "string",
  "file_type": "string"
}
```

### POST /resume/structure

**Purpose**: Convert raw extracted resume content into a structured resume model.

### POST /resume/generate?template_id={templateId}

**Purpose**: Generate a resume artifact from structured resume data.

**Response**:
- binary file payload as a generated document

### GET /resume/templates

**Purpose**: Retrieve available resume templates.

## Reporting

The reporting experience is driven by assessment data and should continue to consume aggregated backend counts and list results without requiring new public contracts during the modernization phase.
