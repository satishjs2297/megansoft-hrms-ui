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

  it('initializes as logged out', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();
  });

  it('returns login route when no permissions set', () => {
    expect(service.getDefaultRoute()).toBe('/login');
  });

  it('returns resume route for full-access permission', () => {
    const testResponse = {
      access_token: 'test-token',
      username: 'testuser',
      role: 'admin',
      permissions: ['app:full_access']
    };
    service['persistSession'](testResponse);
    expect(service.getDefaultRoute()).toBe('/resume');
    expect(service.hasPermission('app:full_access')).toBe(true);
  });

  it('returns assessment route for assessment:write permission', () => {
    const testResponse = {
      access_token: 'test-token',
      username: 'assessor',
      role: 'assessor',
      permissions: ['assessment:write']
    };
    service['persistSession'](testResponse);
    expect(service.getDefaultRoute()).toBe('/assessment');
    expect(service.hasPermission('assessment:write')).toBe(true);
  });
});
