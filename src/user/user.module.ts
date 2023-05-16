import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmExModule } from 'src/database/typeorm-ex.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
