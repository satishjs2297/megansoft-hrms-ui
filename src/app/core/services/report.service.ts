import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private base = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  exportPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.base}/${id}/export/pdf`, { responseType: 'blob' });
  }

  exportSingleCsv(id: number): Observable<Blob> {
    return this.http.get(`${this.base}/${id}/export/csv`, { responseType: 'blob' });
  }

  exportAllCsv(): Observable<Blob> {
    return this.http.get(`${this.base}/export/csv`, { responseType: 'blob' });
  }
}
