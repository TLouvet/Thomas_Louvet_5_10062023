import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const sessions: Session[] = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Session 1 description',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all sessions', () => {
    service.all().subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.length).toEqual(2);
      expect(response[0].name).toEqual('Session 1');
    });

    const request = httpMock.expectOne('api/session');
    expect(request.request.method).toEqual('GET');

    request.flush(sessions);
  });

  it('should get one session that exists', () => {
    service.detail('1').subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.id).toBe(1);
      expect(response.name).toBe('Session 1');
    });

    const request = httpMock.expectOne('api/session/1');
    expect(request.request.method).toEqual('GET');

    request.flush(sessions[0]);
  });

  it('should delete one session that exists', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const request = httpMock.expectOne('api/session/1');
    expect(request.request.method).toEqual('DELETE');

    request.flush({});
  });

  it('should create a session', () => {
    const newSession: Session = {
      name: 'Session 3',
      description: 'Session 3 description',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3],
    };

    service.create(newSession).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.name).toBe('Session 3');
    });

    const request = httpMock.expectOne('api/session');
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual(newSession);

    request.flush(newSession);
  });

  it('should update a session that exists', () => {
    const updatedSession: Session = {
      id: 1,
      name: 'Session 1 Update',
      description: 'Session 1 description',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service.update('1', updatedSession).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.name).toBe('Session 1 Update');
    });

    const request = httpMock.expectOne('api/session/1');
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(updatedSession);

    request.flush(updatedSession);
  });

  it('should allow a user to participate', () => {
    service.participate('1', '1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const request = httpMock.expectOne('api/session/1/participate/1');
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toBeNull();
    request.flush({});
  });

  it('should allow a user to no longer participate', () => {
    service.unParticipate('1', '1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const request = httpMock.expectOne('api/session/1/participate/1');
    expect(request.request.method).toEqual('DELETE');
    request.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });
});
