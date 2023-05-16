import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { UserRepository } from './user/user.repository';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure() {}
}
