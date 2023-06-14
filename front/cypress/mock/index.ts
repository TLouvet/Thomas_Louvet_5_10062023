import { Session } from 'src/app/features/sessions/interfaces/session.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { User } from 'src/app/interfaces/user.interface';

export const userMock: User = {
  id: 1,
  email: 'mock@test.com',
  lastName: 'Doe',
  firstName: 'John',
  admin: false,
  password: '2134579',
  createdAt: new Date(),
};

export const userSession: SessionInformation = {
  token: 'token',
  type: 'Bearer',
  id: 1,
  username: 'admin',
  firstName: 'admin',
  lastName: 'admin',
  admin: true,
};

export const teacherMock: Teacher = {
  id: 1,
  lastName: 'Doe',
  firstName: 'John',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const sessions: Session[] = [
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
