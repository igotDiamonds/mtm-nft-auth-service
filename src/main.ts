import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:3001', credentials: true },
  });
  app.use(cookieParser());
  await app.listen(3000);

  console.log(`App started at port - ${await app.getUrl()}`);
}
bootstrap();
