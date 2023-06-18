import { sessions, teacherMock, userMock } from 'cypress/mock';

describe('full client flow', () => {
  // auth
  it('should register', () => {
    cy.visit('/');
    cy.get('[routerlink]').contains('Register').click();

    cy.intercept('POST', '/api/auth/register', {});

    cy.get('input[formControlName=firstName]').type('firstName');
    cy.get('input[formControlName=lastName]').type('lastName');
    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/login');
  });

  // sessions
  it('should login and see the session list', () => {
    cy.login('test@test.com', 'test!1234', false);
    cy.url().should('include', '/sessions');
    cy.get('.item').should('have.length', 2);
  });

  it('should see the details of a session', () => {
    cy.intercept('GET', '/api/session/1', {
      body: sessions[0],
    }).as('session');

    cy.intercept('GET', '/api/teacher/1', {
      body: teacherMock,
    }).as('teacher');

    cy.intercept('GET', '/api/session', {
      body: sessions,
    }).as('sessions');

    cy.get('mat-card-actions button').first().click();
    cy.url().should('include', '/sessions/detail/1');
    cy.get('h1').should('contain', sessions[0].name);
    cy.get('div.description').should('contain', sessions[0].description);
    cy.get('mat-card-subtitle').should(
      'contain',
      `${teacherMock.firstName} ${teacherMock.lastName.toUpperCase()}`
    );
  });

  it('should unenroll from a session', () => {
    cy.intercept('DELETE', '/api/session/1/participate/1', {});
    cy.intercept('GET', '/api/session/1', {
      body: { ...sessions[0], users: [2, 3] },
    }).as('session');

    cy.get('button').contains('Do not participate').should('exist');
    cy.get('button').contains('Do not participate').click();

    cy.get('button').contains('Participate').should('exist');
    cy.get('button').contains('Do not participate').should('not.exist');

    cy.get('div').contains('attendees').should('contain', '2');
  });

  it('should enroll to a session', () => {
    cy.intercept('POST', '/api/session/1/participate/1', {});
    cy.intercept('GET', '/api/session/1', {
      body: { ...sessions[0], users: [1, 2, 3] },
    }).as('session');

    cy.get('button').contains('Participate').should('exist');
    cy.get('button').contains('Participate').click();

    cy.get('button').contains('Participate').should('not.exist');
    cy.get('button').contains('Do not participate').should('exist');

    cy.get('div').contains('attendees').should('contain', '3');
  });

  it('should come back tot the sessions list', () => {
    cy.get('button').first().click();
    cy.url().should('include', '/sessions');
  });

  // Account page
  it('should visit the account page', () => {
    cy.intercept('GET', '/api/user/1', {
      ...userMock,
    });

    cy.get('.link').contains('Account').click();
    cy.url().should('include', '/me');

    // should have the user information
    cy.get('p').contains('John DOE').should('exist');
    cy.get('p').contains('Email: mock@test.com').should('exist');
  });

  // Logout
  it('should logout', () => {
    cy.get('.link').contains('Logout').click();
    cy.url().should('contain', '/');
  });

  // Not Found
  it('should redirect to the not found page', () => {
    cy.visit('/notavalidurlforsure');
    cy.url().should('contain', '/404');
  });
});

describe('admin flow', () => {
  // auth
  it('should login as admin', () => {
    cy.visit('/login');
    cy.login('admin@admin.com', 'admin!1234', true);
    cy.url().should('include', '/sessions');
  });

  it('creates a new session', () => {
    cy.intercept('GET', '/api/teacher', {
      body: [teacherMock],
    });
    cy.get('button').contains('Create').click();
    cy.url().should('include', '/sessions/create');

    cy.intercept('POST', '/api/session', {
      body: {
        id: 3,
        name: 'New session',
        description: 'New session description',
        teacher: 1,
        users: [],
      },
    }).as('session');

    cy.intercept('GET', '/api/session', {
      body: [
        ...sessions,
        {
          id: 3,
          name: 'New session',
          description: 'New session description',
          teacher: 1,
          users: [],
        },
      ],
    }).as('sessions');

    cy.get('input[formControlName=name]').type('New session');
    // set the date by clicking on the calendar
    cy.get('input[formControlName=date]').type('2023-06-15');
    // set the time by clicking on the clock
    cy.get('textarea[formControlName=description]').type(
      'New session description'
    );
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').contains('John Doe').click();

    cy.get('button').contains('Save').click();
  });

  it('should see the new session in the list', () => {
    cy.get('.item').should('have.length', 3);
    cy.get('.item').contains('New session').should('exist');
  });

  // Continuer ?
  it('should see the details of the new session', () => {
    cy.intercept('GET', '/api/session/3', {
      body: {
        id: 3,
        name: 'New session',
        description: 'New session description',
        teacher: 1,
        users: [],
      },
    }).as('session');

    cy.intercept('GET', '/api/teacher/1', {
      body: teacherMock,
    }).as('teacher');
  });
});
