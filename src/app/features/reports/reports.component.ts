import { Component, OnInit } from '@angular/core';
import { ElementRef, TemplateRef, ViewChild } from '@angular/core';
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
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AssessmentService } from '../../core/services/assessment.service';
import { ReportService } from '../../core/services/report.service';
import { AssessmentListParams, AssessmentRecord, AssessmentSummary } from '../../core/models/assessment.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule, MatDialogModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @ViewChild('chartDialog') chartDialog!: TemplateRef<unknown>;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  records: AssessmentRecord[] = [];
  summary: AssessmentSummary = { total: 0, selected: 0, rejected: 0, on_hold: 0 };
  loading = true;
  selectedRecord: AssessmentRecord | null = null;
  displayedColumns = ['id', 'candidate_name', 'panel_name', 'date_of_interview', 'assessment_status', 'created_at', 'actions'];

  searchControl = new FormControl('', { nonNullable: true });
  panelControl = new FormControl('', { nonNullable: true });
  feedbackStatusControl = new FormControl('');
  fromDateControl = new FormControl<Date | null>(null);
  toDateControl = new FormControl<Date | null>(null);
  maxRecordsControl = new FormControl(10, { nonNullable: true });

  feedbackStatusOptions = ['Select', 'Above Average', 'Reject', 'Strong Reject', 'On Hold'];
  pageNo = 1;
  maxRecords = 10;
  totalRecords = 0;
  totalPages = 1;
  statusCounts: Record<string, number> = {};
  chartEntries: { label: string; value: number }[] = [];
  private dialogRef?: MatDialogRef<unknown>;

  constructor(
    private assessmentService: AssessmentService,
    private reportService: ReportService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadRecords();
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => this.reloadFromFirstPage());
    this.panelControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => this.reloadFromFirstPage());
    this.feedbackStatusControl.valueChanges.subscribe(() => this.reloadFromFirstPage());
    this.fromDateControl.valueChanges.subscribe(() => this.reloadFromFirstPage());
    this.toDateControl.valueChanges.subscribe(() => this.reloadFromFirstPage());
    this.maxRecordsControl.valueChanges.subscribe(v => {
      this.maxRecords = Number(v) || 10;
      this.reloadFromFirstPage();
    });
  }

  loadRecords() {
    this.loading = true;
    this.assessmentService.getAll(this.buildQueryParams()).subscribe({
      next: (res) => {
        this.records = res.records;
        this.summary = res.summary;
        this.statusCounts = res.status_counts || {};
        this.totalRecords = res.pagination?.totalRecords ?? res.summary.total ?? 0;
        this.totalPages = res.pagination?.totalPages ?? 1;
        this.pageNo = res.pagination?.pageNo ?? this.pageNo;
        this.maxRecords = res.pagination?.maxRecords ?? this.maxRecords;
        this.buildChartEntries();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  viewRecord(record: AssessmentRecord) {
    this.selectedRecord = record;
  }

  closeDetail() {
    this.selectedRecord = null;
  }

  reloadFromFirstPage() {
    this.pageNo = 1;
    this.loadRecords();
  }

  previousPage() {
    if (this.pageNo <= 1 || this.loading) return;
    this.pageNo--;
    this.loadRecords();
  }

  nextPage() {
    if (this.pageNo >= this.totalPages || this.loading) return;
    this.pageNo++;
    this.loadRecords();
  }

  openChartDialog() {
    const total = Object.values(this.statusCounts).reduce((acc, n) => acc + n, 0);
    if (total === 0) {
      this.snack.open('No searched records available to chart', 'Close', { duration: 2500 });
      return;
    }
    this.dialogRef = this.dialog.open(this.chartDialog, { width: '820px', maxWidth: '95vw' });
    this.dialogRef.afterOpened().subscribe(() => setTimeout(() => this.drawBarChart(), 0));
  }

  downloadChartImage() {
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `assessment_status_chart_${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
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
      next: () => {
        this.snack.open('Deleted', 'Close', { duration: 2000 });
        if (this.records.length === 1 && this.pageNo > 1) this.pageNo--;
        this.loadRecords();
        if (this.selectedRecord?.id === id) this.selectedRecord = null;
      },
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

  formatDisplayDate(value: unknown): string {
    if (!value) return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const d = `${value.getDate()}`.padStart(2, '0');
      const m = `${value.getMonth() + 1}`.padStart(2, '0');
      const y = value.getFullYear();
      return `${d}-${m}-${y}`;
    }
    if (typeof value === 'string') {
      const datePart = value.split('T')[0];
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
      if (m) return `${m[3]}-${m[2]}-${m[1]}`;
      return value;
    }
    return String(value);
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private buildQueryParams(): AssessmentListParams {
    return {
      search: this.searchControl.value.trim(),
      panelName: this.panelControl.value.trim(),
      feedbackStatus: this.feedbackStatusControl.value || '',
      fromDate: this.formatDate(this.fromDateControl.value),
      toDate: this.formatDate(this.toDateControl.value),
      pageNo: this.pageNo,
      maxRecords: this.maxRecords,
    };
  }

  private buildChartEntries() {
    const preferredOrder = this.feedbackStatusOptions;
    const used = new Set<string>();
    const entries: { label: string; value: number }[] = [];

    for (const key of preferredOrder) {
      const count = this.statusCounts[key];
      if (typeof count === 'number') {
        entries.push({ label: key, value: count });
        used.add(key);
      }
    }
    for (const [key, value] of Object.entries(this.statusCounts)) {
      if (!used.has(key)) entries.push({ label: key, value });
    }
    this.chartEntries = entries.filter(e => e.value > 0);
  }

  private drawBarChart() {
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const data = this.chartEntries;
    if (!data.length) return;

    const left = 70;
    const right = 20;
    const top = 40;
    const bottom = 65;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;
    const maxValue = Math.max(...data.map(x => x.value), 1);

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, height - bottom);
    ctx.lineTo(width - right, height - bottom);
    ctx.stroke();

    const colors = ['#1d4ed8', '#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const gap = 14;
    const barWidth = (chartWidth - gap * (data.length + 1)) / data.length;

    data.forEach((item, i) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = left + gap + i * (barWidth + gap);
      const y = height - bottom - barHeight;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#111827';
      ctx.font = '600 13px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 6);

      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.fillText(item.label, x + barWidth / 2, height - bottom + 18);
    });

    ctx.fillStyle = '#111827';
    ctx.font = '700 15px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Assessment Status Distribution (Filtered Records)', left, 22);
  }

  private formatDate(value: Date | null): string {
    if (!value) return '';
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, '0');
    const day = `${value.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
