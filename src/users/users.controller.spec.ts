import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  const users: User[] = [];
  fakeUsersService = {
    findOne: (id: number) => {
      return Promise.resolve({
        id,
        email: 'test@email.com',
        password: '12345',
      } as User);
    },
    find: (email: string) => {
      return Promise.resolve(users.filter((user) => user.email === email));
    },
    remove: (id: number) => {
      // remove user with id from users array
      const user = users.find((user) => user.id === id);
      users.splice(users.indexOf(user), 1);
      return Promise.resolve(user);
    },
    update: (id: number, attrs: Partial<User>) => {
      const user = users.find((user) => user.id === id);
      Object.assign(user, attrs);
      users.splice(users.indexOf(user), 1, user);
      return Promise.resolve(user);
    },
  };
  fakeAuthService = {
    signup: (email: string, password: string) => {
      const user = {
        id: Math.floor(Math.random() * 99999),
        email: 'test@email.com',
        password: '12345',
      } as User;
      users.push(user);
      return Promise.resolve(user);
    },
    // signin: (email: string, password: string) => {},
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllUsers returns a list of users with the given email', async () => {
    let users = await controller.getAllUsers('test@email.com');
    expect(users.length).toEqual(0);
    const session:any = {};
    await controller.createUser(
      { email: 'test@email.com', password: '1234' } as CreateUserDto,
      session,
    );
    users = await controller.getAllUsers('test@email.com');
    expect(users.length).toEqual(1);
    expect(session.userId).toBeDefined();
    expect(users[0].email).toEqual('test@email.com');
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.getUser('-1')).rejects.toThrow(NotFoundException);
  });
});
