import { Injectable, computed, signal } from '@angular/core';
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

  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly usernameSignal = signal<string | null>(this.getStoredUsername());
  private readonly roleSignal = signal<string | null>(this.getStoredRole());
  private readonly permissionsSignal = signal<string[]>(this.getStoredPermissions());

  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap((res: LoginResponse) => this.persistSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.PERMISSIONS_KEY);

    this.tokenSignal.set(null);
    this.usernameSignal.set(null);
    this.roleSignal.set(null);
    this.permissionsSignal.set([]);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  getUsername(): string | null {
    return this.usernameSignal();
  }

  getRole(): string | null {
    return this.roleSignal();
  }

  getPermissions(): string[] {
    return this.permissionsSignal();
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

  private persistSession(res: LoginResponse): void {
    const permissions = Array.isArray(res.permissions) ? res.permissions : [];

    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    localStorage.setItem(this.USER_KEY, res.username);
    localStorage.setItem(this.ROLE_KEY, res.role);
    localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(permissions));

    this.tokenSignal.set(res.access_token);
    this.usernameSignal.set(res.username);
    this.roleSignal.set(res.role);
    this.permissionsSignal.set(permissions);
  }

  private syncStateFromStorage(): void {
    this.tokenSignal.set(this.getStoredToken());
    this.usernameSignal.set(this.getStoredUsername());
    this.roleSignal.set(this.getStoredRole());
    this.permissionsSignal.set(this.getStoredPermissions());
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUsername(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  private getStoredRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  private getStoredPermissions(): string[] {
    try {
      const raw = localStorage.getItem(this.PERMISSIONS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
