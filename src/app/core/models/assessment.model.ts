export type AssessmentStatus = 'Select' | 'Above Average' | 'Reject' | 'Strong Reject' | 'On Hold';
export type SkillRating = 'Very Good' | 'Good' | 'Average' | 'Low';

export interface AssessmentCreate {
  candidate_name: string;
  panel_name: string;
  date_of_interview: string;
  assessment_status: AssessmentStatus;
  skills_assessment: Record<string, SkillRating>;
  overall_observation?: string;
  job_description_text?: string;
}

export interface AssessmentRecord extends AssessmentCreate {
  id: number;
  created_at: string;
}

export interface AssessmentSummary {
  total: number;
  selected: number;
  rejected: number;
  on_hold: number;
}

export interface AssessmentListResponse {
  records: AssessmentRecord[];
  summary: AssessmentSummary;
}
