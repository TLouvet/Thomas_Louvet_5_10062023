import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { lastValueFrom } from 'rxjs';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Custom add
  it('should log out the user', () => {
    service.logOut();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBe(undefined);
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(false);
  });

  it('should log in the user', () => {
    service.logIn({ admin: true, id: 1 } as SessionInformation);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual({ admin: true, id: 1 });
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(true);
  });
});
