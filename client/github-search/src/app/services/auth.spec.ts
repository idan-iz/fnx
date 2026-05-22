import { TestBed } from '@angular/core/testing';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Token Management', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should set and get the token from localStorage', () => {
      expect(service.getToken()).toBeNull();
      service.setToken('test-token');
      expect(service.getToken()).toBe('test-token');
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('should initialize token from localStorage on creation', () => {
      localStorage.setItem('auth_token', 'initial-token');
      const newService = new Auth();
      expect(newService.getToken()).toBe('initial-token');
    });

    it('should return true for isLoggedIn when a token is present', () => {
      expect(service.isLoggedIn()).toBeFalse();
      service.setToken('test-token');
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false for isLoggedIn when no token is present', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should remove the token on removeToken()', () => {
      service.setToken('test-token');
      expect(service.getToken()).toBe('test-token');
      service.removeToken();
      expect(service.getToken()).toBeNull();
    });

    it('should remove the token and perform logout steps on logout()', () => {
      service.setToken('test-token');
      expect(service.getToken()).toBe('test-token');
      service.logout();
      expect(service.getToken()).toBeNull();
    });
  });
});
