import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'duocparty-database.cprhkixavenx.us-east-1.rds.amazonaws.com',
  port: 5432,
  username: 'duocparty_pg_adm',
  password: 'Roma2022',
  database: '',
  entities: [User],
  synchronize: true,
};
