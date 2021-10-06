import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ credentials: true, origin: 'http://localhost:3001' });
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'src/public/images'), {
    prefix: '/photo',
  });

  await app.listen(3000);
}
bootstrap();
