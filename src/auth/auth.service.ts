import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/createuser.dto';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePwDto } from './dto/changepw.dto';
import { AuthMessageDto } from './dto/authmessage.dto';
import { ReturnTokenDto } from './dto/returntoken.dto';
import { User } from 'src/user/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AuthMessageDto> {
    if (createUserDto.password != createUserDto.passwordConfirmation)
      throw new UnprocessableEntityException('013');

    const user = await this.userRepository.createUser(createUserDto);
    const recoToken = await this.userRepository.createRecoToken(user.email);

    return { message: 'User Created' };
  }

  async forgot(email: string): Promise<AuthMessageDto> {
    const recoToken = await this.userRepository.createRecoToken(email);
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new UnprocessableEntityException('010');

    return { message: 'Password recovery token created' };
  }

  async changePw(changePwDto: ChangePwDto) {
    if (changePwDto.newPassword != changePwDto.newPasswordConfirmation)
      throw new UnprocessableEntityException('013');

    await this.userRepository.updatePassword(changePwDto);
  }

  async mailconfirm(token: string): Promise<AuthMessageDto> {
    return await this.userRepository.activateUser(token);
  }

  async signIn(
    credentialsDto: CredentialsDto,
    userFromMsid: User | undefined = undefined,
  ): Promise<ReturnTokenDto> {
    const user = userFromMsid
      ? userFromMsid
      : await this.userRepository.checkCredentials(credentialsDto);

    if (!user) throw new UnprocessableEntityException('010');
    if (!user.status) throw new UnprocessableEntityException('026');
    const date = new Date();
    date.setHours(new Date().getHours() + 48);
    user.token = crypto.randomBytes(32).toString('hex');
    user.save().then();

    const token = this.jwtService.sign({ id: user.id, scr: user.token });
    return { token: token };
  }
}
