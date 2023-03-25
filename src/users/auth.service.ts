import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.entity';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users: User[] = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;
    return await this.usersService.create(email, hashedPassword);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    console.log('1',user);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const [salt, hash] = user.password.split('.');
    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;
    if (hashedPassword.toString('hex') !== hash) {
      throw new BadRequestException('Invalid credentials');
    }
    console.log('2',user);
    return user;
  }
}
