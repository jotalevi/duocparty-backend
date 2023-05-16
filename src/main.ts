import { NestFactory } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AppModule } from './app.module';

require('dotenv').config();

const PORT = process.env.PORT ?? 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(PORT);
}

bootstrap();
