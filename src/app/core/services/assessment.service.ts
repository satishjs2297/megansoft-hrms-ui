import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssessmentCreate, AssessmentRecord, AssessmentListResponse, AssessmentListParams } from '../models/assessment.model';

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private base = `${environment.apiUrl}/assessment`;

  constructor(private http: HttpClient) {}

  create(data: AssessmentCreate): Observable<AssessmentRecord> {
    return this.http.post<AssessmentRecord>(this.base, data);
  }

  getAll(paramsInput: AssessmentListParams = {}): Observable<AssessmentListResponse> {
    let params = new HttpParams();

    if (paramsInput.search) params = params.set('search', paramsInput.search);
    if (paramsInput.panelName) params = params.set('panelName', paramsInput.panelName);
    if (paramsInput.feedbackStatus) params = params.set('feedbackStatus', paramsInput.feedbackStatus);
    if (paramsInput.fromDate) params = params.set('fromDate', paramsInput.fromDate);
    if (paramsInput.toDate) params = params.set('toDate', paramsInput.toDate);
    if (paramsInput.pageNo) params = params.set('pageNo', paramsInput.pageNo.toString());
    if (paramsInput.maxRecords) params = params.set('maxRecords', paramsInput.maxRecords.toString());

    return this.http.get<AssessmentListResponse>(this.base, { params });
  }

  getById(id: number): Observable<AssessmentRecord> {
    return this.http.get<AssessmentRecord>(`${this.base}/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  generateSummary(candidateName: string, assessmentStatus: string, skillRatings: Record<string, string>): Observable<{ summary: string }> {
    return this.http.post<{ summary: string }>(`${this.base}/summarize`, {
      candidate_name: candidateName,
      assessment_status: assessmentStatus,
      skill_ratings: skillRatings,
    });
  }
}
