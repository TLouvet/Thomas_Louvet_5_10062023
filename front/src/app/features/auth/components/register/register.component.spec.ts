import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error message when the error property is true', () => {
    component.onError = true;
    fixture.detectChanges();
    const formElement: HTMLElement = fixture.nativeElement;
    const errorMessage = formElement.querySelector('span.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage!.textContent).toContain('An error occurred');
  });

  it('should show an error message on the required fields if they are empty and the form is submitted', () => {
    const formElement: HTMLElement = fixture.nativeElement;
    const submitButton = formElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );
    if (!submitButton) {
      throw new Error('Submit button not found');
    }

    submitButton.click();
    fixture.detectChanges();

    expect(formElement.querySelectorAll('input.ng-invalid')).toHaveLength(4);
  });

  it('should state onerror if the submit fails', () => {
    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockImplementation(() => throwError(() => new Error('err')));

    component.submit();
    expect(registerSpy).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should navigate to the login page if the submit is successful', () => {
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);

    const authSpy = jest
      .spyOn(authService, 'register')
      .mockImplementation(() => of(undefined));

    component.submit();
    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
