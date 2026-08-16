import '@angular/compiler';
import { describe, expect, it, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = new AuthService({} as HttpClient);
  });

  it('returns a default route for full-access users', () => {
    localStorage.setItem('hrms_permissions', JSON.stringify(['app:full_access']));
    expect(service.getDefaultRoute()).toBe('/resume');
    expect(service.hasPermission('app:full_access')).toBe(true);
  });

  it('returns a default route for assessment users', () => {
    localStorage.setItem('hrms_permissions', JSON.stringify(['assessment:write']));
    expect(service.getDefaultRoute()).toBe('/assessment');
  });

  it('tracks login state from the token', () => {
    expect(service.isLoggedIn()).toBe(false);
    localStorage.setItem('hrms_token', 'token');
    expect(service.isLoggedIn()).toBe(true);
  });
});
