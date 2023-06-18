import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RegisterRequest } from '../interfaces/registerRequest.interface';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('unit tests register', () => {
    const form: RegisterRequest = {
      email: 'john.doe@test.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    };

    service.register(form).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    const request = controller.expectOne('api/auth/register');
    expect(request.request.body).toEqual(form);
    expect(request.request.method).toEqual('POST');
    request.flush({});
  });

  it('unit tests login', () => {
    const form = {
      email: 'john.doe@test.com',
      password: '123456',
    };

    service.login(form).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response).toHaveProperty('token');
    });

    const request = controller.expectOne('api/auth/login');
    expect(request.request.body).toEqual(form);
    expect(request.request.method).toEqual('POST');
    request.flush({ token: 'token' });
  });

  afterEach(() => {
    controller.verify();
  });
});
