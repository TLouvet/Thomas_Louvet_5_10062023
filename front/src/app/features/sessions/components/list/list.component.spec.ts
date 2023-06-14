import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs';
import { ListComponent } from './list.component';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const sessions: Session[] = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Session 1 description',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      teacher_id: 1,
      users: [1, 2, 3],
    },
    {
      id: 2,
      name: 'Session 2',
      description: 'Session 2 description',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      teacher_id: 1,
      users: [1, 2, 4, 5],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: SessionService,
          useValue: {
            sessionInformation: {
              admin: true,
            },
          },
        },
        {
          provide: SessionApiService,
          useValue: {
            all: () => of(sessions),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of sessions', () => {
    expect(component.sessions$).toBeTruthy();
    component.sessions$.subscribe((sessions) => {
      expect(sessions).toHaveLength(2);
    });

    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('mat-card.item');
    expect(cards).toHaveLength(2);

    const card = cards[0];
    expect(card.querySelector('mat-card-title').textContent).toContain(
      sessions[0].name
    );
  });

  it('should have a Create Button if the user if admin', () => {
    expect(component.user?.admin).toBeTruthy();

    const compiled = fixture.nativeElement;

    const createButton = compiled.querySelector('mat-card-header button');
    expect(createButton).toBeTruthy();
    expect(createButton.textContent).toContain('Create');
  });

  it('should not have a Create Button if the user if not admin', () => {
    component.user!.admin = false;
    fixture.detectChanges();

    expect(component.user?.admin).toBeFalsy();

    const compiled = fixture.nativeElement;

    const createButton = compiled.querySelector('mat-card-header button');
    expect(createButton).toBeFalsy();
  });

  it('should have an Edit and a Detail button on a card if the user is admin', () => {
    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('mat-card.item');
    const cardButtons = card.querySelectorAll('mat-card-actions button');
    expect(cardButtons).toBeTruthy();
    expect(cardButtons).toHaveLength(2);
    expect(cardButtons[0].textContent).toContain('Detail');
    expect(cardButtons[1].textContent).toContain('Edit');
  });

  it('should only have a Detail button on a card if the user is not admin', () => {
    component.user!.admin = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('mat-card.item');
    const cardButtons = card.querySelectorAll('mat-card-actions button');
    expect(cardButtons).toBeTruthy();
    expect(cardButtons).toHaveLength(1);
    expect(cardButtons[0].textContent).toContain('Detail');
  });
});
