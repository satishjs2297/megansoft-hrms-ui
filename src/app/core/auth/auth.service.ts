import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

type LoginResponse = {
  access_token: string;
  username: string;
  role: string;
  permissions: string[];
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'hrms_token';
  private readonly USER_KEY = 'hrms_user';
  private readonly ROLE_KEY = 'hrms_role';
  private readonly PERMISSIONS_KEY = 'hrms_permissions';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        localStorage.setItem(this.USER_KEY, res.username);
        localStorage.setItem(this.ROLE_KEY, res.role);
        localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(res.permissions || []));
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.PERMISSIONS_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  getPermissions(): string[] {
    try {
      const raw = localStorage.getItem(this.PERMISSIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    return permissions.includes('*') || permissions.includes(permission);
  }

  getDefaultRoute(): string {
    if (this.hasPermission('app:full_access')) return '/resume';
    if (this.hasPermission('assessment:write')) return '/assessment';
    return '/login';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
