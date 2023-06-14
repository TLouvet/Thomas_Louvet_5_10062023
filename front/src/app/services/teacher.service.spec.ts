import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService Unit Test', () => {
  let service: TeacherService;
  let controller: HttpTestingController;

  const teachers: Teacher[] = [
    {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      lastName: 'Doe',
      firstName: 'Jane',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService],
    });
    service = TestBed.inject(TeacherService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all teachers', () => {
    service.all().subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.length).toEqual(2);
      expect(response[0].firstName).toEqual('John');
    });

    const request = controller.expectOne('api/teacher');
    expect(request.request.method).toEqual('GET');

    request.flush(teachers);
  });

  it('should get one teacher that exists', () => {
    service.detail('1').subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.id).toBe(1);
    });

    const request = controller.expectOne('api/teacher/1');
    request.flush(teachers[0]);
  });

  afterEach(() => {
    controller.verify();
  });
});
