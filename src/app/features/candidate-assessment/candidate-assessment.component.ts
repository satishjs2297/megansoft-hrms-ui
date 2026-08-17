import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AssessmentService } from '../../core/services/assessment.service';
import { ResumeService } from '../../core/services/resume.service';
import { AssessmentCreate, AssessmentStatus, SkillRating } from '../../core/models/assessment.model';

@Component({
  selector: 'app-candidate-assessment',
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatDividerModule, MatProgressSpinnerModule, MatSnackBarModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './candidate-assessment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./candidate-assessment.component.scss']
})
export class CandidateAssessmentComponent {
  // Document state: JD input and skill extraction
  readonly jdFile = signal<File | null>(null);
  readonly jdText = signal('');
  readonly skillGroups = signal<string[]>([]);
  readonly skillRatings = signal<Record<string, SkillRating>>({});

  // UI state: Loading and submission flags
  readonly extractingSkills = signal(false);
  readonly generatingSummary = signal(false);
  readonly submitting = signal(false);
  readonly submitted = signal(false);

  // Computed state: Derived flags
  readonly hasSkills = computed(() => this.skillGroups().length > 0);
  readonly isLoading = computed(() => this.extractingSkills() || this.generatingSummary() || this.submitting());
  readonly canSubmit = computed(() => this.form.valid && this.hasSkills() && !this.isLoading());

  readonly ratings: SkillRating[] = ['Very Good', 'Good', 'Average', 'Low'];
  readonly statuses: AssessmentStatus[] = ['Select', 'Above Average', 'Reject', 'Strong Reject', 'On Hold'];

  form = this.fb.group({
    candidate_name: ['', Validators.required],
    panel_name: ['', Validators.required],
    date_of_interview: ['', Validators.required],
    assessment_status: ['Select' as AssessmentStatus, Validators.required],
    overall_observation: [''],
  });

  constructor(
    private fb: FormBuilder,
    private assessmentService: AssessmentService,
    private resumeService: ResumeService,
    private snack: MatSnackBar
  ) { }

  onJdTextInput(event: Event) {
    this.jdText.set((event.target as HTMLTextAreaElement).value);
  }

  onJdFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.jdFile.set(input.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => { this.jdText.set((e.target?.result as string) || ''); };
      reader.readAsText(input.files[0]);
    }
  }

  extractSkills() {
    if (!this.jdText().trim()) return;
    this.extractingSkills.set(true);
    this.resumeService.extractJdSkills(this.jdText()).subscribe({
      next: (res) => {
        const skills = Array.isArray(res.skill_groups) ? res.skill_groups : [];
        this.skillGroups.set(skills);
        const ratings: Record<string, SkillRating> = {};
        skills.forEach(s => ratings[s] = 'Good');
        this.skillRatings.set(ratings);
        this.extractingSkills.set(false);
        if (!skills.length) this.showError('No skills could be extracted. Try a more detailed job description.');
      },
      error: (e) => { this.extractingSkills.set(false); this.showError('Skill extraction failed: ' + (e.error?.detail || e.message)); }
    });
  }

  setRating(skill: string, rating: SkillRating) {
    const current = this.skillRatings();
    this.skillRatings.set({ ...current, [skill]: rating });
  }

  generateSummary() {
    const candidateName = this.form.value.candidate_name?.trim();
    const assessmentStatus = this.form.value.assessment_status;
    if (!candidateName || !assessmentStatus || !this.hasSkills()) {
      this.showError('Please fill in candidate name, assessment status, and rate at least one skill before generating a summary.');
      return;
    }
    this.generatingSummary.set(true);
    this.assessmentService.generateSummary(candidateName, assessmentStatus, this.skillRatings()).subscribe({
      next: (res) => {
        this.form.patchValue({ overall_observation: res.summary });
        this.generatingSummary.set(false);
      },
      error: (e) => { this.generatingSummary.set(false); this.showError('Summary generation failed: ' + (e.error?.detail || e.message)); }
    });
  }

  getRatingClass(r: SkillRating): string {
    return r.toLowerCase().replace(' ', '-');
  }

  onSubmit() {
    if (this.form.invalid || !this.hasSkills()) return;
    this.submitting.set(true);
    const val = this.form.value;
    const payload: AssessmentCreate = {
      candidate_name: val.candidate_name!,
      panel_name: val.panel_name!,
      date_of_interview: this.formatDate(val.date_of_interview)!,
      assessment_status: val.assessment_status as AssessmentStatus,
      skills_assessment: this.skillRatings(),
      overall_observation: val.overall_observation || '',
      job_description_text: this.jdText(),
    };
    this.assessmentService.create(payload).subscribe({
      next: () => { this.submitting.set(false); this.submitted.set(true); this.snack.open('Assessment saved successfully!', 'Close', { duration: 3000, panelClass: 'success-snack' }); },
      error: (e) => { this.submitting.set(false); this.showError('Failed to save: ' + (e.error?.detail || e.message)); }
    });
  }

  reset() {
    this.form.reset({ assessment_status: 'Select' });
    this.jdFile.set(null);
    this.jdText.set('');
    this.skillGroups.set([]);
    this.skillRatings.set({});
    this.submitted.set(false);
  }

  private showError(msg: string) {
    this.snack.open(msg, 'Close', { duration: 5000, panelClass: 'error-snack' });
  }

  private formatDate(value: unknown): string {
    if (!value) return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const day = `${value.getDate()}`.padStart(2, '0');
      const month = `${value.getMonth() + 1}`.padStart(2, '0');
      const year = value.getFullYear();
      return `${day}-${month}-${year}`;
    }
    if (typeof value === 'string') {
      const datePart = value.split('T')[0];
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
      if (match) return `${match[3]}-${match[2]}-${match[1]}`;
      return value;
    }
    return String(value);
  }
}
