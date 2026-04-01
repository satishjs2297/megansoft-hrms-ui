import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StructuredResume, ResumeTemplate } from '../models/resume.model';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private base = `${environment.apiUrl}/resume`;

  constructor(private http: HttpClient) {}

  extractText(file: File): Observable<{ extracted_text: string; file_type: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ extracted_text: string; file_type: string }>(`${this.base}/extract`, fd);
  }

  structureResume(extractedText: string): Observable<StructuredResume> {
    return this.http.post<StructuredResume>(`${this.base}/structure`, { extracted_text: extractedText });
  }

  generateResume(resumeData: StructuredResume, templateId: string): Observable<Blob> {
    return this.http.post(`${this.base}/generate?template_id=${encodeURIComponent(templateId)}`, resumeData, {
      responseType: 'blob'
    });
  }

  getTemplates(): Observable<ResumeTemplate[]> {
    return this.http.get<ResumeTemplate[]>(`${this.base}/templates`);
  }

  uploadTemplate(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(`${this.base}/upload-template`, fd);
  }

  extractJdSkills(jdText: string): Observable<{ skill_groups: string[] }> {
    return this.http.post<{ skill_groups: string[] }>(`${this.base}/extract-jd-skills`, { jd_text: jdText });
  }
}
