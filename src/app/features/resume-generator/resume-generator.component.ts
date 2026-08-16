import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ResumeService } from '../../core/services/resume.service';
import { StructuredResume, ResumeTemplate } from '../../core/models/resume.model';

@Component({
    selector: 'app-resume-generator',
    imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule
],
    templateUrl: './resume-generator.component.html',
    styleUrls: ['./resume-generator.component.scss']
})
export class ResumeGeneratorComponent implements OnInit {
  step = 0; // 0=upload, 1=processing, 2=review, 3=done
  templates: ResumeTemplate[] = [];
  selectedTemplate = '';
  selectedFile: File | null = null;
  selectedJdFile: File | null = null;
  selectedPhotoFile: File | null = null;
  candidatePhotoBase64 = '';
  jdText = '';
  extractedText = '';
  extractedJdText = '';
  structuredResume: StructuredResume | null = null;
  loading = false;
  loadingMessage = '';
  generatedBlob: Blob | null = null;
  generatedFilename = '';

  editForm!: FormGroup;

  constructor(private resumeService: ResumeService, private fb: FormBuilder, private snack: MatSnackBar) {}

  ngOnInit() {
    this.resumeService.getTemplates().subscribe({
      next: (t) => {
        this.templates = t;
        if (t.length) this.selectedTemplate = t[0].id;
      },
      error: () => this.templates = []
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onJdFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedJdFile = input.files[0];
      this.loading = true;
      this.loadingMessage = 'Extracting text from job description...';
      this.resumeService.extractText(this.selectedJdFile).subscribe({
        next: (res) => {
          this.jdText = res.extracted_text || '';
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.showError('Failed to extract job description: ' + (e.error?.detail || e.message));
        }
      });
    }
  }

  onJdTextInput(event: Event) {
    this.jdText = (event.target as HTMLTextAreaElement).value;
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.showError('Please upload a valid image file (JPG/PNG).');
      return;
    }
    this.selectedPhotoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.candidatePhotoBase64 = String(reader.result || '');
    };
    reader.onerror = () => {
      this.showError('Failed to read candidate photo.');
      this.selectedPhotoFile = null;
      this.candidatePhotoBase64 = '';
    };
    reader.readAsDataURL(file);
  }

  onProcess() {
    if (!this.selectedFile) return;
    this.loading = true;
    this.loadingMessage = 'Extracting text from resume...';
    this.resumeService.extractText(this.selectedFile).subscribe({
      next: (res) => {
        this.extractedText = res.extracted_text;
        if (this.selectedJdFile && !this.jdText.trim()) {
          this.loadingMessage = 'Extracting text from job description...';
          this.resumeService.extractText(this.selectedJdFile).subscribe({
            next: (jdRes) => {
              const textAreaJd = this.jdText.trim();
              const fileJd = (jdRes.extracted_text || '').trim();
              this.extractedJdText = textAreaJd && fileJd ? `${textAreaJd}\n\n${fileJd}` : (textAreaJd || fileJd);
              this.structureResumeWithContext();
            },
            error: (e) => { this.loading = false; this.showError('Failed to extract job description: ' + (e.error?.detail || e.message)); }
          });
          return;
        }
        this.extractedJdText = this.jdText.trim();
        this.structureResumeWithContext();
      },
      error: (e) => { this.loading = false; this.showError('Failed to extract text: ' + (e.error?.detail || e.message)); }
    });
  }

  private structureResumeWithContext() {
    this.loadingMessage = 'AI is structuring your resume...';
    this.resumeService.structureResume(this.extractedText, this.extractedJdText).subscribe({
      next: (resume) => {
        this.structuredResume = resume;
        this.buildEditForm(resume);
        this.loading = false;
        this.step = 2;
      },
      error: (e) => { this.loading = false; this.showError('Failed to structure resume: ' + (e.error?.detail || e.message)); }
    });
  }

  buildEditForm(resume: StructuredResume) {
    this.editForm = this.fb.group({
      name: [resume.contact.name, Validators.required],
      email: [resume.contact.email],
      phone: [resume.contact.phone || ''],
      location: [resume.contact.location || ''],
      linkedin: [resume.contact.linkedin || ''],
      notice_period: [resume.contact.notice_period || ''],
      candidate_type: [resume.contact.candidate_type || 'External'],
      interview_availability: [resume.contact.interview_availability || ''],
      start_availability: [resume.contact.start_availability || ''],
      total_experience_years: [resume.contact.total_experience_years || ''],
      relevant_experience_years: [resume.contact.relevant_experience_years || ''],
      hacker_rank_score: [resume.contact.hacker_rank_score || ''],
      worked_with_ford_before: [resume.contact.worked_with_ford_before || 'No'],
      worked_with_ford_agency_before: [resume.contact.worked_with_ford_agency_before || 'No'],
      designation: [resume.designation || ''],
      summary: [resume.summary || ''],
    });
  }

  onGenerate() {
    if (!this.structuredResume || !this.editForm) return;
    const formVal = this.editForm.value;
    const updatedResume: StructuredResume = {
      ...this.structuredResume,
      designation: formVal.designation,
      summary: formVal.summary,
      candidate_photo_base64: this.candidatePhotoBase64 || undefined,
      contact: {
        ...this.structuredResume.contact,
        name: formVal.name,
        email: formVal.email,
        phone: formVal.phone,
        location: formVal.location,
        linkedin: formVal.linkedin,
        notice_period: formVal.notice_period,
        candidate_type: formVal.candidate_type,
        interview_availability: formVal.interview_availability,
        start_availability: formVal.start_availability,
        total_experience_years: formVal.total_experience_years,
        relevant_experience_years: formVal.relevant_experience_years,
        hacker_rank_score: formVal.hacker_rank_score,
        worked_with_ford_before: formVal.worked_with_ford_before,
        worked_with_ford_agency_before: formVal.worked_with_ford_agency_before,
      }
    };
    const normalizedResume = this.normalizeResumeDates(updatedResume);
    this.loading = true;
    this.loadingMessage = 'Generating resume document...';
    this.resumeService.generateResume(normalizedResume, this.selectedTemplate).subscribe({
      next: (blob) => {
        this.generatedBlob = blob;
        this.generatedFilename = `${formVal.name.replace(' ', '_')}_resume.docx`;
        this.loading = false;
        this.step = 3;
        this.autoDownload(blob, this.generatedFilename);
      },
      error: (e) => { this.loading = false; this.showError('Generation failed: ' + (e.error?.detail || e.message)); }
    });
  }

  autoDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadAgain() {
    if (this.generatedBlob) this.autoDownload(this.generatedBlob, this.generatedFilename);
  }

  reset() {
    this.step = 0;
    this.selectedFile = null;
    this.selectedJdFile = null;
    this.selectedPhotoFile = null;
    this.candidatePhotoBase64 = '';
    this.jdText = '';
    this.extractedText = '';
    this.extractedJdText = '';
    this.structuredResume = null;
    this.generatedBlob = null;
    this.generatedFilename = '';
  }

  private showError(msg: string) {
    this.snack.open(msg, 'Close', { duration: 5000, panelClass: 'error-snack' });
  }

  private normalizeResumeDates(resume: StructuredResume): StructuredResume {
    return {
      ...resume,
      contact: {
        ...resume.contact,
        interview_availability: this.formatDateValue(resume.contact.interview_availability, '/'),
        start_availability: this.formatDateValue(resume.contact.start_availability, '/'),
      },
      experience: (resume.experience || []).map(exp => ({
        ...exp,
        start_date: this.formatDateValue(exp.start_date),
        end_date: this.formatDateValue(exp.end_date || ''),
      })),
      education: (resume.education || []).map(edu => ({
        ...edu,
        graduation_date: this.formatDateValue(edu.graduation_date),
      })),
      certifications: (resume.certifications || []).map(cert => ({
        ...cert,
        date: this.formatDateValue(cert.date || ''),
      })),
    };
  }

  private formatDateValue(value: unknown, delimiter: '-' | '/' = '-'): string {
    if (!value) return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const day = `${value.getDate()}`.padStart(2, '0');
      const month = `${value.getMonth() + 1}`.padStart(2, '0');
      const year = value.getFullYear();
      return `${day}${delimiter}${month}${delimiter}${year}`;
    }
    if (typeof value === 'string') {
      const datePart = value.split('T')[0];
      const fullMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
      if (fullMatch) return `${fullMatch[3]}${delimiter}${fullMatch[2]}${delimiter}${fullMatch[1]}`;
      return value;
    }
    return String(value);
  }
}
