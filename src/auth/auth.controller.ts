import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Query,
  Redirect,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createuser.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { GetUser } from './get-user.decorator';
import { ReturnTokenDto } from './dto/returntoken.dto';
import { UserRole } from 'src/user/roles.enum';
import { AuthMessageDto } from './dto/authmessage.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ChangePwDto } from './dto/changepw.dto';
import qs from 'qs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<AuthMessageDto> {
    createUserDto.role = UserRole.USER;
    await this.authService.signUp(createUserDto);
    return { message: 'You signed up successfully' };
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<ReturnTokenDto> {
    return await this.authService.signIn(credentiaslsDto, undefined);
  }

  @Post('/forgot')
  async forgot(@Body('email') email: string): Promise<AuthMessageDto> {
    await this.authService.forgot(email);
    return {
      message:
        "We've sent you a email with instructions on how to recover your account",
    };
  }

  @Post('/changepw')
  async change(
    @Body(ValidationPipe) changePwDto: ChangePwDto,
  ): Promise<AuthMessageDto> {
    await this.authService.changePw(changePwDto);
    return { message: 'You have successfuly updated your password' };
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  async getMe(@GetUser() user: User): Promise<User> {
    delete user.password;
    delete user.salt;
    delete user.confirmationToken;
    delete user.recoverToken;
    return user;
  }
}
