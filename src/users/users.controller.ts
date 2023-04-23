import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current_user.decorator';
import { AuthGurad } from 'src/guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    console.log('User Created');
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('whoAmI')
  @UseGuards(AuthGurad)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  getAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch(':id')
  updateUSer(@Param('id') id: string, @Body() attrs: UpdateUserDto) {
    return this.userService.update(parseInt(id), attrs);
  }
}
