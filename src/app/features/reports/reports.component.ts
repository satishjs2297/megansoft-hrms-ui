import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AssessmentService } from '../../core/services/assessment.service';
import { ReportService } from '../../core/services/report.service';
import { AssessmentRecord, AssessmentSummary } from '../../core/models/assessment.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule, MatDialogModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  records: AssessmentRecord[] = [];
  summary: AssessmentSummary = { total: 0, selected: 0, rejected: 0, on_hold: 0 };
  loading = true;
  selectedRecord: AssessmentRecord | null = null;
  displayedColumns = ['id', 'candidate_name', 'panel_name', 'date_of_interview', 'assessment_status', 'created_at', 'actions'];

  searchControl = new FormControl('');

  constructor(
    private assessmentService: AssessmentService,
    private reportService: ReportService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadRecords();
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(v => this.loadRecords(v || ''));
  }

  loadRecords(search = '') {
    this.loading = true;
    this.assessmentService.getAll(search).subscribe({
      next: (res) => { this.records = res.records; this.summary = res.summary; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  viewRecord(record: AssessmentRecord) {
    this.selectedRecord = record;
  }

  closeDetail() {
    this.selectedRecord = null;
  }

  exportAllCsv() {
    this.reportService.exportAllCsv().subscribe({
      next: (blob) => this.downloadBlob(blob, `assessments_${new Date().toISOString().slice(0,10)}.csv`),
      error: () => this.snack.open('Export failed', 'Close', { duration: 3000, panelClass: 'error-snack' })
    });
  }

  exportPdf(id: number, name: string) {
    this.reportService.exportPdf(id).subscribe({
      next: (blob) => this.downloadBlob(blob, `assessment_${name.replace(' ', '_')}.pdf`),
      error: () => this.snack.open('PDF export failed', 'Close', { duration: 3000, panelClass: 'error-snack' })
    });
  }

  exportSingleCsv(id: number, name: string) {
    this.reportService.exportSingleCsv(id).subscribe({
      next: (blob) => this.downloadBlob(blob, `assessment_${name.replace(' ', '_')}.csv`),
      error: () => this.snack.open('CSV export failed', 'Close', { duration: 3000, panelClass: 'error-snack' })
    });
  }

  deleteRecord(id: number) {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    this.assessmentService.delete(id).subscribe({
      next: () => { this.snack.open('Deleted', 'Close', { duration: 2000 }); this.loadRecords(); if (this.selectedRecord?.id === id) this.selectedRecord = null; },
      error: () => this.snack.open('Delete failed', 'Close', { duration: 3000, panelClass: 'error-snack' })
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-').replace('(', '').replace(')', '');
  }

  getRatingClass(rating: string): string {
    return rating.toLowerCase().replace(' ', '-');
  }

  getSkillEntries(skills: Record<string, string>): [string, string][] {
    return Object.entries(skills);
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
