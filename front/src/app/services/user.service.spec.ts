import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a user by id', () => {
    service.getById('1').subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.id).toBe(1);
      expect(response.firstName).toBe('John');
    });

    const request = httpMock.expectOne('api/user/1');
    expect(request.request.method).toEqual('GET');

    request.flush({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should delete a user', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBe(undefined);
    });

    const request = httpMock.expectOne('api/user/1');
    expect(request.request.method).toEqual('DELETE');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
