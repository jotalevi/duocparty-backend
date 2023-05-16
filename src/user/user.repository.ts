import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/createuser.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';
import { ChangePwDto } from 'src/auth/dto/changepw.dto';
import { AuthMessageDto } from 'src/auth/dto/authmessage.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (await User.findOne({ where: { email: createUserDto.email } }))
      throw new UnprocessableEntityException('028');

    const user = this.create();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.role = createUserDto.role.toUpperCase();
    user.status = true;

    const pass = crypto.randomBytes(16).toString('hex');

    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(pass, user.salt ?? '');

    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505')
        throw new UnprocessableEntityException('028');
      else throw new UnprocessableEntityException('009');
    }
  }

  async getUser(id: string): Promise<User> {
    const user = await User.findOne({ where: { id: id } });
    if (!user) throw new UnprocessableEntityException('010');
    delete user.password;
    delete user.salt;
    delete user.confirmationToken;
    return user;
  }

  async createRecoToken(email: string): Promise<string> {
    const user = await this.findOne({ where: { email, status: true } });
    if (!user) throw new UnprocessableEntityException('018');

    const recoToken = crypto.randomBytes(32).toString('hex');
    user.recoverToken = recoToken;
    await user.save();
    return recoToken;
  }

  async updatePassword(changePwDto: ChangePwDto) {
    const user = await this.findOne({
      where: { recoverToken: changePwDto.recoToken, status: true },
    });
    if (!user) throw new UnprocessableEntityException('018');

    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(
      changePwDto.newPassword,
      user.salt ?? '',
    );

    await user.save();
    delete user.password;
    delete user.salt;
  }

  async activateUser(token: string): Promise<AuthMessageDto> {
    const user = await this.findOne({ where: { confirmationToken: token } });

    if (!user) throw new UnauthorizedException('019');

    user.status = true;
    await user.save();
    return { message: 'user saved' };
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.findOne({ where: { email, status: true } });
    if (!user || !user.salt) throw new UnauthorizedException('020');
    if (user && (await user.checkPassword(password))) return user;
    else throw new UnauthorizedException('020');
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
