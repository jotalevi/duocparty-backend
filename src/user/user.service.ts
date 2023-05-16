import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createuser.dto';
import { User } from './user.entity';
import { UserEditableFieldsDto } from './dto/usereditablefields.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.createUser(createUserDto);
    const recoToken = await this.userRepository.createRecoToken(user.email);
    return user;
  }

  async getUser(id: string): Promise<User> {
    return this.userRepository.getUser(id);
  }
}
