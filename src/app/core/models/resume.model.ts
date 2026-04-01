export interface Contact {
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  notice_period?: string;
  candidate_type?: string;
  interview_availability?: string;
  start_availability?: string;
  total_experience_years?: string;
  relevant_experience_years?: string;
  hacker_rank_score?: string;
  worked_with_ford_before?: string;
  worked_with_ford_agency_before?: string;
}

export interface Experience {
  company: string;
  position: string;
  client_name?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string[];
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field_of_study: string;
  graduation_date: string;
  gpa?: string;
  achievements: string[];
}

export interface Skill {
  category: string;
  skills: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  date?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credential_id?: string;
  credential_url?: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface StructuredResume {
  contact: Contact;
  designation?: string;
  summary?: string;
  career_summary: string[];
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  additional_info?: Record<string, any>;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  filename: string;
}
